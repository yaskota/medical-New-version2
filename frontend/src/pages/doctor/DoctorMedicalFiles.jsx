import { useState } from "react";
import { createMedicalFile } from "../../services/api";

const DoctorMedicalFiles = () => {
  const [form, setForm] = useState({ patient_id: "", hospital_id: "", file_url: "", file_type: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      await createMedicalFile(form);
      setMsg("Medical file uploaded successfully!");
      setForm({ patient_id: "", hospital_id: "", file_url: "", file_type: "" });
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to upload file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fadeInUp">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Medical Files</h2>
        <p className="text-sm text-gray-500 mt-1">Upload medical reports for patients</p>
      </div>

      <div className="max-w-lg">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          {msg && (
            <div className={`mb-4 p-3 rounded-xl text-sm ${msg.includes("success") ? "bg-emerald-50 border border-emerald-200 text-emerald-600" : "bg-red-50 border border-red-200 text-red-600"}`}>
              {msg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID</label>
              <input type="text" value={form.patient_id} onChange={(e) => setForm({ ...form, patient_id: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-emerald-400 outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hospital ID</label>
              <input type="text" value={form.hospital_id} onChange={(e) => setForm({ ...form, hospital_id: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-emerald-400 outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">File URL</label>
              <input type="text" value={form.file_url} onChange={(e) => setForm({ ...form, file_url: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-emerald-400 outline-none"
                placeholder="https://..." required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">File Type</label>
              <select value={form.file_type} onChange={(e) => setForm({ ...form, file_type: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white focus:border-emerald-400 outline-none" required>
                <option value="">Select type</option>
                <option value="report">Report</option>
                <option value="prescription">Prescription</option>
                <option value="scan">Scan/X-Ray</option>
                <option value="lab">Lab Result</option>
                <option value="other">Other</option>
              </select>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white cursor-pointer bg-gradient-to-r from-emerald-500 to-green-600 
                         shadow-lg transition-all disabled:opacity-50">
              {loading ? "Uploading..." : "Upload File"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorMedicalFiles;
