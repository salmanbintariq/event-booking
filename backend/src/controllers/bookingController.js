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

    const isDemoMode = process.env.DEMO_MODE === "true";

    if (isDemoMode) {
      booking.otpVerified = true;
      await booking.save();

      return res.status(200).json({
        message: "Booking verified in demo mode.",
        demoMode: true,
      });
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
      status: { $nin: ["cancelled", "rejected"] },
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
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // 2. Make sure OTP was verified
    if (!booking.otpVerified) {
      return res.status(400).json({
        message: "Booking OTP not verified",
      });
    }

    // 3. Check if booking is already confirmed
    if (booking.status !== "pending") {
      return res.status(400).json({
        message: `Booking cannot be confirmed because it is ${booking.status}`,
      });
    }

    // 4. Mark booking as confirmed
    booking.status = "confirmed";
    await booking.save();

    // 5. Send confirmation email
    await sendBookingEmail(
      booking.userId.email,
      booking.userId.name,
      booking.eventId.title,
    );

    return res.status(200).json({
      message: "Booking confirmed successfully",
      booking,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

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
};

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

// @desc get all bookings
// @access Admin
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "name email")
      .populate("eventId", "title date location category price imageURL")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Bookings fetched successfully",
      bookings,
    });
  } catch (error) {
    console.error("Error fetching all bookings:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// @desc reject booking (admin only)
exports.rejectBooking = async (req, res) => {
  try {
    const { id } = req.params;

    // Find booking
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({
        message: `Booking cannot be rejected because it is ${booking.status}`,
      });
    }

    // Find event
    const event = await Event.findById(booking.eventId);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    // 5. Reject booking
    booking.status = "rejected";

    // 6. Return reserved seats
    event.availableSeats += booking.seats;

    await booking.save();
    await event.save();

    return res.status(200).json({
      message: "Booking rejected successfully",
      booking,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// @desc Get admin dashboard statistics
exports.getAdminStats = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();

    const totalBookings = await Booking.countDocuments();

    const pendingBookings = await Booking.countDocuments({
      status: "pending",
    });

    const revenueResult = await Booking.aggregate([
      {
        $match: {
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
        },
      },
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    return res.status(200).json({
      totalEvents,
      totalBookings,
      pendingBookings,
      totalRevenue,
    });
  } catch (error) {
    console.error("Error fetching admin statistics:", error);

    return res.status(500).json({
      message: "Error fetching admin statistics",
    });
  }
};
