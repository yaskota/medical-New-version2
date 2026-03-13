import { useState, useEffect } from "react";
import { getMyHospital, getHospitalDoctors, addDoctorToHospital } from "../../services/api";

const HospitalDoctors = () => {
  const [hospital, setHospital] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [doctorId, setDoctorId] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const h = await getMyHospital();
      setHospital(h);
      const d = await getHospitalDoctors(h._id);
      setDoctors(Array.isArray(d) ? d : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    setMsg("");
    try {
      await addDoctorToHospital({ hospital_id: hospital._id, doctor_id: doctorId });
      setMsg("Doctor added to hospital!");
      setDoctorId("");
      setShowAdd(false);
      fetchData();
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to add doctor");
    } finally {
      setAddLoading(false);
    }
  };

  return (
    <div className="animate-fadeInUp">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Hospital Doctors</h2>
          <p className="text-sm text-gray-500 mt-1">Manage doctors in your hospital</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)}
          className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-green-600 shadow-md cursor-pointer transition-all">
          + Add Doctor
        </button>
      </div>

      {msg && <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-600">{msg}</div>}

      {showAdd && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6 animate-slideDown">
          <form onSubmit={handleAdd} className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Doctor ID</label>
              <input type="text" value={doctorId} onChange={(e) => setDoctorId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-emerald-400 outline-none"
                placeholder="Enter Doctor MongoDB ID" required />
            </div>
            <button type="submit" disabled={addLoading}
              className="px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-green-600 shadow-md cursor-pointer disabled:opacity-50">
              {addLoading ? "Adding..." : "Add"}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading...</div>
      ) : doctors.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-5xl block mb-4">👨‍⚕️</span>
          <p className="text-gray-500">No doctors in your hospital yet</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.map((doc, i) => (
            <div key={i} className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center text-2xl">👨‍⚕️</div>
                <div>
                  <h3 className="font-bold text-gray-800">Dr. {doc.user_id?.name || "N/A"}</h3>
                  <p className="text-sm text-emerald-600">{doc.specialization || "General"}</p>
                </div>
              </div>
              <div className="text-sm text-gray-500 space-y-1">
                <div>📧 {doc.user_id?.email || "N/A"}</div>
                <div>🎓 {doc.education || "N/A"}</div>
                <div>📅 {doc.experience || 0} years experience</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HospitalDoctors;
