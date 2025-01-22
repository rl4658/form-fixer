const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

const authenticateToken = require("./Middleware/JwtAuth.js");
const { Logger } = require("./Middleware/Logger.js");
require("dotenv").config();

const userRoutes = require("./Routes/UserRoutes.js");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(Logger);

// Static route to serve uploaded files
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(uploadsDir));

app.use("/users", userRoutes);
app.use("/dashboard", authenticateToken);

// Start the server
app.listen(3000, "192.168.2.19", () => {
    console.log("Server running on http://192.168.2.19:3000");
});
