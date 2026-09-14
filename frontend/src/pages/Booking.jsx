import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiArrowLeft, FiCalendar, FiMapPin, FiUsers } from "react-icons/fi";
import api from "../utils/axios";

const Booking = () => {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [seats, setSeats] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");

  const [otpStep, setOtpStep] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const fetchEvent = async () => {
    try {
      const { data } = await api.get(`/events/${id}`);
      setEvent(data.event);
    } catch (error) {
      setError("Unable to load event details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const handleBooking = async () => {
    try {
      setBookingLoading(true);
      setBookingError("");

      const { data } = await api.post("/bookings", {
        eventId: event._id,
        seats,
      });

      const newBookingId = data.booking._id;

      // Send- otp
      await api.post("/bookings/send-otp", {
        bookingId: newBookingId,
      });

      setBookingId(newBookingId);
      setOtpStep(true);
    } catch (error) {
      setBookingError(
        error.response?.data?.message ||
          "Unable to create booking. Please try again.",
      );
    } finally {
      setBookingLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setOtpLoading(true);
      setBookingError("");
      setResendMessage("");

      const { data } = await api.post("/bookings/verify-otp", {
        bookingId,
        otp,
      });

      // OTP verification was successful
      setOtpVerified(true);

      console.log("Verified booking:", data.booking);
    } catch (error) {
      setBookingError(
        error.response?.data?.message ||
          "Unable to verify OTP. Please try again.",
      );
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setResendLoading(true);
      setBookingError("");
      setResendMessage("");

      await api.post("/bookings/send-otp", {
        bookingId,
      });

      setResendMessage("A new OTP has been sent to your email.");
      setOtp("");
    } catch (error) {
      setBookingError(
        error.response?.data?.message ||
          "Unable to resend OTP. Please try again.",
      );
    } finally {
      setResendLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-6">
        <p className="text-text-muted">Loading booking details...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-2xl border border-error/20 bg-error/5 px-6 py-10 text-center">
          <p className="font-medium text-error">{error}</p>

          <Link
            to="/"
            className="mt-5 inline-block rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:bg-primary-hover"
          >
            Back to Events
          </Link>
        </div>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16 text-center">
        <p className="text-text-muted">Event not found.</p>
      </main>
    );
  }

  const totalAmount = event.price * seats;

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
      <Link
        to={`/events/${event._id}`}
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-text-muted transition hover:text-primary"
      >
        <FiArrowLeft />
        Back to Event
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Event information */}
        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm lg:col-span-2">
          <div className="h-64 overflow-hidden sm:h-80">
            <img
              src={event.imageURL}
              alt={event.title}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="p-6 sm:p-8">
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
              {event.category}
            </span>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-text">
              {event.title}
            </h1>

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3 text-text-muted">
                <FiCalendar className="text-primary" />
                <span>
                  {new Date(event.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>

              <div className="flex items-center gap-3 text-text-muted">
                <FiMapPin className="text-primary" />
                <span>{event.location}</span>
              </div>

              <div className="flex items-center gap-3 text-text-muted">
                <FiUsers className="text-primary" />
                <span>{event.availableSeats} seats available</span>
              </div>
            </div>

            <div className="mt-8 border-t border-border pt-6">
              <h2 className="text-lg font-semibold text-text">
                About this event
              </h2>

              <p className="mt-2 leading-7 text-text-muted">
                {event.description}
              </p>
            </div>
          </div>
        </div>

        {/* Booking summary */}
        <div className="h-fit rounded-2xl border border-border bg-surface p-6 shadow-sm">
          {!otpStep ? (
            <>
              <h2 className="text-xl font-semibold text-text">
                Booking Summary
              </h2>

              <div className="mt-6">
                <p className="text-sm text-text-muted">Price per seat</p>

                <p className="mt-1 text-xl font-bold text-primary">
                  {event.price === 0 ? "Free" : `Rs. ${event.price}`}
                </p>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="seats"
                  className="text-sm font-medium text-text"
                >
                  Number of seats
                </label>

                <input
                  id="seats"
                  type="number"
                  min="1"
                  max={event.availableSeats}
                  value={seats}
                  onChange={(e) => setSeats(Number(e.target.value))}
                  className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
              </div>

              <div className="my-6 border-t border-border" />

              <div className="flex items-center justify-between">
                <span className="font-medium text-text">Total</span>

                <span className="text-xl font-bold text-primary">
                  {totalAmount === 0 ? "Free" : `Rs. ${totalAmount}`}
                </span>
              </div>

              {bookingError && (
                <p className="mt-4 rounded-lg bg-error/5 px-4 py-3 text-sm font-medium text-error">
                  {bookingError}
                </p>
              )}

              <button
                type="button"
                onClick={handleBooking}
                disabled={bookingLoading}
                className="mt-6 w-full rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {bookingLoading ? "Processing..." : "Confirm Booking"}
              </button>
            </>
          ) : (
            <>
              {otpVerified ? (
                <div className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
                    <span className="text-2xl text-success">✓</span>
                  </div>
                  <h2 className="mt-4 text-xl font-semibold text-text">
                    Booking Request Submitted
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-text-muted">
                    Your OTP has been verified successfully. Your booking
                    request has been sent to the admin.
                  </p>
                  <div className="mt-5 rounded-xl bg-warning/10 p-4 text-left">
                    <p className="text-sm font-medium text-text">
                      Booking Status:
                      <span className="text-warning">Pending</span>
                    </p>
                    <p className="mt-2 text-sm leading-6 text-text-muted">
                      Please complete the payment. Once the payment is received,
                      the admin will approve your booking.
                    </p>
                  </div>
                  <Link
                    to="/my-bookings"
                    className="mt-6 inline-block w-full rounded-xl bg-primary px-5 py-3 text-center font-semibold text-white transition hover:bg-primary-hover"
                  >
                    View My Bookings
                  </Link>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-semibold text-text">
                    Verify Your Booking
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-text-muted">
                    We have sent a 6-digit OTP to your email. Enter the OTP
                    below to verify your booking.
                  </p>
                  <div className="mt-6">
                    <label
                      htmlFor="otp"
                      className="text-sm font-medium text-text"
                    >
                      OTP
                    </label>
                    <input
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter 6-digit OTP"
                      className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-center tracking-[0.4em] outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                    />
                  </div>
                  {bookingError && (
                    <p className="mt-4 rounded-lg bg-error/5 px-4 py-3 text-sm font-medium text-error">
                      {bookingError}
                    </p>
                  )}

                  {resendMessage && (
                    <p className="mt-3 text-sm text-success">{resendMessage}</p>
                  )}

                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={otpLoading || otp.length !== 6}
                    className="mt-6 w-full rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {otpLoading ? "Verifying..." : "Verify OTP"}
                  </button>

                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendLoading}
                    className="mt-3 w-full text-sm font-medium text-primary transition hover:text-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {resendLoading ? "Sending..." : "Resend OTP"}
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default Booking;
