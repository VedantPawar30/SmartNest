require('dotenv').config();
const nodemailer = require('nodemailer');

exports.mailControl = async (req, res) => {
    try{
        let {email, name, message} = req.body;
        if(!email || !name || !message) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Create a transporter
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        // Send email
        const mailOptions = {
            from: process.env.MAIL_USER,
            to: process.env.MAIL_USER,
            subject: `SmartNest Support msg from ${name}`,
            text: `from ${email}: ${message}`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.messageId);
        res.status(200).json({ message: "Email sent successfully!" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}