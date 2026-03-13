import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getPatientAppointments } from "../../services/api";

const PatientHistory = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await getPatientAppointments(user._id);
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch patient history:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = appointments.filter((a) => {
    if (filterDate && a.appointment_date) {
      return new Date(a.appointment_date).toLocaleDateString().includes(filterDate);
    }
    return true;
  });

  const statusColor = (status) => {
    switch (status) {
      case "completed": return "bg-emerald-100 text-emerald-700";
      case "confirmed": return "bg-blue-100 text-blue-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-amber-100 text-amber-700";
    }
  };

  return (
    <div className="animate-fadeInUp">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Patient History</h2>
          <p className="text-sm text-gray-500 mt-1">Your appointment and medical history</p>
        </div>
        <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-200 text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none" />
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-5xl block mb-4">📋</span>
          <p className="text-gray-500">No history records found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((apt, i) => (
            <div key={i} className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-xl">📅</div>
                  <div>
                    <div className="font-semibold text-gray-800">
                      Dr. {apt.doctor_id?.user_id?.name || "N/A"}
                    </div>
                    <div className="text-sm text-gray-500 mt-0.5">
                      {apt.hospital_id?.hospital_name || "N/A"}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {apt.appointment_date ? new Date(apt.appointment_date).toLocaleDateString() : "N/A"} • {apt.appointment_time || "N/A"}
                    </div>
                    {apt.reason && <div className="text-sm text-gray-600 mt-2">Reason: {apt.reason}</div>}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${statusColor(apt.status)}`}>
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

export default PatientHistory;
