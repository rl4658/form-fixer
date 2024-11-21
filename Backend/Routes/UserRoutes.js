const express = require('express');
const router = express.Router()

const db = require("../Database/Connect.js")
const userDB = db.collection("Users")

const jwt = require("jsonwebtoken")
const secret = process.env.JWT_SECRET;
const JwtAuth = require("../Middleware/JwtAuth.js")

const { getTime } = require("../Middleware/Logger.js")
const CustomDate = require("../Helpers/Time.js")
const EmailService = require("../Services/EmailService.js")
const SecurityService = require("../Services/SecurityService.js")


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

//handle Sign Out

router.post("/signout", JwtAuth, async (req, res) => {
    console.log("Request Type: Sign Out")
    const user = req.user
    await userDB.updateOne(
        { email: user.email },
        { $set: { isLoggedIn: false } })
    console.log(`${user.fname} has signed out`)
    res.json()
})


module.exports = router