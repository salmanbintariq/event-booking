import { Link } from "react-router-dom";
import { FiCalendar } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">

          {/* Brand */}
          <div>
            <Link
              to="/"
              className="flex items-center gap-2 text-xl font-bold text-primary"
            >
              <FiCalendar />
              EventBooking
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-text-muted">
              Discover upcoming events, book your seats, and manage your
              bookings with ease.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-text">
              Navigation
            </h3>

            <div className="mt-4 flex flex-col gap-3">
              <Link
                to="/"
                className="w-fit text-sm text-text-muted transition hover:text-primary"
              >
                Home
              </Link>

              <Link
                to="/"
                className="w-fit text-sm text-text-muted transition hover:text-primary"
              >
                Upcoming Events
              </Link>
            </div>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-text">
              Account
            </h3>

            <div className="mt-4 flex flex-col gap-3">
              <Link
                to="/login"
                className="w-fit text-sm text-text-muted transition hover:text-primary"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="w-fit text-sm text-text-muted transition hover:text-primary"
              >
                Register
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-border pt-6 text-center">
          <p className="text-sm text-text-muted">
            © {new Date().getFullYear()} EventBooking. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
