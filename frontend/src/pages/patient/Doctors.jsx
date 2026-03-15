import { useState, useEffect } from "react";
import { getAllHospitals, getHospitalDoctors, bookAppointment } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const Doctors = () => {
  const { user } = useAuth();
  const [hospitals, setHospitals] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [bookingDoctor, setBookingDoctor] = useState(null);
  const [bookingForm, setBookingForm] = useState({ hospital_id: "", appointment_date: "", reason: "" });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingMsg, setBookingMsg] = useState("");

  useEffect(() => { fetchDoctors(); }, []);

  const fetchDoctors = async () => {
    try {
      const data = await getAllHospitals();
      const hosp = data.hospitals || [];
      setHospitals(hosp);
      let docs = [];
      for (const h of hosp) {
        try {
          const d = await getHospitalDoctors(h._id);
          const arr = Array.isArray(d) ? d : [];
          arr.forEach((doc) => {
            if (!docs.find((dd) => dd._id === doc._id)) {
              docs.push({ ...doc, hospitalName: h.hospital_name, hospitalId: h._id });
            }
          });
        } catch (e) { /* skip */ }
      }
      setAllDoctors(docs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = allDoctors.filter((d) =>
    d.user_id?.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization?.toLowerCase().includes(search.toLowerCase())
  );

  const handleBook = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    setBookingMsg("");
    try {
      await bookAppointment({
        doctor_id: bookingDoctor._id,
        hospital_id: bookingForm.hospital_id || bookingDoctor.hospitalId,
        appointment_date: bookingForm.appointment_date,
        reason: bookingForm.reason,
      });
      setBookingMsg("Appointment booked successfully!");
      setTimeout(() => { setBookingDoctor(null); setBookingMsg(""); }, 2000);
    } catch (err) {
      setBookingMsg(err.response?.data?.message || "Failed to book appointment");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="animate-fadeInUp">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Doctors</h2>
          <p className="text-sm text-gray-500 mt-1">Find and book appointments with doctors</p>
        </div>
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search doctors..."
          className="px-4 py-2 rounded-xl border border-gray-200 text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none" />
      </div>

      {/* Booking Modal */}
      {bookingDoctor && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setBookingDoctor(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-scaleIn" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-800 mb-1">Book Appointment</h3>
            <p className="text-sm text-gray-500 mb-4">with Dr. {bookingDoctor.user_id?.name}</p>

            {bookingMsg && (
              <div className={`p-3 rounded-xl text-sm mb-4 ${bookingMsg.includes("success") ? "bg-emerald-50 border border-emerald-200 text-emerald-600" : "bg-red-50 border border-red-200 text-red-600"}`}>
                {bookingMsg}
              </div>
            )}

            <form onSubmit={handleBook} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date (Optional)</label>
                <input type="date" value={bookingForm.appointment_date}
                  onChange={(e) => setBookingForm({ ...bookingForm, appointment_date: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-emerald-400 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <textarea value={bookingForm.reason}
                  onChange={(e) => setBookingForm({ ...bookingForm, reason: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-emerald-400 outline-none resize-none" rows={3}
                  placeholder="Briefly describe your concern" />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setBookingDoctor(null)}
                  className="flex-1 py-3 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 cursor-pointer transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={bookingLoading}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-green-600 
                             shadow-lg cursor-pointer disabled:opacity-50 transition-all">
                  {bookingLoading ? "Booking..." : "Book Now"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading doctors...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-5xl block mb-4">👨‍⚕️</span>
          <p className="text-gray-500">No doctors found</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((doc, i) => (
            <div key={i} className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center text-2xl">👨‍⚕️</div>
                <div>
                  <h3 className="font-bold text-gray-800">Dr. {doc.user_id?.name || "N/A"}</h3>
                  <p className="text-sm text-emerald-600">{doc.specialization || "General"}</p>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="text-sm text-gray-500">🏥 {doc.hospitalName || "N/A"}</div>
                <div className="text-sm text-gray-500">🎓 {doc.education || "N/A"}</div>
                <div className="text-sm text-gray-500">📅 {doc.experience || 0} years experience</div>
              </div>
              <button onClick={() => { setBookingDoctor(doc); setBookingForm({ hospital_id: doc.hospitalId, appointment_date: "", reason: "" }); }}
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-green-600 
                           shadow-md hover:shadow-lg cursor-pointer transition-all hover:-translate-y-0.5">
                📅 Book Appointment
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Doctors;
