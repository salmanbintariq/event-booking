import { useEffect, useState } from "react";
import EventCard from "./EventCard";
import api from "../utils/axios";

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEvents = async () => {
    try {
      const { data } = await api.get("/events");
      setEvents(data.events);
    } catch (error) {
      setError("Unable to load events. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <section id="events" className="mx-auto max-w-7xl px-6 py-18 lg:px-8">
      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider tetx-primary">
          Discover
        </p>

        <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
          Upcoming Events
        </h2>

        <p className="mt-2 text-text-muted">
          Find your next experience and reserve your seat.
        </p>

        {!loading && (
          <p className="text-sm font-medium text-text-muted">
            {events.length} {events.length === 1 ? "event" : "events"} found
          </p>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <p className="py-10 text-center text-text-muted">Loading events...</p>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-error/20 bg-error/5 px-6 py-8 text-center">
          <p className="font-medium text-error">{error}</p>
        </div>
      )}

      {/* Events Card */}
      {!loading && !error && events.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}

      {/* No Events */}
      {!loading && !error && events.length === 0 && (
        <p className="py-10 text-center text-text-muted">
          No upcoming events found.
        </p>
      )}
    </section>
  );
};

export default UpcomingEvents;
