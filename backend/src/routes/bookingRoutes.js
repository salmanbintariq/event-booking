const express = require("express");
const { protect, admin } = require("../middleware/authMiddleware");
const {
  bookEvent,
  getMyBookings,
  confirmBooking,
  sendBookingOtp,
  cancelBooking,
  verifyBookingOtp,
  getAllBookings,
  rejectBooking,
  getAdminStats
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

// Get all bookings (admin only)
router.get("/", protect, admin, getAllBookings);

// Confirm a booking (admin only)
router.put("/:id/confirm", protect, admin, confirmBooking);

// Cancel a booking
router.delete("/:id", protect, cancelBooking);

// Reject booking (admin only)
router.put("/:id/reject", protect, admin, rejectBooking);

// Admin Stats (admin only)
router.get("/admin-stats", protect, admin, getAdminStats);

module.exports = router;
