import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

const HomeCTA = () => {
  return (
    <section className="px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-16 text-center sm:px-12">
          {/* Decorative Glow */}
          <div className="absolute -left-20 -top-20 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-48 w-48 rounded-full bg-violet-500/20 blur-3xl" />

          <div className="relative mx-auto max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-wider text-indigo-300">
              Ready to Get Started?
            </span>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Find Your Next Event
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
              Discover upcoming events, choose your seats, and submit your
              booking request with just a few simple steps.
            </p>

            <Link
              to="/"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-6 py-3 font-medium text-white transition hover:bg-indigo-600"
            >
              Browse Events
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeCTA;
