import { useState } from "react";
import { Link } from "react-router-dom";
import { DotLoader } from "react-spinners";
import { forgotPassword } from "../../services/authService";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      await forgotPassword(email);
      setSubmitted(true);
    } catch {
      setError("Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-[20px] font-semibold text-center text-gray-900 mb-2">
        Forgot Password
      </h2>
      <p className="text-sm text-center text-gray-500 mb-10">
        Enter your email and we will send you a password reset link.
      </p>

      {submitted ? (
        <div className="bg-white border border-gray-200 rounded-md p-6 mb-6">
          <p className="text-sm text-gray-700 text-center">
            If that email is registered, a reset link has been sent. Check your
            inbox.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B42318] focus:border-transparent transition-all text-sm"
            />
            {error && (
              <p className="mt-2 text-sm text-right text-red-700">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="relative w-full py-2.5 text-white font-semibold bg-black rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed text-sm"
          >
            <span className={loading ? "opacity-0" : "opacity-100"}>
              Send Reset Link
            </span>
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <DotLoader color="white" size={20} />
              </div>
            )}
          </button>
        </form>
      )}

      <div className="mt-4 text-center">
        <Link
          to="/login"
          className="text-sm text-gray-500 hover:text-[#B42318] transition-colors"
        >
          Back to Login
        </Link>
      </div>
    </>
  );
}
