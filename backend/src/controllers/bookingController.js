const Booking = require("../models/Bookings");
const Event = require("../models/Event");
const OTP = require("../models/OTP");
const { sendOTPEmail, sendBookingEmail } = require("../utils/email");

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
};

// @desc send booking OTP email
exports.sendBookingOtp = async (req, res) => {
  try {
    const { bookingId } = req.body;

    // 1. Find booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // 2. Make sure the booking belongs to the logged-in user
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to access this booking" });
    }

    // 3. Generate OTP
    const otp = generateOTP();

    // 4. Remove any previous booking OTP
    await OTP.deleteMany({
      email: req.user.email,
      action: "event_booking",
    });

    // 5. Save new OTP
    await OTP.create({
      email: req.user.email,
      otp,
      action: "event_booking",
    });

    // 6. Send OTP email
    await sendOTPEmail(req.user.email, otp, "event_booking");

    return res
      .status(200)
      .json({ message: "OTP sent successfully. Please check your email." });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// @desc book event
exports.bookEvent = async (req, res) => {
  try {
    const { eventId, seats } = req.body;

    // 1. Validate seats
    if (!seats || seats < 1) {
      return res.status(400).json({ message: "Invalid number of seats" });
    }

    // 2. Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // 3. Check if user already has an active booking
    const existingBooking = await Booking.findOne({
      userId: req.user._id,
      eventId: event._id,
      status: { $ne: "cancelled" },
    });
    if (existingBooking) {
      return res
        .status(400)
        .json({ message: "You have already booked this event" });
    }

    // 4. Check if enough seats are available
    if (event.availableSeats < seats) {
      return res
        .status(400)
        .json({ message: `Only ${event.availableSeats} seats available` });
    }

    // 5. Total amount
    const amount = event.price * seats;

    // 6. Create booking
    const booking = await Booking.create({
      userId: req.user._id,
      eventId: event._id,
      seats,
      amount,
      status: "pending", // Initial status
      paymentStatus: "unpaid", // Initial payment status
    });

    // 7. Reserve the seats
    event.availableSeats -= seats;
    await event.save();

    return res.status(201).json({
      message: "Event booked successfully. Please verify the OTP.",
      booking,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// @desc verify booking OTP
exports.verifyBookingOtp = async (req, res) => {
  try {
    const { bookingId, otp } = req.body;

    // 1. Validate input
    if (!bookingId || !otp) {
      return res.status(400).json({
        message: "Booking ID and OTP are required",
      });
    }

    // 2. Find booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // 3. Make sure the booking belongs to the logged-in user
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to access this booking" });
    }

    // 4. Find OTP
    const otpRecord = await OTP.findOne({
      email: req.user.email,
      action: "event_booking",
    });
    if (!otpRecord) {
      return res
        .status(400)
        .json({ message: "No OTP found. Please request a new OTP." });
    }

    // 5. Check if OTP matches
    if (otpRecord.otp !== otp) {
      return res
        .status(400)
        .json({ message: "Invalid OTP. Please try again." });
    }

    // 6. Mark booking as otp verified
    booking.otpVerified = true;
    await booking.save();

    // 7. Delete the OTP record
    await OTP.deleteOne({ _id: otpRecord._id });

    return res.status(200).json({
      message: "OTP verified successfully. You can now proceed with payment.",
      booking,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// @desc confirm booking (admin only)
exports.confirmBooking = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Find booking
    const booking = await Booking.findById(id)
    .populate("userId", "name email")
    .populate("eventId", "title");

    if (!booking) {
      return res.status(404).json({message: "Booking not found"});
    }

    // 2. Make sure OTP was verified
    if (!booking.otpVerified) {
      return res.status(400).json({message: "Booking OTP not verified"});
    }

    // 3. Check if booking is already confirmed
    if (booking.status === "confirmed") {
      return res.status(400).json({message: "Booking is already confirmed"});
    }

    // 4. Payment status
    if (booking.paymentStatus ==="paid") {
      return res.status(400).json({message: "Booking is already paid"});
    }

    // 5. Mark payment as paid
    booking.paymentStatus = "paid";

    // 6. Mark booking as confirmed
    booking.status = "confirmed";
    await booking.save();

    // 7. Send confirmation email
    await sendBookingEmail(
      booking.userId.email,
      booking.userId.name,
      booking.eventId.title,
    );

    return res.status(200).json({
      message: "Booking confirmed and payment verified successfully",
      booking,
    });

  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

// @desc cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Find booking
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

     // 2. Make sure the booking belongs to the logged-in user
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to cancel this booking",
      });
    }

    // 3. Check if booking is already cancelled
    if (booking.status === "cancelled") {
      return res.status(400).json({
        message: "Booking is already cancelled",
      });
    }

    // 4. Check if payment has already been made
    if (booking.paymentStatus === "paid") {
      return res.status(400).json({
        message: "Paid bookings cannot be cancelled. Please contact the admin.",
      });
    }

    // 5. Find event
    const event = await Event.findById(booking.eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // 6. Cancel the booking
    booking.status = "cancelled";

    // 7. Return reserved seats to the event
    event.availableSeats += booking.seats;

    await booking.save();
    await event.save();

    return res.status(200).json({
      message: "Booking cancelled successfully",
      booking,
    });


  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

// @desc get logged-in user's bookings
exports.getMyBookings = async (req, res) => {
  try {
    // 1. Find bookings belonging to the logged-in user
    const bookings = await Booking.find({
      userId: req.user._id,
    })
      .populate("eventId", "title date location category price imageURL")
      .sort({ createdAt: -1 });

    // 2. Return bookings
    return res.status(200).json({
      message: "Bookings fetched successfully",
      bookings,
    });
  } catch (error) {
    console.error("Error fetching user bookings:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};