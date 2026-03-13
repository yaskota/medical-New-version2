import { useState, useEffect } from "react";
import { getAllHospitals, approveHospital } from "../../services/api";

const AdminHospitals = ({ approved = false }) => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchHospitals(); }, []);

  const fetchHospitals = async () => {
    try {
      const data = await getAllHospitals();
      const all = data.hospitals || [];
      setHospitals(all.filter((h) => approved ? h.approved_by_admin : !h.approved_by_admin));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveHospital(id);
      fetchHospitals();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-fadeInUp">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{approved ? "Approved" : "Unapproved"} Hospitals</h2>
        <p className="text-sm text-gray-500 mt-1">{approved ? "Verified hospitals" : "Hospitals waiting for verification"}</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading...</div>
      ) : hospitals.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-5xl block mb-4">🏥</span>
          <p className="text-gray-500">No {approved ? "approved" : "pending"} hospitals</p>
        </div>
      ) : (
        <div className="space-y-4">
          {hospitals.map((h, i) => (
            <div key={i} className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center text-2xl">🏥</div>
                  <div>
                    <div className="font-bold text-gray-800">{h.hospital_name}</div>
                    <div className="text-sm text-gray-500">📍 {h.location || "N/A"}</div>
                    <div className="text-sm text-gray-500">✉️ {h.email || "N/A"}</div>
                    <div className="text-sm text-gray-500">📞 {h.phone_numbers?.join(", ") || "N/A"}</div>
                    <div className="text-xs text-gray-400 mt-1">Gov. ID: {h.government_hospital_id || "N/A"}</div>
                    {h.documents?.length > 0 && (
                      <div className="text-xs text-blue-600 mt-1">{h.documents.length} document(s) attached</div>
                    )}
                  </div>
                </div>
                {!approved && (
                  <button onClick={() => handleApprove(h._id)}
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-green-600 
                               shadow-md cursor-pointer hover:-translate-y-0.5 transition-all">
                    ✓ Approve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminHospitals;
