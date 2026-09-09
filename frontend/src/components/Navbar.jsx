import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const { user, loading, logout } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    closeMenu();
    await logout();
  };

  return (
    <nav className="border-b border-border bg-surface">
      {/* Navbar Header */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="text-xl font-bold text-primary sm:text-2xl"
        >
          EventBooking
        </Link>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="text-3xl text-text md:hidden"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          {/* Home */}
          <Link
            to="/"
            className="text-text-muted transition hover:text-primary"
          >
            Home
          </Link>

          {/* Authentication-based navigation */}
          {loading ? (
            <LoadingSpinner />
          ) : user ? (
            <>
              {/* Admin Dashboard / My Bookings */}
              {user.role === "admin" ? (
                <Link
                  to="/admin"
                  className="text-text-muted transition hover:text-primary"
                >
                  Admin Dashboard
                </Link>
              ) : (
                <Link
                  to="/my-bookings"
                  className="text-text-muted transition hover:text-primary"
                >
                  My Bookings
                </Link>
              )}

              {/* User Name */}
              <span className="font-medium text-text">
                Hi, {user.name}
              </span>

              {/* Logout */}
              <button
                onClick={logout}
                className="rounded-lg bg-primary px-4 py-2 font-medium text-white transition hover:bg-primary-hover"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Login */}
              <Link
                to="/login"
                className="text-text-muted transition hover:text-primary"
              >
                Login
              </Link>

              {/* Register */}
              <Link
                to="/register"
                className="rounded-lg bg-primary px-4 py-2 font-medium text-white transition hover:bg-primary-hover"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="border-t border-border md:hidden">
          <div className="mx-auto max-w-7xl px-6 py-5">
            <div className="flex flex-col gap-4">
              {/* Home */}
              <Link
                to="/"
                onClick={closeMenu}
                className="text-text-muted transition hover:text-primary"
              >
                Home
              </Link>

              {loading ? (
                <LoadingSpinner />
              ) : user ? (
                <>
                  {/* Admin Dashboard / My Bookings */}
                  {user.role === "admin" ? (
                    <Link
                      to="/admin"
                      onClick={closeMenu}
                      className="text-text-muted transition hover:text-primary"
                    >
                      Admin Dashboard
                    </Link>
                  ) : (
                    <Link
                      to="/my-bookings"
                      onClick={closeMenu}
                      className="text-text-muted transition hover:text-primary"
                    >
                      My Bookings
                    </Link>
                  )}

                  {/* User Name */}
                  <span className="font-medium text-text">
                    Hi, {user.name}
                  </span>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="self-start rounded-lg bg-primary px-4 py-2 text-left font-medium text-white transition hover:bg-primary-hover"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  {/* Login */}
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="text-text-muted transition hover:text-primary"
                  >
                    Login
                  </Link>

                  {/* Register */}
                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="rounded-lg bg-primary px-4 py-2 font-medium text-white transition hover:bg-primary-hover"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

