const nodemailer = require("nodemailer");
const HttpsStatus = require("http-status-codes");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendRegisteredDetailsEmail = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.error("Missing email credentials in sendRegisteredDetailsEmail");
            return res
                .status(HttpsStatus.INTERNAL_SERVER_ERROR)
                .json({ message: "Email configuration missing" });
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Welcome to the LMS Portal 🎉",
            text: `Hello ${name},\n\nYour account has been created.\n\nEmail: ${email}\nPassword: ${password}\n\nPlease login your account using this details.\n\nBest regards,\nLMS Admin Team`,
        };

        await transporter.sendMail(mailOptions);

        res.status(HttpsStatus.OK).json({
            message: "Registered details email sent successfully",
        });
    } catch (error) {
        console.error("Error in sendRegisteredDetailsEmail:", error);
        res
            .status(HttpsStatus.INTERNAL_SERVER_ERROR)
            .json({ message: "Error sending email", error });
    }
};

module.exports = {
    sendRegisteredDetailsEmail,
};