import { FiCalendar, FiMapPin, FiUsers, FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";

const EventCard = ({ event }) => {
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Event Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={event.imageURL}
          alt={event.title}
          className="h-full w-full object-cover transition duration-500 hover:scale-105"
        />

        {/* Category */}
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary backdrop-blur">
          {event.category}
        </span>

        {/* Price */}
        <span className="absolute right-4 top-4 rounded-full bg-slate-950/80 px-3 py-1 text-sm font-semibold text-white backdrop-blur">
          {event.price === 0 ? "Free" : `$${event.price}`}
        </span>
      </div>

      {/* Event Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="line-clamp-1 text-lg font-semibold text-text">
          {event.title}
        </h3>

        {/* Date */}
        <div className="mt-4 flex items-center gap-2 text-sm text-text-muted">
          <FiCalendar className="shrink-0 text-primary" />
          <span>
            {new Date(event.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Location */}
        <div className="mt-2 flex items-center gap-2 text-sm text-text-muted">
          <FiMapPin className="shrink-0 text-primary" />
          <span className="line-clamp-1">{event.location}</span>
        </div>

        {/* Seats */}
        <div className="mt-2 flex items-center gap-2 text-sm text-text-muted">
          <FiUsers className="shrink-0 text-primary" />
          <span>{event.availableSeats} seats available</span>
        </div>

        {/* Divider */}
        <div className="my-5 border-t border-border" />

        {/* Action */}
        <Link
          to={`/events/${event._id}`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-semibold text-white transition hover:bg-primary-hover"
        >
          View Event
          <FiArrowRight />
        </Link>
      </div>
    </article>
  );
};

export default EventCard;
