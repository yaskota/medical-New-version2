import { useState } from "react";
import { createDoctorProfile } from "../../services/api";

const DoctorRegistration = ({ onRegistered }) => {
  const [form, setForm] = useState({ doctor_id: "", specialization: "", experience: "", education: "", photo: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await createDoctorProfile({ ...form, experience: Number(form.experience) });
      setSuccess("Doctor profile submitted for admin approval!");
      if (onRegistered) onRegistered();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create doctor profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center animate-fadeInUp">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-emerald-100 flex items-center justify-center text-4xl mx-auto mb-4">👨‍⚕️</div>
          <h2 className="text-2xl font-bold text-gray-800">Doctor Registration</h2>
          <p className="text-sm text-gray-500 mt-1">Complete your profile to get started</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          {error && <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">{error}</div>}
          {success && <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-600">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Doctor ID / License Number</label>
              <input type="text" value={form.doctor_id} onChange={(e) => setForm({ ...form, doctor_id: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none"
                placeholder="e.g., DOC-12345" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
              <input type="text" value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none"
                placeholder="e.g., Cardiology, Dermatology" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
              <input type="number" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none"
                placeholder="e.g., 5" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
              <input type="text" value={form.education} onChange={(e) => setForm({ ...form, education: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none"
                placeholder="e.g., MBBS, MD" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Photo URL (Optional)</label>
              <input type="text" value={form.photo} onChange={(e) => setForm({ ...form, photo: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none"
                placeholder="https://..." />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-semibold text-white cursor-pointer
                         bg-gradient-to-r from-emerald-500 to-green-600 shadow-lg transition-all hover:-translate-y-0.5
                         disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? "Submitting..." : "Submit for Approval"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorRegistration;
