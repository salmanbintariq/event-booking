import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiCalendar,
  FiMapPin,
  FiUsers,
  FiArrowLeft,
} from "react-icons/fi";

import api from "../utils/axios";

const UserDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.get("/bookings/my");

      setBookings(data.bookings);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load your bookings. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-6">
        <p className="text-text-muted">Loading your bookings...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16">
        <div className="rounded-2xl border border-error/20 bg-error/5 px-6 py-10 text-center">
          <p className="font-medium text-error">{error}</p>

          <button
            type="button"
            onClick={fetchBookings}
            className="mt-5 rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:bg-primary-hover"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
      <div className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-text-muted transition hover:text-primary"
        >
          <FiArrowLeft />
          Back to Events
        </Link>

        <h1 className="mt-5 text-3xl font-bold tracking-tight text-text">
          My Bookings
        </h1>

        <p className="mt-2 text-text-muted">
          View your bookings and their current status.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface px-6 py-16 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-text">
            No bookings yet
          </h2>

          <p className="mt-2 text-sm text-text-muted">
            You have not booked any events yet.
          </p>

          <Link
            to="/"
            className="mt-6 inline-block rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:bg-primary-hover"
          >
            Browse Events
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm"
            >
              <div className="grid md:grid-cols-[220px_1fr]">
                <img
                  src={booking.eventId.imageURL}
                  alt={booking.eventId.title}
                  className="h-52 w-full object-cover md:h-full"
                />

                <div className="p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        {booking.eventId.category}
                      </span>

                      <h2 className="mt-3 text-xl font-bold text-text">
                        {booking.eventId.title}
                      </h2>
                    </div>

                    <span
                      className={`w-fit rounded-full px-3 py-1 text-sm font-semibold ${
                        booking.status === "confirmed"
                          ? "bg-success/10 text-success"
                          : "bg-warning/10 text-warning"
                      }`}
                    >
                      {booking.status === "confirmed"
                        ? "Confirmed"
                        : "Pending"}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3 text-sm text-text-muted sm:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <FiCalendar className="text-primary" />
                      <span>
                        {new Date(
                          booking.eventId.date
                        ).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <FiMapPin className="text-primary" />
                      <span>{booking.eventId.location}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <FiUsers className="text-primary" />
                      <span>
                        {booking.seats}
                        {booking.seats === 1 ? " seat" : " seats"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-border pt-5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-muted">
                        Total Amount
                      </span>

                      <span className="text-lg font-bold text-primary">
                        {booking.amount === 0
                          ? "Free"
                          : `Rs. ${booking.amount}`}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm text-text-muted">
                        Payment
                      </span>

                      <span
                        className={`text-sm font-semibold ${
                          booking.paymentStatus === "paid"
                            ? "text-success"
                            : "text-warning"
                        }`}
                      >
                        {booking.paymentStatus === "paid"
                          ? "Paid"
                          : "Unpaid"}
                      </span>
                    </div>
                  </div>

                  {booking.status === "pending" && (
                    <div className="mt-5 rounded-xl bg-warning/10 p-4">
                      <p className="text-sm leading-6 text-text-muted">
                        Your booking request is pending. Once the payment
                        is received, the admin will approve your booking.
                      </p>
                    </div>
                  )}

                  {booking.status === "confirmed" && (
                    <div className="mt-5 rounded-xl bg-success/10 p-4">
                      <p className="text-sm font-medium text-success">
                        Your booking has been confirmed. See you at the event!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default UserDashboard;
