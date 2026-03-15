import { useState, useEffect } from "react";
import { getMyPatientRecords } from "../../services/api";

const PatientRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedRecordId, setExpandedRecordId] = useState(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const resp = await getMyPatientRecords();
      if (resp.success) {
        setRecords(resp.data);
      } else {
        setRecords([]);
      }
    } catch (err) {
      console.error("Error fetching patient records:", err);
      setError("Failed to fetch medical records.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fadeInUp">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Medical Records</h2>
        <p className="text-sm text-gray-500 mt-1">View your diagnosis, prescriptions, and medical history</p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading your medical records...</div>
      ) : records.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-5xl block mb-4">📋</span>
          <p className="text-gray-500">No medical records found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map((record) => {
            const isExpanded = expandedRecordId === record._id;
            return (
            <div key={record._id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all">
              <div 
                className={`px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer transition-colors ${isExpanded ? "bg-gradient-to-r from-emerald-500 to-green-600" : "hover:bg-gray-50 bg-white"}`}
                onClick={() => setExpandedRecordId(isExpanded ? null : record._id)}
              >
                <div>
                  <h3 className={`text-lg font-bold ${isExpanded ? "text-white" : "text-gray-800"}`}>
                    {record.disease || "Medical Record"}
                  </h3>
                  <p className={`text-sm mt-0.5 ${isExpanded ? "text-emerald-100" : "text-gray-500"}`}>
                    Dr. {record.doctor_id?.user_id?.name || "Unknown"} • {new Date(record.visit_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${isExpanded ? "bg-white/20 text-white" : "bg-emerald-50 text-emerald-700 border border-emerald-100"}`}>
                    {record.hospital_id?.hospital_name || "Clinic"}
                  </div>
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full transition-transform ${isExpanded ? "bg-emerald-600 text-white rotate-180" : "bg-gray-100 text-gray-500"}`}>
                    ▼
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="p-6 grid sm:grid-cols-2 gap-6 bg-white border-t border-gray-100 animate-fadeInUp">
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Symptoms</div>
                      <div className="text-sm text-gray-800 bg-gray-50 p-3 rounded-xl border border-gray-100 min-h-[60px]">
                        {record.symptoms && record.symptoms.length > 0 ? record.symptoms.join(", ") : "No symptoms recorded."}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Diagnosis</div>
                      <div className="text-sm text-gray-800 bg-gray-50 p-3 rounded-xl border border-gray-100 min-h-[60px]">
                        {record.diagnosis || "No diagnosis provided."}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Prescription Notes</div>
                      <div className="text-sm text-gray-800 bg-gray-50 p-3 rounded-xl border border-gray-100 min-h-[60px]">
                        {record.prescription || "No prescription notes provided."}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Medicines</div>
                    {record.medicines && record.medicines.length > 0 ? (
                      <div className="space-y-2">
                        {record.medicines.map((med, idx) => (
                          <div key={idx} className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/50 flex items-start gap-3">
                            <span className="text-emerald-600 mt-0.5">💊</span>
                            <div>
                              <div className="text-sm font-semibold text-gray-800">{med.name}</div>
                              <div className="text-xs text-gray-500 mt-0.5">{med.dosage} • {med.duration}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
                        No medicines prescribed.
                      </div>
                    )}
                    {record.next_visit && (
                      <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-blue-50 border border-blue-100 text-sm font-medium text-blue-800">
                        <span>📅</span> Next Follow-up: {new Date(record.next_visit).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PatientRecords;
