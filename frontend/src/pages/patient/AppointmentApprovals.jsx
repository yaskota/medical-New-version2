import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getPatientAppointments } from "../../services/api";

const AppointmentApprovals = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAppointments(); }, []);

  const fetchAppointments = async () => {
    try {
      const data = await getPatientAppointments(user._id);
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "completed": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "confirmed": return "bg-blue-100 text-blue-700 border-blue-200";
      case "cancelled": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-amber-100 text-amber-700 border-amber-200";
    }
  };

  const statusIcon = (status) => {
    switch (status) {
      case "completed": return "✅";
      case "confirmed": return "🔵";
      case "cancelled": return "❌";
      default: return "⏳";
    }
  };

  return (
    <div className="animate-fadeInUp">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Appointment Approvals</h2>
        <p className="text-sm text-gray-500 mt-1">Track your appointment requests and status</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading appointments...</div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-5xl block mb-4">📋</span>
          <p className="text-gray-500">No appointments yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((apt, i) => (
            <div key={i} className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-xl">
                    {statusIcon(apt.status)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Dr. {apt.doctor_id?.user_id?.name || "N/A"}</div>
                    <div className="text-sm text-gray-500 mt-0.5">🏥 {apt.hospital_id?.hospital_name || "N/A"}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      📅 {apt.appointment_date ? new Date(apt.appointment_date).toLocaleDateString() : "Date TBD"} • 🕐 {apt.appointment_time || "To be assigned"}
                    </div>
                    {apt.reason && <div className="text-sm text-gray-600 mt-2 italic">"{apt.reason}"</div>}
                  </div>
                </div>
                <span className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize border ${statusColor(apt.status)}`}>
                  {apt.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentApprovals;
