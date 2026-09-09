const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { registerUser, loginUser, verifyOTP, getMe, logout } = require("../controllers/authController");


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOTP);
router.get("/me", protect, getMe);
router.post("/logout", protect, logout);

module.exports = router;