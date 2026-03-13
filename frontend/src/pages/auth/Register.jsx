import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", role: "patient" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/verify-otp", { state: { email: form.email } });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
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
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Create Account</h2>
          <p className="text-sm text-gray-500 mb-6">Join Healthcare to get started</p>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800
                           focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                placeholder="John Doe" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800
                           focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                placeholder="name@example.com" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input type="tel" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800
                           focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                placeholder="+1 (555) 123-4567" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800
                           focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all bg-white">
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="hospital">Hospital</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800
                           focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                placeholder="Create a strong password" required />
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-semibold text-white cursor-pointer
                         bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700
                         shadow-lg shadow-emerald-200/50 transition-all hover:-translate-y-0.5
                         disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-emerald-600 font-semibold hover:text-emerald-700">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
