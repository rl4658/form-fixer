const nodemailer = require("nodemailer");
require("dotenv").config();

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MY_EMAIL,
                pass: process.env.MY_EMAIL_PASS,
            },
        });
    }

    async sendEmail(mailOptions) {

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log(`Email sent: ${info.response}`);
            return { success: true, message: "Email sent successfully." };
        } catch (error) {
            console.error(`Error sending email: ${error.message}`);
            return { success: false, message: error.message };
        }
    }
}

module.exports = new EmailService();
