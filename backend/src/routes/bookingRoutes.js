const express = require("express");
const { protect, admin } = require("../middleware/authMiddleware");
const {
  bookEvent,
  getMyBookings,
  confirmBooking,
  sendBookingOtp,
  cancelBooking,
  verifyBookingOtp,
} = require("../controllers/bookingController");

const router = express.Router();

// Book an event
router.post("/", protect, bookEvent);

// Send OTP for booking confirmation
router.post("/send-otp", protect, sendBookingOtp);

// Verify OTP for booking confirmation
router.post("/verify-otp", protect, verifyBookingOtp);

// Get all bookings
router.get("/my", protect, getMyBookings);

// Confirm a booking (admin only)
router.put("/:id/confirm", protect, admin, confirmBooking);

// Cancel a booking
router.delete("/:id", protect, cancelBooking);

module.exports = router;
