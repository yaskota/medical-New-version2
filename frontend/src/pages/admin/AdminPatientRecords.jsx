import { useState } from "react";
import { getPatientRecordById } from "../../services/api";

const AdminPatientRecords = () => {
  const [recordId, setRecordId] = useState("");
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!recordId.trim()) return;
    setLoading(true);
    setError("");
    setRecord(null);
    try {
      const data = await getPatientRecordById(recordId);
      setRecord(data);
    } catch (err) {
      setError(err.response?.data?.message || "Record not found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fadeInUp">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Patient Records</h2>
        <p className="text-sm text-gray-500 mt-1">Search and view patient records</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <input type="text" value={recordId} onChange={(e) => setRecordId(e.target.value)}
          placeholder="Enter Patient Record ID"
          className="flex-1 max-w-md px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none" />
        <button type="submit" disabled={loading}
          className="px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-green-600 shadow-md cursor-pointer disabled:opacity-50">
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 mb-4">{error}</div>}

      {record && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-4">
            <h3 className="text-lg font-bold text-white">Patient Record</h3>
          </div>
          <div className="p-6 grid sm:grid-cols-2 gap-4">
            {[
              { label: "Patient", value: record.patient_id?.name },
              { label: "Doctor", value: record.doctor_id?.user_id?.name },
              { label: "Hospital", value: record.hospital_id?.hospital_name },
              { label: "Disease", value: record.disease },
              { label: "Diagnosis", value: record.diagnosis },
              { label: "Prescription", value: record.prescription },
              { label: "Visit Date", value: record.visit_date ? new Date(record.visit_date).toLocaleDateString() : "N/A" },
              { label: "Next Visit", value: record.next_visit ? new Date(record.next_visit).toLocaleDateString() : "N/A" },
            ].map((item) => (
              <div key={item.label} className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="text-xs font-medium text-gray-500 uppercase">{item.label}</div>
                <div className="text-sm font-semibold text-gray-800 mt-0.5">{item.value || "N/A"}</div>
              </div>
            ))}
          </div>
          {record.medicines?.length > 0 && (
            <div className="px-6 pb-6">
              <h4 className="text-sm font-bold text-gray-700 mb-2">💊 Medicines</h4>
              <div className="space-y-2">
                {record.medicines.map((m, i) => (
                  <div key={i} className="p-3 rounded-lg bg-blue-50 border border-blue-100 text-sm">
                    <span className="font-semibold text-gray-800">{m.name}</span>
                    <span className="text-gray-500 ml-2">• {m.dosage} • {m.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPatientRecords;
