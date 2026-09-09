import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

const VerifyOTP = () => {
  const location = useLocation();
  const email = location.state?.email;

  const navigate = useNavigate();

  const { verifyAccount } = useAuth();

  const [otp, setOTP] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (otp.length != 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);

    try {
      const data = await verifyAccount({ email, otp });

      setSuccess(data.message);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "OTP verification failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4 py-8 sm:px-6 sm:py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-text sm:text-3xl">
            Verify Your Account
          </h1>

          <p className="mt-2 text-sm text-text-muted sm:text-base">
            Enter the 6-digit OTP sent to your email
          </p>

          <p className="mt-1 break-all text-sm font-medium text-text">
            {email}
          </p>
        </div>

        {/* error */}
        {error && (
          <div className="mb-6 rounded-lg border border-error/20 bg-error/10 px-4 py-3 text-sm text-error">
            {error}
          </div>
        )}

        {/* success */}
        {success && (
          <div className="mb-6 rounded-lg border border-success/20 bg-success/10 px-4 py-3 text-sm text-success">
            {success}
          </div>
        )}

        {/* OTP Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* OTP */}
          <div>
            <label
              htmlFor="otp"
              className="mb-2 block text-sm font-medium text-text"
            >
              Verification Code
            </label>

            <input
              id="otp"
              name="otp"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOTP(e.target.value)}
              placeholder="Enter 6-digit OTP"
              className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-center text-lg tracking-[0.5em] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Verify Button */}
          <button
            type="submit"
            disabled={loading}
            className="flex justify-center items-center gap-2 w-full rounded-lg bg-primary px-4 py-3 font-semibold text-white transition hover:bg-primary-hover"
          >
            {loading ? (
              <>
                <LoadingSpinner variant="light" /> Verifying...
              </>
            ) : (
              "Verify Account"
            )}
          </button>
        </form>

        {/* Back to Login */}
        <p className="mt-6 text-center text-sm text-text-muted">
          Already verified?
          <Link
            to="/login"
            className="font-semibold text-primary transition hover:text-primary-hover"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyOTP;
