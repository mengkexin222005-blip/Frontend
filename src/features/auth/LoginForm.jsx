import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { DotLoader } from "react-spinners";
import { login } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { getDashboardByRole } from "../../utils/roleRedirect";

const EMPTY = { email: "", password: "" };

export default function LoginForm() {
  const [form, setForm] = useState(EMPTY);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(EMPTY);

  const navigate = useNavigate();
  const { saveAuth } = useAuth();

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setErrors((p) => ({ ...p, [e.target.name]: "" }));
  };

  const validate = () => {
    const next = { email: "", password: "" };
    if (!form.email) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Please enter a valid email address.";
    if (!form.password) next.password = "Password is required.";
    else if (form.password.length < 8)
      next.password = "Password must be at least 8 characters.";
    setErrors(next);
    return !next.email && !next.password;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || !validate()) return;
    setLoading(true);
    try {
      const data = await login(form);
      saveAuth(data.accessToken, data.user);
      navigate(getDashboardByRole(data.user.role));
    } catch (err) {
      const status = err?.response?.status;
      if (status === 404)
        setErrors({ email: "No account found with this email.", password: "" });
      else if (status === 400)
        setErrors({
          email: "",
          password: "Incorrect password. Please try again.",
        });
      else
        setErrors({
          email: "An error occurred. Please try again.",
          password: "",
        });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-semibold text-center text-gray-900 mb-6">
        Login
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            name="email"
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            className={`w-full px-3 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B42318] focus:border-transparent transition-all text-sm ${
              errors.email ? "border-[#B42318]" : "border-gray-300"
            }`}
          />
          {errors.email && (
            <p className="text-sm text-[#B42318] mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              className={`w-full px-3 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B42318] focus:border-transparent transition-all pr-10 text-sm ${
                errors.password ? "border-[#B42318]" : "border-gray-300"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPassword ? (
                <BsFillEyeFill color="#640b04" size={18} />
              ) : (
                <BsFillEyeSlashFill color="rgba(0,0,0,0.4)" size={18} />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-[#B42318] mt-1">{errors.password}</p>
          )}
        </div>

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember-checkbox"
              className="w-4 h-4 rounded text-[#B42318] focus:outline-none focus:ring-0 border-gray-300"
            />
            <label
              htmlFor="remember-checkbox"
              className="text-sm text-gray-600 cursor-pointer select-none hover:text-[#B42318] transition-colors"
            >
              Remember me
            </label>
          </div>
          <Link
            to="/forgot-password"
            className="text-sm text-gray-500 hover:text-[#B42318] transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="relative w-full py-2.5 mt-2 text-white font-semibold bg-black rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed text-sm"
        >
          <span className={loading ? "opacity-0" : "opacity-100"}>Login</span>
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <DotLoader color="white" size={20} />
            </div>
          )}
        </button>
      </form>
    </>
  );
}
