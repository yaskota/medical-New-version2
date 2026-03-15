import { useState, useEffect } from "react";
import { getAdminPendingDoctors, adminApproveDoctor, adminRejectDoctor } from "../../services/api";

const AdminPendingDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPendingDoctors();
  }, []);

  const fetchPendingDoctors = async () => {
    try {
      setLoading(true);
      const resp = await getAdminPendingDoctors();
      if (resp.success) {
        setDoctors(resp.data);
      } else {
        setDoctors([]);
      }
    } catch (err) {
      console.error("Error fetching pending doctors:", err);
      setError("Failed to fetch pending doctors.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm("Are you sure you want to approve this doctor?")) return;
    try {
      await adminApproveDoctor(id);
      fetchPendingDoctors();
    } catch (err) {
      console.error(err);
      alert("Failed to approve doctor.");
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject and remove this doctor?")) return;
    try {
      await adminRejectDoctor(id);
      fetchPendingDoctors();
    } catch (err) {
      console.error(err);
      alert("Failed to reject doctor.");
    }
  };

  return (
  <div className="animate-fadeInUp">
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-800">Pending Doctor Approvals</h2>
      <p className="text-sm text-gray-500 mt-1">
        Review and approve or reject doctor registrations
      </p>
    </div>

    {error && (
      <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
        {error}
      </div>
    )}

    {loading ? (
      <div className="text-center py-20 text-gray-400">
        Loading pending doctors...
      </div>
    ) : doctors.length === 0 ? (
      <div className="text-center py-20">
        <span className="text-5xl block mb-4">⏳</span>
        <p className="text-gray-500">No pending doctors waiting for approval</p>
      </div>
    ) : (
      <div className="space-y-4">
        {doctors.map((doctor) => (
          <div
            key={doctor._id}
            className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-amber-100 flex items-center justify-center text-2xl">
                ⏳
              </div>

              <div>
                <div className="font-bold text-gray-800">
                  Dr. {doctor.user_id?.name || "N/A"}
                </div>

                <div className="text-sm text-gray-500">
                  ✉️ {doctor.user_id?.email || "N/A"}
                </div>

                <div className="text-sm text-gray-500">
                  📞 {doctor.user_id?.phone || "N/A"}
                </div>

                <div className="text-sm text-gray-500 mt-1">
                  🏥 Specialization: {doctor.specialization || "N/A"}
                </div>

                <div className="text-sm text-gray-500">
                  🎓 Education: {doctor.education || "N/A"}
                </div>

                <div className="text-sm text-gray-500">
                  ⏳ Experience: {doctor.experience || 0} years
                </div>

                <div className="text-xs text-gray-400 mt-1">
                  Doctor ID: {doctor.doctor_id}
                </div>

                <div className="text-xs text-amber-600 mt-1">
                  Status: Pending Approval
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleApprove(doctor._id)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-green-600 shadow-md cursor-pointer hover:-translate-y-0.5 transition-all"
              >
                ✓ Approve
              </button>

              <button
                onClick={() => handleReject(doctor._id)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-red-600 bg-red-50 border border-red-200 shadow-sm cursor-pointer hover:bg-red-100 transition-all"
              >
                ✕ Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
  )
};
export default AdminPendingDoctors;
