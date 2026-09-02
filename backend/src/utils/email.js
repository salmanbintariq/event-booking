const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send OTP email
exports.sendOTPEmail = async (email, otp, type) => {
  try {
    const isAccountVerification = type === "account_verification";

    const title = isAccountVerification
      ? "Verify Your Account"
      : "Confirm Your Booking";

    const message = isAccountVerification
      ? "Use the OTP below to verify your EventBooking account."
      : "Use the OTP below to confirm your event booking.";

    const warning = isAccountVerification
      ? "If you didn't create this account, please ignore this email."
      : "If you didn't request this booking, please ignore this email.";

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: title,

      html: `
        <div style="font-family: Arial; max-width: 500px; margin: auto; padding: 30px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #2563eb;">EventBooking</h2>

          <h3>${title}</h3>

          <p>${message}</p>

          <h1 style="text-align: center; letter-spacing: 8px; color: #2563eb;">
            ${otp}
          </h1>

          <p>This OTP will expire in <strong>5 minutes</strong>.</p>

          <p style="color: #777;">
            ${warning}
          </p>
        </div>
      `,

      text: `EventBooking

        ${title}

        ${message}

        Your OTP is: ${otp}

        This OTP will expire in 5 minutes.

        ${warning}`,
    };

    await transporter.sendMail(mailOptions);

    console.log(`OTP email sent to ${email} for ${type}`);
  } catch (error) {
    console.error(`Error sending OTP email to ${email} for ${type}:`, error);

    throw error;
  }
};

// Send booking confirmation email
exports.sendBookingEmail = async (userEmail, userName, eventTitle) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Booking Confirmation",

      html: `
        <div style="font-family: Arial; max-width: 500px; margin: auto; padding: 30px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #2563eb;">EventBooking</h2>

          <p>Hi ${userName},</p>

          <p>
            Your booking for <strong>${eventTitle}</strong> has been confirmed.
          </p>

          <p>Thank you for using EventBooking!</p>
        </div>
      `,

      text: `Hi ${userName},

        Your booking for ${eventTitle} has been confirmed.

        Thank you for using EventBooking!`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Booking confirmation email sent to ${userEmail}`);
  } catch (error) {
    console.error(`Error sending booking email to ${userEmail}:`, error);
    throw error;
  }
};
