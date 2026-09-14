import { useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiSearch, FiTag } from "react-icons/fi";
import UpcomingEvents from "../components/UpcomingEvents";
import HowItWorks from "../components/HowItWorks";
import WhyEventBooking from "../components/WhyEventBooking";
import HomeCTA from "../components/HomeCTA";
import Footer from "../components/Footer";

const Home = () => {
  const [search, setSearch] = useState("");

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950">
        {/* Background glow */}
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/30 blur-3xl" />

        <div className="absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-accent/25 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-24 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur">
              <FiTag className="text-indigo-300" />

              <span>Discover. Book. Experience.</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Discover events worth
              <span className="block bg-linear-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                showing up for.
              </span>
            </h1>

            {/* Description */}
            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Find exciting events, secure your seat, and manage your bookings
              effortlessly — all in one place.
            </p>

            {/* Search */}
            <div className="mx-auto mt-10 max-w-2xl">
              <div className="relative">
                <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-xl text-slate-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search events by title, location, or category..."
                  className="w-full rounded-2xl border border-white/10 bg-white px-14 py-4 text-sm text-text shadow-2xl outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/20 sm:text-base"
                />
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="#events"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary-hover"
              >
                Explore Events
                <FiArrowRight />
              </a>

              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      <UpcomingEvents/>
      <WhyEventBooking/>
      <HowItWorks/>
      <HomeCTA/>
      <Footer/>
    </main>
  );
};

export default Home;
