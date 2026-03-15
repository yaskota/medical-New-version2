import { useState, useEffect } from "react";
import { getAdminPatients } from "../../services/api";

const AdminPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const resp = await getAdminPatients();
      if (resp.success) {
        setPatients(resp.data);
      } else {
        setPatients([]);
      }
    } catch (err) {
      console.error("Error fetching patients:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fadeInUp">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">All Patients</h2>
        <p className="text-sm text-gray-500 mt-1">View all registered patients in the system</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading patients...</div>
      ) : patients.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-5xl block mb-4">👥</span>
          <p className="text-gray-500">No patients found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {patients.map((patient, i) => (
            <div key={i} className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center text-2xl">👤</div>
              <div>
                <div className="font-bold text-gray-800">{patient.name || "N/A"}</div>
                <div className="text-sm text-gray-500">✉️ {patient.email || "N/A"}</div>
                <div className="text-sm text-gray-500">📞 {patient.phone || "N/A"}</div>
                <div className="text-xs text-emerald-600 mt-1">Verified: {patient.isVerified ? "Yes" : "No"}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPatients;
