const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
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
} = require("../controllers/authController");

router.post("/register", auth(["SuperAdmin"]), register);
router.post("/login", login);
router.get("/profile", auth(["Student", "Instructor", "SuperAdmin"]), getProfile);
router.get("/users/:id", auth(["SuperAdmin"]), getUserById);
router.put("/profile", auth(["Student", "Instructor", "SuperAdmin"]), updateProfile);
router.put("/users/:id", auth(["SuperAdmin"]), updateUserById);
router.delete("/users/:id", auth(["SuperAdmin"]), deleteUser);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", auth(["Student", "Instructor", "SuperAdmin"]), resetPassword);
router.post("/refresh-token", refreshToken);
router.post("/test-email", testEmail);

module.exports = router;