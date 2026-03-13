import { useState } from "react";
import { createHospital } from "../../services/api";

const HospitalRegistration = ({ onRegistered }) => {
  const [form, setForm] = useState({
    hospital_name: "", government_hospital_id: "", location: "", address: "",
    email: "", phone_numbers: "", documents: "", description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await createHospital({
        ...form,
        phone_numbers: form.phone_numbers.split(",").map((p) => p.trim()).filter(Boolean),
        documents: form.documents.split(",").map((d) => d.trim()).filter(Boolean),
      });
      setSuccess("Hospital profile submitted for admin approval!");
      if (onRegistered) onRegistered();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create hospital");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center animate-fadeInUp">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-emerald-100 flex items-center justify-center text-4xl mx-auto mb-4">🏥</div>
          <h2 className="text-2xl font-bold text-gray-800">Hospital Registration</h2>
          <p className="text-sm text-gray-500 mt-1">Register your hospital to get started</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          {error && <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">{error}</div>}
          {success && <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-600">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: "hospital_name", label: "Hospital Name", placeholder: "City General Hospital", required: true },
              { key: "government_hospital_id", label: "Government Hospital ID", placeholder: "HOSP-12345" },
              { key: "location", label: "Location", placeholder: "City, State" },
              { key: "address", label: "Full Address", placeholder: "123 Medical Street" },
              { key: "email", label: "Email", placeholder: "hospital@example.com", type: "email" },
              { key: "phone_numbers", label: "Phone Numbers (comma separated)", placeholder: "+1234567890, +0987654321" },
              { key: "documents", label: "Document URLs (comma separated)", placeholder: "https://..." },
            ].map(({ key, label, placeholder, type, required: req }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input type={type || "text"} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none"
                  placeholder={placeholder} required={req} />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-emerald-400 outline-none resize-none" rows={3}
                placeholder="Brief description of your hospital" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-semibold text-white cursor-pointer bg-gradient-to-r from-emerald-500 to-green-600 
                         shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-50">
              {loading ? "Submitting..." : "Submit for Approval"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HospitalRegistration;
