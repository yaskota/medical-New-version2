import { useState, useEffect } from "react";
import { getPendingDoctors, approveDoctor } from "../../services/api";

const AdminDoctors = ({ approved = false }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDoctors(); }, []);

  const fetchDoctors = async () => {
    try {
      const data = await getPendingDoctors();
      const allDocs = data.doctors || [];
      if (approved) {
        // Show approved doctors - the API only returns pending, so we show them with a note
        setDoctors(allDocs.filter((d) => d.approved_by_admin));
      } else {
        setDoctors(allDocs.filter((d) => !d.approved_by_admin));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveDoctor(id);
      fetchDoctors();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-fadeInUp">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{approved ? "Approved" : "Unapproved"} Doctors</h2>
        <p className="text-sm text-gray-500 mt-1">{approved ? "Verified doctors in the system" : "Doctors waiting for verification"}</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading...</div>
      ) : doctors.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-5xl block mb-4">👨‍⚕️</span>
          <p className="text-gray-500">No {approved ? "approved" : "pending"} doctors</p>
        </div>
      ) : (
        <div className="space-y-4">
          {doctors.map((doc, i) => (
            <div key={i} className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center text-2xl">👨‍⚕️</div>
                  <div>
                    <div className="font-bold text-gray-800">Dr. {doc.user_id?.name || "N/A"}</div>
                    <div className="text-sm text-gray-500">{doc.user_id?.email}</div>
                    <div className="text-sm text-gray-500">📞 {doc.user_id?.phone || "N/A"}</div>
                    <div className="text-sm text-emerald-600 mt-1">{doc.specialization || "General"} • {doc.experience || 0} yrs • {doc.education || "N/A"}</div>
                    <div className="text-xs text-gray-400 mt-1">ID: {doc.doctor_id}</div>
                  </div>
                </div>
                {!approved && (
                  <button onClick={() => handleApprove(doc._id)}
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

export default AdminDoctors;
