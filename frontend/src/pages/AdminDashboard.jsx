import { useState, useEffect } from "react";
import CreateEvent from "../components/admin/CreateEvent";
import api from "../utils/axios";

const AdminDashboard = () => {
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");

  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  const [selectedEvent, setSelectedEvent] = useState(null);

  const [stats, setStats] = useState({
    totalEvents: 0,
    totalBookings: 0,
    pendingBookings: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/bookings/admin-stats");

        setStats(response.data);
      } catch (error) {
        console.error(
          "Error fetching admin statistics:",
          error.response?.data || error.message,
        );
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get("/bookings");

        setBookings(response.data.bookings);
      } catch (error) {
        console.error(
          "Error fetching bookings:",
          error.response?.data || error.message,
        );
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchBookings();
  }, []);

  const handleConfirmBooking = async (bookingId) => {
    try {
      setActionLoading(bookingId);
      setActionMessage("");
      setActionError("");

      await api.put(`/bookings/${bookingId}/confirm`);

      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: "confirmed" }
            : booking,
        ),
      );

      setActionMessage("Booking confirmed successfully.");
    } catch (error) {
      setActionError(
        error.response?.data?.message || "Failed to confirm booking.",
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectBooking = async (bookingId) => {
    try {
      setActionLoading(bookingId);
      setActionMessage("");
      setActionError("");

      await api.put(`/bookings/${bookingId}/reject`);

      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: "rejected" }
            : booking,
        ),
      );

      setActionMessage("Booking rejected successfully.");
    } catch (error) {
      setActionError(
        error.response?.data?.message || "Failed to reject booking.",
      );
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get("/events");

        setEvents(response.data.events);
      } catch (error) {
        console.error(
          "Error fetching events:",
          error.response?.data || error.message,
        );
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, []);

  const handleEventUpdated = (updatedEvent) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event._id === updatedEvent._id ? updatedEvent : event,
      ),
    );
  };

  const handleEventCreated = (newEvent) => {
    setEvents((prevEvents) => [newEvent, ...prevEvents]);
  };

  const handleEventDeleted = async (eventId) => {
    try {
      setActionLoading(eventId);
      setActionMessage("");
      setActionError("");

      await api.delete(`/events/${eventId}`);

      setEvents((prevEvents) =>
        prevEvents.filter((event) => event._id !== eventId),
      );

      setActionMessage("Event deleted successfully.");
    } catch (error) {
      setActionError(
        error.response?.data?.message || "Failed to delete event.",
      );
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <>
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Dashboard Header */}
        <section className="mb-8">
          <h1 className="text-3xl font-bold text-text">Admin Dashboard</h1>

          <p className="mt-2 text-text-muted">
            Manage your events, bookings, and platform activity.
          </p>
        </section>

        {/* Statistics */}
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total events */}
          <div className="border border-border bg-surface rounded-xl p-6 shadow-sm">
            <p className="text-sm font-medium text-text-muted">Total Events</p>
            <h2 className="mt-2 text-3xl font-bold text-text">
              {stats.totalEvents}
            </h2>
            <p className="mt-2 text-sm text-text-muted">Events created</p>
          </div>
          {/* Total Bookings */}
          <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
            <p className="text-sm font-medium text-text-muted">
              Total Bookings
            </p>

            <h2 className="mt-2 text-3xl font-bold text-text">
              {stats.totalBookings}
            </h2>

            <p className="mt-2 text-sm text-text-muted">All bookings</p>
          </div>
          {/* Pending Bookings */}
          <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
            <p className="text-sm font-medium text-text-muted">
              Pending Bookings
            </p>

            <h2 className="mt-2 text-3xl font-bold text-text">
              {stats.pendingBookings}
            </h2>

            <p className="mt-2 text-sm text-text-muted">
              Awaiting confirmation
            </p>
          </div>
          {/* Total Revenue */}
          <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
            <p className="text-sm font-medium text-text-muted">Total Revenue</p>

            <h2 className="mt-2 text-3xl font-bold text-text">
              Rs. {stats.totalRevenue.toLocaleString()}
            </h2>

            <p className="mt-2 text-sm text-text-muted">
              From confirmed bookings
            </p>
          </div>
        </section>

        {/* Recent Bookings */}
        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-text">
                Recent Bookings
              </h2>

              <p className="mt-1 text-sm text-text-muted">
                Latest bookings from your events.
              </p>
            </div>

            <button
              type="button"
              className="text-sm font-medium text-primary transition hover:text-primary-hover"
            >
              View All
            </button>
          </div>

          {actionMessage && (
            <div className="mb-4 rounded-lg border border-success/20 bg-success/10 px-4 py-3 text-sm font-medium text-success">
              {actionMessage}
            </div>
          )}

          {actionError && (
            <div className="mb-4 rounded-lg border border-error/20 bg-error/10 px-4 py-3 text-sm font-medium text-error">
              {actionError}
            </div>
          )}

          <div className="overflow-x-auto rounded-xl border border-border bg-surface shadow-sm">
            <table className="w-full min-w-175">
              <thead>
                <tr className="text-left text-sm font-medium text-text-muted">
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Event</th>
                  <th className="px-4 py-3">Seats</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {bookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="border-t border-border transition hover:bg-background"
                  >
                    {/* User */}
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-text">
                          {booking.userId.name}
                        </p>
                        <p className="text-xs text-text-muted">
                          {booking.userId.email}
                        </p>
                      </div>
                    </td>

                    {/* Event */}
                    <td className="px-4 py-4 font-medium text-text">
                      {booking.eventId.title}
                    </td>

                    {/* Seats */}
                    <td className="px-4 py-4 text-text">{booking.seats}</td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          booking.status === "confirmed"
                            ? "bg-success/10 text-success"
                            : booking.status === "rejected"
                              ? "bg-error/10 text-error"
                              : booking.status === "cancelled"
                                ? "bg-text-muted/10 text-text-muted"
                                : "bg-warning/10 text-warning"
                        }`}
                      >
                        {booking.status.charAt(0).toUpperCase() +
                          booking.status.slice(1)}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="px-4 py-4 font-medium text-text">
                      Rs. {booking.amount.toLocaleString()}
                    </td>

                    <td className="px-4 py-4">
                      {booking.status === "pending" ? (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleConfirmBooking(booking._id)}
                            disabled={actionLoading === booking._id}
                            className="rounded-lg bg-success px-3 py-2 text-xs font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {actionLoading === booking._id
                              ? "Processing..."
                              : "Confirm"}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRejectBooking(booking._id)}
                            disabled={actionLoading === booking._id}
                            className="rounded-lg bg-error px-3 py-2 text-xs font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {actionLoading === booking._id
                              ? "Processing..."
                              : "Reject"}
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-text-muted">
                          No action
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Event Management */}
        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-text">
                Event Management
              </h2>

              <p className="mt-1 text-sm text-text-muted">
                Create, edit, and manage your events.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedEvent(null);
                setShowCreateEvent(true);
              }}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-hover"
            >
              Create Event
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border bg-surface shadow-sm">
            <table className="w-full min-w-225">
              <thead>
                <tr className="text-left text-sm font-medium text-text-muted">
                  <th className="px-4 py-3">Event</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Seats</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loadingEvents ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-4 py-8 text-center text-sm text-text-muted"
                    >
                      Loading events...
                    </td>
                  </tr>
                ) : events.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-4 py-8 text-center text-sm text-text-muted"
                    >
                      No events found.
                    </td>
                  </tr>
                ) : (
                  events.map((event) => (
                    <tr
                      key={event._id}
                      className="border-t border-border transition hover:bg-background"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={event.imageURL}
                            alt={event.title}
                            className="h-12 w-16 rounded-lg object-cover"
                          />

                          <div>
                            <p className="font-medium text-text">
                              {event.title}
                            </p>

                            <p className="text-xs text-text-muted">
                              {event.location}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-text">{event.category}</td>

                      <td className="px-4 py-4 text-text">
                        {new Date(event.date).toLocaleDateString()}
                      </td>

                      <td className="px-4 py-4 text-text">
                        {event.availableSeats}/{event.totalSeats}
                      </td>

                      <td className="px-4 py-4 font-medium text-text">
                        Rs. {event.price.toLocaleString()}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedEvent(event);
                              setShowCreateEvent(true);
                            }}
                            className="rounded-lg bg-primary px-3 py-2 text-xs font-medium text-white transition hover:bg-primary-hover"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleEventDeleted(event._id)}
                            disabled={actionLoading === event._id}
                            className="rounded-lg bg-error px-3 py-2 text-xs font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {actionLoading === event._id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Create Event Modal */}
      {showCreateEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl">
            <CreateEvent
              onClose={() => {
                setShowCreateEvent(false);
                setSelectedEvent(null);
              }}
              event={selectedEvent}
              onEventUpdated={handleEventUpdated}
              onEventCreated={handleEventCreated}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboard;
