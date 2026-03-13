import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const VerifyOTP = () => {
  const { verify } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await verify({ email, otp });
      setSuccess(res.message || "Email verified successfully!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4 py-12">
      <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-green-200/20 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10 animate-fadeInUp">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 
                          flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-emerald-200/50">H</div>
            <span className="text-2xl font-bold text-gray-800">Health<span className="text-emerald-600">care</span></span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-green-100/50 border border-green-100 p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-3xl mx-auto mb-4">
              ✉️
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Verify Your Email</h2>
            <p className="text-sm text-gray-500">
              We've sent a 6-digit OTP to<br />
              <span className="font-semibold text-emerald-600">{email}</span>
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">{error}</div>
          )}
          {success && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-600">{success}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
              <input type="text" value={otp} maxLength={6}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="w-full px-4 py-4 rounded-xl border border-gray-200 text-center text-2xl font-bold tracking-[0.5em] text-gray-800
                           focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                placeholder="000000" required />
            </div>

            <button type="submit" disabled={loading || otp.length !== 6}
              className="w-full py-3.5 rounded-xl text-sm font-semibold text-white cursor-pointer
                         bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700
                         shadow-lg shadow-emerald-200/50 transition-all hover:-translate-y-0.5
                         disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? "Verifying..." : "Verify Email"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <Link to="/login" className="text-emerald-600 font-semibold hover:text-emerald-700">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
