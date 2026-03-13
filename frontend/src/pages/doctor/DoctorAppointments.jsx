import { useState, useEffect } from "react";
import { getDoctorProfile, getDoctorAppointments, updateAppointmentStatus, createPatientRecord, createMedicalFile } from "../../services/api";

const DoctorAppointments = () => {
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [diagnosisModal, setDiagnosisModal] = useState(null);
  const [diagForm, setDiagForm] = useState({ disease: "", diagnosis: "", prescription: "", medicines: [{ name: "", dosage: "", duration: "" }] });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const doc = await getDoctorProfile();
      setDoctor(doc);
      const appts = await getDoctorAppointments(doc._id);
      setAppointments(Array.isArray(appts) ? appts : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateAppointmentStatus(id, { status });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddDiagnosis = async (e) => {
    e.preventDefault();
    try {
      await createPatientRecord({
        patient_id: diagnosisModal.patient_id?._id || diagnosisModal.patient_id,
        doctor_id: doctor._id,
        hospital_id: diagnosisModal.hospital_id?._id || diagnosisModal.hospital_id,
        disease: diagForm.disease,
        diagnosis: diagForm.diagnosis,
        prescription: diagForm.prescription,
        medicines: diagForm.medicines.filter((m) => m.name),
        visit_date: new Date(),
      });
      alert("Diagnosis added successfully!");
      setDiagnosisModal(null);
      setDiagForm({ disease: "", diagnosis: "", prescription: "", medicines: [{ name: "", dosage: "", duration: "" }] });
    } catch (err) {
      alert("Failed to add diagnosis");
    }
  };

  const filtered = appointments.filter((a) => {
    if (activeTab === "pending") return a.status === "pending";
    if (activeTab === "confirmed") return a.status === "confirmed";
    if (activeTab === "completed") return a.status === "completed";
    return true;
  });

  return (
    <div className="animate-fadeInUp">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Appointments</h2>
        <p className="text-sm text-gray-500 mt-1">Manage your patient appointments</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {["pending", "confirmed", "completed", "all"].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all cursor-pointer
              ${activeTab === tab ? "bg-emerald-100 text-emerald-700 border border-emerald-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Diagnosis Modal */}
      {diagnosisModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setDiagnosisModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto animate-scaleIn" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Add Diagnosis</h3>
            <form onSubmit={handleAddDiagnosis} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Disease</label>
                <input type="text" value={diagForm.disease} onChange={(e) => setDiagForm({ ...diagForm, disease: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-emerald-400 outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
                <textarea value={diagForm.diagnosis} onChange={(e) => setDiagForm({ ...diagForm, diagnosis: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-emerald-400 outline-none resize-none" rows={3} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prescription</label>
                <textarea value={diagForm.prescription} onChange={(e) => setDiagForm({ ...diagForm, prescription: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-emerald-400 outline-none resize-none" rows={2} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Medicines</label>
                {diagForm.medicines.map((med, i) => (
                  <div key={i} className="grid grid-cols-3 gap-2 mb-2">
                    <input type="text" placeholder="Name" value={med.name}
                      onChange={(e) => { const m = [...diagForm.medicines]; m[i].name = e.target.value; setDiagForm({ ...diagForm, medicines: m }); }}
                      className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-emerald-400 outline-none" />
                    <input type="text" placeholder="Dosage" value={med.dosage}
                      onChange={(e) => { const m = [...diagForm.medicines]; m[i].dosage = e.target.value; setDiagForm({ ...diagForm, medicines: m }); }}
                      className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-emerald-400 outline-none" />
                    <input type="text" placeholder="Duration" value={med.duration}
                      onChange={(e) => { const m = [...diagForm.medicines]; m[i].duration = e.target.value; setDiagForm({ ...diagForm, medicines: m }); }}
                      className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-emerald-400 outline-none" />
                  </div>
                ))}
                <button type="button" onClick={() => setDiagForm({ ...diagForm, medicines: [...diagForm.medicines, { name: "", dosage: "", duration: "" }] })}
                  className="text-sm text-emerald-600 font-medium cursor-pointer hover:text-emerald-700">+ Add Medicine</button>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setDiagnosisModal(null)}
                  className="flex-1 py-3 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 cursor-pointer">Cancel</button>
                <button type="submit"
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-green-600 shadow-lg cursor-pointer">
                  Save Diagnosis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-5xl block mb-4">📅</span>
          <p className="text-gray-500">No {activeTab} appointments</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((apt, i) => (
            <div key={i} className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-xl">👤</div>
                  <div>
                    <div className="font-semibold text-gray-800">{apt.patient_id?.name || "Patient"}</div>
                    <div className="text-sm text-gray-500">{apt.patient_id?.email} • {apt.patient_id?.phone}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      📅 {apt.appointment_date ? new Date(apt.appointment_date).toLocaleDateString() : "N/A"} • 🕐 {apt.appointment_time || "N/A"}
                    </div>
                    {apt.reason && <div className="text-sm text-gray-600 mt-2 italic">"{apt.reason}"</div>}
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {apt.status === "pending" && (
                    <>
                      <button onClick={() => handleStatusUpdate(apt._id, "confirmed")}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-200 cursor-pointer transition-all">
                        ✓ Approve
                      </button>
                      <button onClick={() => handleStatusUpdate(apt._id, "cancelled")}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-100 text-red-700 border border-red-200 hover:bg-red-200 cursor-pointer transition-all">
                        ✕ Reject
                      </button>
                    </>
                  )}
                  {apt.status === "confirmed" && (
                    <>
                      <button onClick={() => handleStatusUpdate(apt._id, "completed")}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200 cursor-pointer transition-all">
                        ✓ Complete
                      </button>
                      <button onClick={() => setDiagnosisModal(apt)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200 hover:bg-purple-200 cursor-pointer transition-all">
                        📋 Add Diagnosis
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;
