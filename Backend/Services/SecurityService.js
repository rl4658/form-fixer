const bcrypt = require('bcrypt');

class SecurityService {
    constructor() {
        this.saltRounds = 10; // Number of salt rounds for hashing
    }

    /**
     * Hash a plain-text password
     * @param {string} plainTextPassword - The plain text password to hash.
     * @returns {Promise<string>} - A promise that resolves to the hashed password.
     */
    async hashPassword(plainTextPassword) {
        try {
            const hashedPassword = await bcrypt.hash(plainTextPassword, this.saltRounds);
            console.log("Password hashed successfully");
            return hashedPassword;
        } catch (error) {
            console.error("Error hashing password:", error);
            throw error;
        }
    }

    /**
     * Verify if a plain-text password matches a hashed password
     * @param {string} plainTextPassword - The plain text password to verify.
     * @param {string} hashedPassword - The hashed password to compare against.
     * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating if the passwords match.
     */
    async verifyPassword(plainTextPassword, hashedPassword) {
        try {
            const isMatch = await bcrypt.compare(plainTextPassword, hashedPassword);
            if (isMatch) {
                console.log("Password is correct!");
            } else {
                console.log("Password is incorrect.");
            }
            return isMatch;
        } catch (error) {
            console.error("Error verifying password:", error);
            throw error;
        }
    }
}

module.exports = new SecurityService(); 
