import { useState, useEffect } from "react";
import { getAdminDoctors } from "../../services/api";

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const resp = await getAdminDoctors();
      if (resp.success) {
        setDoctors(resp.data);
        console.log(resp.data);
      } else {
        setDoctors([]);
      }
    } catch (err) {
      console.error("Error fetching doctors:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fadeInUp">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          All Doctor Accounts
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          View all registered doctor accounts
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">
          Loading doctors...
        </div>
      ) : doctors.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-5xl block mb-4">👨‍⚕️</span>
          <p className="text-gray-500">No doctors found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {doctors.map((doctor) => (
            <div
              key={doctor._id}
              className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-start gap-4"
            >
              <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center text-2xl">
                👨‍⚕️
              </div>

              <div className="flex-1">
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

                <div className="text-xs text-emerald-600 mt-2">
                  Approved: {doctor.approved_by_admin ? "Yes" : "No"}
                </div>

                <div className="text-xs text-gray-400 mt-1">
                  Doctor ID: {doctor.doctor_id}
                </div>

                <div className="text-xs text-gray-400">
                  Mongo ID: {doctor._id}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default AdminDoctors;
