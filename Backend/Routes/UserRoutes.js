const express = require('express');
const router = express.Router()
const crypto = require("crypto");


const db = require("../Database/Connect.js")
const userDB = db.collection("Users")

const jwt = require("jsonwebtoken")
const secret = process.env.JWT_SECRET;
const JwtAuth = require("../Middleware/JwtAuth.js")

const { getTime } = require("../Middleware/Logger.js")
const CustomDate = require("../Helpers/Time.js")
const EmailService = require("../Services/EmailService.js")
const SecurityService = require("../Services/SecurityService.js")
let temp;

//handle login
router.post("/login", async (req, res) => {
    console.log("Request Type: Login Attempt");

    const { email: incoming_email, password: incoming_password } = req.body || {};

    if (!incoming_email || !incoming_password) {
        console.log(
            !incoming_email ? "Email is missing" : "Password is missing"
        );
        res.status(400).json({ error: "Email and password are required" });
        return;
    }

    try {
        // Fetch user by email
        const user = await userDB.findOne({ email: incoming_email });
        console.log(user)
        if (!user) {
            console.log("Invalid Email");
            console.log(`Login Failed: email: ${incoming_email}, password: ${incoming_password}`);
            res.status(400).json({ error: "Invalid email or password" });
            return;
        }

        // Compare password
        if (!await SecurityService.verifyPassword(incoming_password, user.password)) {
            console.log(`Login Failed: email: ${incoming_email}, password: ${incoming_password}`);
            res.status(403).json({ error: "Invalid email or password" });
            return;
        }

        //check email verification
        if (!user.isVerified) {
            console.log("Login Failed: Email not verified");
            return res.status(403).json({ error: "Please verify your email address" });
        }

        //Login Successful Generate JWT token
        await userDB.updateOne(
            { email: incoming_email },
            { $set: { isLoggedIn: true } }
        );// Update user document in database
        user.isLoggedIn = true
        const token = jwt.sign(user, secret, { expiresIn: "1h" });
        console.log("Login Successful! " + getTime());
        res.json([user, token]);

    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


//handle Register Account
router.put("/register", async (req, res) => {
    console.log("Request Type: Register Account");
    let { email, password, age, fname, lname } = req.body || {};

    // Check for missing fields
    const missingFields = [];
    if (!email) missingFields.push("email");
    if (!password) missingFields.push("password");
    if (!age) missingFields.push("age");
    if (!fname) missingFields.push("first name");
    if (!lname) missingFields.push("last name");

    if (missingFields.length > 0) {
        console.log("Missing fields:", missingFields.join(", "));
        return res
            .status(400)
            .json({ error: `Missing fields: ${missingFields.join(", ")}` });
    }

    try {
        // Check if user already exists
        const existingUser = await userDB.findOne({ email });
        if (existingUser) {
            console.log("User with this email already exists:", email);
            return res
                .status(409)
                .json({ error: "User with this email already exists." });
        }
        password = await SecurityService.hashPassword(password)
        // Add user to the database
        const newUser = {
            email,
            password, // You should hash the password in production
            age,
            fname,
            lname,
            isLoggedIn: false,
            isVerified: false,
            createdAt: new CustomDate().convertDateToWords(true),
            updatedAt: new CustomDate().convertDateToWords(true),
        };

        const result = await userDB.insertOne(newUser);

        // Check if user was successfully added
        if (result.acknowledged) {
            console.log("User added successfully:", newUser);

            // Generate email verification token
            const token = jwt.sign({ email }, secret, { expiresIn: "1h" });

            // Email verification link
            const verificationLink = `${process.env.SERVER_HOST}/users/verify-email?token=${token}`;

            // Send email
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Verify Your Email Address",
                html: `
                    <p>Hi ${fname},</p>
                    <p>Thank you for registering for FormFixer. Please verify your email address by clicking the link below:</p>
                    <a href="${verificationLink}">${verificationLink}</a>
                    <p>This link will expire in 1 hour.</p>
                `,
            };

            //send email
            await EmailService.sendEmail(mailOptions)

            res.status(201).json({
                message:
                    "User registered successfully. A verification email has been sent to your email address.",
            });

        } else {
            console.error("Error adding user to the database:", result);
            res.status(500)
                .json({ error: "Failed to register user." });
        }
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

// Email Verification Route
router.get("/verify-email", async (req, res) => {
    console.log("Request Tye: Email Verification")
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ error: "Missing verification token." });
    }

    try {
        // Verify the token
        const { email } = jwt.verify(token, secret);

        // Update the user as verified
        const result = await userDB.updateOne(
            { email },
            { $set: { isVerified: true, updatedAt: new CustomDate().convertDateToWords(true) } }
        );

        if (result.modifiedCount > 0) {
            console.log(email + " has been verifed")
            res.send(
                `<h1>Email Verified</h1><p>Your email has been successfully verified.</p>`
            );
        } else {
            res.status(400).json({ error: "Email verification failed." });
        }
    } catch (error) {
        console.error("Error during email verification:", error);
        res.status(500).json({ error: "Invalid or expired token." });
    }
});

router.post("/forgot-password", async (req, res) => {
    console.log("Request Type: Forgot Password");
    console.log("Request Body:", req.body);
    const { email } = req.body;
    temp = email
    if (!email) {
        return res.status(400).json({ error: "Email is required." });
    }

    try {
        const user = await userDB.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        // Generate a random 6-digit code
        const code = crypto.randomInt(100000, 999999).toString();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your Password Reset Code",
            html: `
                <p>Hello,</p>
                <p>You requested a password reset on FormFixer.AI. Use the code below to reset your password:</p>
                <h2>${code}</h2>
                <p>If you did not request this, please ignore this email.</p>
            `,
        };

        await EmailService.sendEmail(mailOptions);

        // Send the code to the client (secure handling should be considered in production)
        res.status(200).json({
            message: "Password reset code sent successfully.",
            code, // Include the code in the response
        });
    } catch (error) {
        console.error("Error during password reset:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});


router.post("/updatePassword", async (req, res) => {
    console.log("Request Type: Update Password")
    const { password } = req.body;
    console.log(temp)
    const hashedPassword = await SecurityService.hashPassword(password);
    const user = await userDB.findOne({ email: temp });
    if (user) {
        await userDB.updateOne({ email: temp }, {
            $set: {
                password: hashedPassword
            }
        });
        res.json({ message: "Password updated successfully" });
    } else {
        res.status(404).json({ error: "User not found" });
    }


})

// Handle update user request
router.put("/update", JwtAuth, async (req, res) => {
    console.log("Incoming Request: Update User");
    const { fname, lname, age } = req.body;

    if (!fname || !lname || !age) {
        console.log("Error: Missing fields in request body");
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const user = req.user; // Retrieved via JWT middleware
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        // Update the user in MongoDB
        const result = await userDB.updateOne(
            { email: user.email }, // Find by email from JWT
            {
                $set: {
                    fname,
                    lname,
                    age,
                    updatedAt: new Date(),
                },
            }
        );

        if (result.modifiedCount === 0) {
            return res.status(400).json({ error: "Failed to update user" });
        }

        console.log("User updated successfully");
        res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router
