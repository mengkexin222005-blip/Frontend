import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { DotLoader } from "react-spinners";
import { resetPassword } from "../../services/authService";

export default function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Bad/missing token — show a clear message immediately
  if (!token) {
    return (
      <>
        <h2 className="text-[20px] font-semibold text-center text-gray-900 mb-2">
          Invalid Link
        </h2>
        <p className="text-sm text-center text-gray-500 mb-6">
          This password reset link is missing or malformed.
        </p>
        <div className="text-center">
          <Link
            to="/forgot-password"
            className="text-sm text-[#B42318] hover:underline"
          >
            Request a new link
          </Link>
        </div>
      </>
    );
  }

  const validate = () => {
    if (newPassword.length < 8)
      return "Password must be at least 8 characters.";
    if (newPassword !== confirmPassword) return "Passwords do not match.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");
    try {
      await resetPassword(token, newPassword);
      setSuccess(true);
      setTimeout(() => navigate("/login", { replace: true }), 3000);
    } catch (err) {
      setError(
        err?.response?.data?.error || "Reset link is invalid or has expired.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <>
        <h2 className="text-[20px] font-semibold text-center text-gray-900 mb-2">
          Password Reset
        </h2>
        <div className="bg-white border border-gray-200 rounded-md p-6">
          <p className="text-sm text-gray-700 text-center">
            Your password has been reset successfully. Redirecting you to
            login...
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <h2 className="text-[20px] font-semibold text-center text-gray-900 mb-2">
        Reset Password
      </h2>
      <p className="text-sm text-center text-gray-500 mb-8">
        Enter your new password below.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setError("");
              }}
              required
              placeholder="At least 8 characters"
              className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B42318] focus:border-transparent transition-all pr-10 text-sm"
            />
            <button
              type="button"
              onClick={() => setShowNew((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showNew ? (
                <BsFillEyeFill color="#640b04" size={18} />
              ) : (
                <BsFillEyeSlashFill color="rgba(0,0,0,0.4)" size={18} />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError("");
              }}
              required
              placeholder="Re-enter new password"
              className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B42318] focus:border-transparent transition-all pr-10 text-sm"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showConfirm ? (
                <BsFillEyeFill color="#640b04" size={18} />
              ) : (
                <BsFillEyeSlashFill color="rgba(0,0,0,0.4)" size={18} />
              )}
            </button>
          </div>
        </div>

        {error && <p className="text-sm text-right text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="relative w-full py-2.5 text-white font-semibold bg-black rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed text-sm"
        >
          <span className={loading ? "opacity-0" : "opacity-100"}>
            Reset Password
          </span>
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <DotLoader color="white" size={20} />
            </div>
          )}
        </button>

        <div className="text-center pt-1">
          <Link
            to="/login"
            className="text-sm text-gray-500 hover:text-[#B42318] transition-colors"
          >
            Back to Login
          </Link>
        </div>
      </form>
    </>
  );
}
