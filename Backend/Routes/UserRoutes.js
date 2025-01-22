const express = require('express');
const router = express.Router();
const crypto = require("crypto");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const db = require("../Database/Connect.js");
const userDB = db.collection("Users");

const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;
const JwtAuth = require("../Middleware/JwtAuth.js");

const { getTime } = require("../Middleware/Logger.js");
const CustomDate = require("../Helpers/Time.js");
const EmailService = require("../Services/EmailService.js");
const SecurityService = require("../Services/SecurityService.js");

// Ensure the `uploads` directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `profile_${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});
const upload = multer({ storage });

// Endpoint to update profile picture
router.post('/update-profile-picture', JwtAuth, upload.single('profilePicture'), async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const filePath = `/uploads/${file.filename}`;

        // Update the user's profile picture in the database
        const user = req.user; // Extracted from JWT middleware
        const result = await userDB.updateOne(
            { email: user.email },
            { $set: { profilePicture: filePath, updatedAt: new Date() } }
        );

        if (result.modifiedCount === 0) {
            return res.status(400).json({ error: "Failed to update profile picture" });
        }

        res.status(200).json({ imageUrl: filePath });
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Handle login
router.post("/login", async (req, res) => {
    console.log("Request Type: Login Attempt");

    const { email: incoming_email, password: incoming_password } = req.body || {};

    if (!incoming_email || !incoming_password) {
        console.log(!incoming_email ? "Email is missing" : "Password is missing");
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        const user = await userDB.findOne({ email: incoming_email });
        if (!user || !(await SecurityService.verifyPassword(incoming_password, user.password))) {
            console.log("Invalid email or password");
            return res.status(403).json({ error: "Invalid email or password" });
        }

        if (!user.isVerified) {
            console.log("Email not verified");
            return res.status(403).json({ error: "Please verify your email address" });
        }

        await userDB.updateOne({ email: incoming_email }, { $set: { isLoggedIn: true } });
        user.isLoggedIn = true;

        const token = jwt.sign(user, secret, { expiresIn: "1h" });
        console.log("Login Successful! " + getTime());
        res.json([user, token]);
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Handle registration
router.put("/register", async (req, res) => {
    console.log("Request Type: Register Account");
    let { email, password, age, fname, lname } = req.body || {};

    if (!email || !password || !age || !fname || !lname) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const existingUser = await userDB.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: "User with this email already exists." });
        }

        password = await SecurityService.hashPassword(password);

        const newUser = {
            email,
            password,
            age,
            fname,
            lname,
            isLoggedIn: false,
            isVerified: false,
            profilePicture: null,
            createdAt: new CustomDate().convertDateToWords(true),
            updatedAt: new CustomDate().convertDateToWords(true),
        };

        const result = await userDB.insertOne(newUser);

        if (result.acknowledged) {
            const token = jwt.sign({ email }, secret, { expiresIn: "1h" });
            const verificationLink = `${process.env.SERVER_HOST}/users/verify-email?token=${token}`;

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Verify Your Email Address",
                html: `<p>Hi ${fname},</p><p>Thank you for registering. Verify your email by clicking <a href="${verificationLink}">here</a>.</p>`,
            };

            await EmailService.sendEmail(mailOptions);
            res.status(201).json({ message: "User registered successfully. Verification email sent." });
        } else {
            res.status(500).json({ error: "Failed to register user." });
        }
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
