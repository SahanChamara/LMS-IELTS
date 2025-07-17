const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Student = require("../models/Student");
const Instructor = require("../models/Instructor");
const SuperAdmin = require("../models/SuperAdmin");
const HttpsStatus = require("../config/statusCode");
const generateToken = require("../utils/generateToken");
const moment = require("moment-timezone");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    logger: true,
    debug: true,
});

transporter.verify((error, success) => {
    if (error) {
        console.error("Transporter verification failed:", error);
        console.error("EMAIL_USER:", process.env.EMAIL_USER);
        console.error("EMAIL_PASS:", process.env.EMAIL_PASS ? "[REDACTED]" : undefined);
    } else {
        console.log("Transporter is ready to send emails");
    }
});

const register = async (req, res) => {
    const {name, email, password, role} = req.body;

    try {
        if (!["Student", "Instructor", "SuperAdmin"].includes(role)) {
            return res.error("Invalid Role", HttpsStatus.BAD_REQUEST);
        }

        let user;
        if (role === "Student") {
            user = await Student.findOne({email});
        } else if (role === "Instructor") {
            user = await Instructor.findOne({email});
        } else if (role === "SuperAdmin") {
            user = await SuperAdmin.findOne({email});
        }

        if (user) {
            return res.error("User already exists", HttpsStatus.CONFLICT);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        if (role === "Student") {
            user = new Student({
                name,
                email,
                password: hashedPassword,
                profile: {
                    phone: "",
                    address: "",
                    preferences: {notifications: true, language: "en"},
                },
            });
        } else if (role === "Instructor") {
            user = new Instructor({
                name,
                email,
                password: hashedPassword,
            });
        } else if (role === "SuperAdmin") {
            user = new SuperAdmin({
                name,
                email,
                password: hashedPassword,
                role: "superadmin",
            });
        }

        await user.save();

        const payload = {id: user._id, role};

        res.success(
            {
                user: {id: user._id, name, email, role},
            },
            "User Registered Successfully",
            HttpsStatus.CREATED,
        )
    } catch (error) {
        console.error("Register Error", error);
        res.error("Error registering user", HttpsStatus.INTERNAL_SERVER_ERROR, error);
    }
};

const login = async (req, res) => {
    const {email, password} = req.body;

    try {
        if (!email || !password) {
            return res.error("Email and password are required", HttpsStatus.BAD_REQUEST);
        }

        let user, role;
        user = await Student.findOne({email});
        if (user) {
            role = "Student";
        } else {
            user = await Instructor.findOne({email});
            if (user) {
                role = "Instructor";
            } else {
                user = await SuperAdmin.findOne({email});
                if (user) {
                    role = "SuperAdmin";
                }
            }
        }

        if (!user) {
            return res.error("User not found", HttpsStatus.NOT_FOUND)
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.error("Invalid credentials", HttpsStatus.UNAUTHORIZED)
        }

        const payload = {id: user._id, role};
        /*const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });*/

        const accessToken = generateToken(payload, "15m");
        const refreshToken = generateToken(payload, "7d");

        user.refreshToken = refreshToken
        await user.save();

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.success(
            {
                user: {id: user._id, name: user.name, email: user.email, role},
            },
            "User Login Successfully",
            HttpsStatus.OK,
        );
    } catch (error) {
        res.error("Error logging in", HttpsStatus.INTERNAL_SERVER_ERROR, error);
    }
};

const getProfile = async (req, res) => {
    try {
        let user;
        if (req.user.role === "Student") {
            user = await Student.findById(req.user.id).select("-password -refreshToken");
        } else if (req.user.role === "Instructor") {
            user = await Instructor.findById(req.user.id).select("-password -refreshToken");
        } else if (req.user.role === "SuperAdmin") {
            user = await SuperAdmin.findById(req.user.id).select("-password -refreshToken");
        }

        if (!user) {
            return res.error("User not found", HttpsStatus.NOT_FOUND);
        }

        res.success(user, "User Profile Fetched Successfully", HttpsStatus.OK);
    } catch (error) {
        res.error("Error fetching profile", HttpsStatus.INTERNAL_SERVER_ERROR, error);
    }
};

const getUserById = async (req, res) => {
    try {
        let user;
        user = await Student.findById(req.params.id).select("-password");
        if (!user) user = await Instructor.findById(req.params.id).select("-password");
        if (!user) user = await SuperAdmin.findById(req.params.id).select("-password");

        if (!user) {
            return res.error("User not found", HttpsStatus.NOT_FOUND);
        }

        res.success(user, "User Fetched Successfully", HttpsStatus.OK);
    } catch (error) {
        res.error("Error fetching user", HttpsStatus.INTERNAL_SERVER_ERROR, error);
    }
};

const updateProfile = async (req, res) => {
    try {
        const {name, email, phone, address, preferences} = req.body;
        let user;

        if (req.user.role === "Student") {
            user = await Student.findById(req.user.id);
            if (!user) return res.error("Error fetching user", HttpsStatus.NOT_FOUND);
            user.name = name || user.name;
            user.email = email || user.email;
            if (phone || address || preferences) {
                user.profile = {
                    phone: phone || user.profile.phone,
                    address: address || user.profile.address,
                    preferences: preferences || user.profile.preferences,
                };
            }
        } else if (req.user.role === "Instructor") {
            user = await Instructor.findById(req.user.id);
            if (!user) return res.error("Error fetching user", HttpsStatus.NOT_FOUND);
            user.name = name || user.name;
            user.email = email || user.email;
        } else if (req.user.role === "SuperAdmin") {
            user = await SuperAdmin.findById(req.user.id);
            if (!user) return res.error("Error fetching user", HttpsStatus.NOT_FOUND);
            user.name = name || user.name;
            user.email = email || user.email;
        }

        await user.save();
        res.success(
            {user: user.toObject({getters: true})},
            "Profile updated successfully",
            HttpsStatus.OK
        )
    } catch (error) {
        res.error("Error updating profile", HttpsStatus.INTERNAL_SERVER_ERROR, error);
    }
};

const updateUserById = async (req, res) => {
    try {
        const {name, email, phone, address, preferences} = req.body;
        let user;

        user = await Student.findById(req.params.id);
        if (user) {
            user.name = name || user.name;
            user.email = email || user.email;
            if (phone || address || preferences) {
                user.profile = {
                    phone: phone || user.profile.phone,
                    address: address || user.profile.address,
                    preferences: preferences || user.profile.preferences,
                };
            }
        } else {
            user = await Instructor.findById(req.params.id);
            if (user) {
                user.name = name || user.name;
                user.email = email || user.email;
            } else {
                user = await SuperAdmin.findById(req.params.id);
                if (user) {
                    user.name = name || user.name;
                    user.email = email || user.email;
                }
            }
        }

        if (!user) {
            return res.error("User not found", HttpsStatus.NOT_FOUND);
        }

        await user.save();
        res.success(
            {user: user.toObject({getters: true})},
            "User Updated Successfully",
            HttpsStatus.OK,
        )
    } catch (error) {
        res.error("Error updating user", HttpsStatus.INTERNAL_SERVER_ERROR, error);
    }
};

const deleteUser = async (req, res) => {
    try {
        let user;
        user = await Student.findByIdAndDelete(req.params.id);
        if (!user) user = await Instructor.findByIdAndDelete(req.params.id);
        if (!user) user = await SuperAdmin.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.error("User not found", HttpsStatus.NOT_FOUND);
        }

        res.success(null, "User deleted successfully", HttpsStatus.OK);
    } catch (error) {
        res.error("Error deleting user", HttpsStatus.INTERNAL_SERVER_ERROR, error);
    }
};

const forgotPassword = async (req, res) => {
    const {email} = req.body;

    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.error("Missing email credentials in forgotPassword:", {
                EMAIL_USER: process.env.EMAIL_USER,
                EMAIL_PASS: process.env.EMAIL_PASS ? "[REDACTED]" : undefined,
            });
            return res.error("Email configuration missing", HttpsStatus.INTERNAL_SERVER_ERROR);
        }

        let user;
        user = await Student.findOne({email});
        if (!user) user = await Instructor.findOne({email});
        if (!user) user = await SuperAdmin.findOne({email});

        if (!user) {
            console.log(`No user found for email: ${email}`);
            return res.error("User not found", HttpsStatus.NOT_FOUND);
        }

        // Prevent generating new OTP if an active one exists
        if (user.resetPasswordExpires && Date.now() < user.resetPasswordExpires) {
            console.log(`Active OTP exists for ${email}, expires at ${user.resetPasswordExpires}`);
            return res.error("An active OTP already exists. Please wait before requesting a new one.", HttpsStatus.BAD_REQUEST);
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetPasswordOTP = otp;
        user.resetPasswordExpires = Date.now() + 600000; // 10 minutes

        try {
            await user.save();
            console.log(`OTP ${otp} saved for user ${email}, expires at ${user.resetPasswordExpires}`);
        } catch (saveError) {
            console.error(`Error saving OTP for ${email}:`, saveError);
            return res.error("Error saving OTP", HttpsStatus.INTERNAL_SERVER_ERROR, saveError);
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset OTP",
            html: `
        <h2>Password Reset Request</h2>
        <p>Dear User,</p>
        <p>You have requested to reset your password. Please use the following One-Time Password (OTP) to proceed:</p>
        <h3 style="color: #007bff;">${otp}</h3>
        <p>This OTP is valid for 10 minutes. If you did not request this, please ignore this email.</p>
        <p>Best regards,<br>EducateLMS Team</p>
      `,
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`OTP email sent to ${email}`);
        } catch (emailError) {
            console.error(`Error sending OTP email to ${email}:`, emailError);
            return res.error("Error sending OTP email", HttpsStatus.INTERNAL_SERVER_ERROR, emailError);
        }

        res.success(null, "OTP sent to email", HttpsStatus.OK);
    } catch (error) {
        console.error("Error in forgotPassword:", error);
        res.error("Error sending OTP", HttpsStatus.INTERNAL_SERVER_ERROR, error);
    }
};

const verifyOTP = async (req, res) => {
    const {email, otp} = req.body;

    try {
        let user;
        user = await Student.findOne({email});
        if (!user) user = await Instructor.findOne({email});
        if (!user) user = await SuperAdmin.findOne({email});

        if (!user) {
            console.log(`No user found for email: ${email}`);
            return res.error(`No User Found For email ${email}`, HttpsStatus.NOT_FOUND);
        }

        console.log("Stored OTP:", user.resetPasswordOTP);
        console.log("Provided OTP:", otp);
        console.log("OTP Expires:", user.resetPasswordExpires);
        console.log("Current Time:", Date.now());

        if (!user.resetPasswordOTP || !user.resetPasswordExpires) {
            console.log("No OTP found for user");
            return res.error("No OTP found. Please request a new one.", HttpsStatus.NOT_FOUND);
        }

        if (String(user.resetPasswordOTP).trim() !== String(otp).trim()) {
            console.log("OTP mismatch");
            return res.error("Invalid OTP", HttpsStatus.BAD_REQUEST);
        }

        if (Date.now() > user.resetPasswordExpires) {
            console.log("OTP expired");
            return res.error("Expired OTP", HttpsStatus.BAD_REQUEST);
        }

        const payload = {
            id: user._id,
            role: user.role || (user instanceof Student ? "Student" : user instanceof Instructor ? "Instructor" : "SuperAdmin"),
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "15m",
        });

        // Clear OTP after successful verification
        user.resetPasswordOTP = undefined;
        user.resetPasswordExpires = undefined;
        try {
            await user.save();
            console.log(`OTP cleared for user ${email}`);
        } catch (saveError) {
            console.error(`Error clearing OTP for ${email}:`, saveError);
            return res.error("Error clearing OTP", HttpsStatus.INTERNAL_SERVER_ERROR, saveError);
        }

        res.success(
            {resetToken: token},
            "OTP Verified",
            HttpsStatus.OK,
        )
    } catch (error) {
        console.error("Error in verifyOTP:", error);
        res.error("Error verifying OTP", HttpsStatus.INTERNAL_SERVER_ERROR, error);
    }
};

const resetPassword = async (req, res) => {
    const {password} = req.body;

    try {
        let user;
        if (req.user.role === "Student") {
            user = await Student.findById(req.user.id);
        } else if (req.user.role === "Instructor") {
            user = await Instructor.findById(req.user.id);
        } else if (req.user.role === "SuperAdmin") {
            user = await SuperAdmin.findById(req.user.id);
        }

        if (!user) {
            return res.error("user Not Found", HttpsStatus.NOT_FOUND);
        }

        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordOTP = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.success(null, "Password reset successfully", HttpsStatus.OK);
    } catch (error) {
        res.error("Error resetting password", HttpsStatus.INTERNAL_SERVER_ERROR, error);
    }
};

const testEmail = async (req, res) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.error("Missing email credentials in testEmail:", {
                EMAIL_USER: process.env.EMAIL_USER,
                EMAIL_PASS: process.env.EMAIL_PASS ? "[REDACTED]" : undefined,
            });
            return res.error("Email configuration missing", HttpsStatus.INTERNAL_SERVER_ERROR);
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: "test@example.com",
            subject: "Test Email",
            text: "This is a test email from Nodemailer.",
        };

        await transporter.sendMail(mailOptions);
        res.success(null, "Test email sent", HttpsStatus.OK);
    } catch (error) {
        console.error("Error in testEmail:", error);
        res.error("Error sending test email", HttpsStatus.INTERNAL_SERVER_ERROR, error);
    }
};

// Refresh Token
const refreshToken = async (req,res) => {
    const refreshToken = req.cookies.refreshToken;
    console.log("refresh Token", refreshToken);
    if(!refreshToken){
        return res.error("No refresh Token Provided", HttpsStatus.UNAUTHORIZED);
    }

    try{
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        console.log("decoded details", decoded)
        let user;

        if(decoded.role === "Student"){
            user = await Student.findOne({_id: decoded.id});
        }else if(decoded.role === "Instructor"){
            user = await Student.findOne({_id: decoded.id});
        }else if(decoded.role === "SuperAdmin"){
            user = await Student.findOne({_id: decoded.id});
        }

        if(!user){
            console.log("User not found for ID:", decoded.id);
            return res.error("User Not Found", HttpsStatus.NOT_FOUND);
        }

/*         if(!user || user.refreshToken !== refreshToken){
            console.log("request Refresh token", refreshToken);
            console.log("user Refresh Token", user.refreshToken);
            return res.error("Invalid refresh Token", HttpsStatus.FORBIDDEN);
        } */

/*        console.log("Request Refresh Token:", refreshToken);
        console.log("User Stored Refresh Token:", user.refreshToken);*/

        if (user.refreshToken !== refreshToken) {
            console.log("Token mismatch detected");
            return res.error("Invalid refresh Token", HttpsStatus.FORBIDDEN);
        }

        const payload = {id: user._id, role: user.role || decoded.role};
        const newAccessToken = generateToken(payload, "15m");
        const newRefreshToken = generateToken(payload, "7d");

        user.refreshToken = newRefreshToken;
        await user.save();
        console.log("New refreshToken saved:", newRefreshToken);

        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000 , // 15 minutes
        });

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.success(
            {accessToken: newAccessToken},
            "Token Refresh",
            HttpsStatus.OK
        );
    }catch (error) {
        console.error("Refresh Token Error Details:", error);
        res.error("Invalid refresh token Error", HttpsStatus.INTERNAL_SERVER_ERROR, error);
    }
}

module.exports = {
    register,
    login,
    getProfile,
    getUserById,
    updateProfile,
    updateUserById,
    deleteUser,
    forgotPassword,
    verifyOTP,
    resetPassword,
    testEmail,
    refreshToken
};