const User = require("../models/User");
const OTP = require("../models/OTP");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendOTPEmail } = require("../utils/email");

//-------------Generate token-------------
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

//-------------Register function----------
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!password || password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters long"
    })
  }

  try {
    let userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
      isVerified: false,
    });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.create({ email, otp, action: "account_verification" });
    await sendOTPEmail(email, otp, "account_verification");

    res.status(201).json({
      message: "User registered successfully. Please check your email for the OTP to verify your account.",
      email: newUser.email,
    });
  } catch (error) {
    res.status(500).json({ message: "Error registering user" });
  }
};

//-------------Login function-------------
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check account verification status
    if (!user.isVerified && user.role === "user") {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      await OTP.deleteMany({ email, action: "account_verification" }); // Remove any existing OTPs for this email
      await OTP.create({ email, otp, action: "account_verification" });
      await sendOTPEmail(email, otp, "account_verification");
      return res.status(400).json({
        message:
          "Account not verified. Please check your email for the OTP to verify your account.",
      });
    }

    // Token
    const token = generateToken(user._id, user.role);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in user" });
  }
};

//-------------Verify otp--------------
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const otpRecord = await OTP.findOne({
      email,
      otp,
      action: "account_verification",
    });

    if (!otpRecord) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    const user = await User.findOneAndUpdate(
      { email },
      { isVerified: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await OTP.deleteMany({
      email,
      action: "account_verification",
    });

    return res.status(200).json({
      message: "Account verified successfully. You can now log in.",
    });
  } catch (error) {
    console.error("OTP verification error:", error);

    return res.status(500).json({
      message: "Error verifying OTP",
    });
  }
};
