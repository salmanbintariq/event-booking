import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/axios";


const EventDetail = () => {
  const { user } = useAuth();
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEvent = async () => {
    try {
      const { data } = await api.get(`/events/${id}`);

      setEvent(data.event);
    } catch (error) {
      setError("Unable to load this event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-text-muted">Loading event...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6">
        <p className="text-center font-medium text-error">{error}</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6">
        <p className="text-center text-text-muted">Event not found.</p>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
        {/* Event Image */}
        <div className="h-64 overflow-hidden sm:h-80 lg:h-96">
          <img
            src={event.imageURL}
            alt={event.title}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Event Content */}
        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-3 lg:p-10">
          {/* Main Information */}
          <div className="lg:col-span-2">
            {/* Category */}
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
              {event.category}
            </span>

            {/* Title */}
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-text sm:text-4xl">
              {event.title}
            </h1>

            {/* Description */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-text">
                About this event
              </h2>

              <p className="mt-2 leading-7 text-text-muted">
                {event.description}
              </p>
            </div>
          </div>

          {/* Event Details */}
          <div className="rounded-2xl border border-border bg-background p-6">
            <h2 className="text-lg font-semibold text-text">Event Details</h2>

            <div className="mt-5 space-y-4">
              {/* Date */}
              <div>
                <p className="text-sm text-text-muted">Date</p>
                <p className="mt-1 font-medium text-text">
                  {new Date(event.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>

              {/* Location */}
              <div>
                <p className="text-sm text-text-muted">Location</p>
                <p className="mt-1 font-medium text-text">{event.location}</p>
              </div>

              {/* Price */}
              <div>
                <p className="text-sm text-text-muted">Price</p>
                <p className="mt-1 text-xl font-bold text-primary">
                  {event.price === 0 ? "Free" : `Rs. ${event.price}`}
                </p>
              </div>

              {/* Available Seats */}
              <div>
                <p className="text-sm text-text-muted">Available Seats</p>
                <p className="mt-1 font-medium text-text">
                  {event.availableSeats} seats available
                </p>
              </div>
            </div>

            {/* Book Button */}
            <Link
              to={user ? `/events/${event._id}/book` : "/login"}
              className="mt-6 block text-center w-full rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:bg-primary-hover"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EventDetail;
