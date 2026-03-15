import { useState, useEffect } from "react";
import { 
  getAllHospitals, 
  getHospitalDoctors, 
  getReviewsByHospital, 
  getDepartmentsByHospital,
  bookAppointment,
  createReview
} from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const HospitalDetails = () => {
  const { user } = useAuth();
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [departments, setDepartments] = useState([]);

  // UI States
  const [expandedDept, setExpandedDept] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [activeForm, setActiveForm] = useState(null); // 'appointment' or 'review'

  // Form States
  const [aptForm, setAptForm] = useState({ appointment_date: "", reason: "" });
  const [revForm, setRevForm] = useState({ rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => { fetchHospitals(); }, []);

  const fetchHospitals = async () => {
    try {
      const data = await getAllHospitals();
      setHospitals(data.hospitals || []);
    } catch (err) {
      console.error("Failed to fetch hospitals:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHospital = async (hospital) => {
    setSelectedHospital(hospital);
    setSelectedDoctor(null);
    setExpandedDept(null);
    setActiveForm(null);
    setMsg("");
    try {
      const [docsData, revData, deptData] = await Promise.all([
        getHospitalDoctors(hospital._id),
        getReviewsByHospital(hospital._id),
        getDepartmentsByHospital(hospital._id),
      ]);
      setDoctors(Array.isArray(docsData) ? docsData : []);
      setReviews(revData?.reviews || []);
      setDepartments(deptData?.departments || Array.isArray(deptData) ? deptData : []);
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = hospitals.filter((h) =>
    h.hospital_name?.toLowerCase().includes(search.toLowerCase()) ||
    h.location?.toLowerCase().includes(search.toLowerCase())
  );

  const getDoctorsByDept = (deptId) => {
    return doctors.filter(doc => doc.department_id === deptId || doc.department?._id === deptId);
  };

  const submitAppointment = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg("");
    try {
      await bookAppointment({
        doctor_id: selectedDoctor._id,
        hospital_id: selectedHospital._id,
        appointment_date: aptForm.appointment_date,
        reason: aptForm.reason,
      });
      setMsg("Appointment requested successfully!");
      setAptForm({ appointment_date: "", reason: "" });
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to book appointment");
    } finally {
      setSubmitting(false);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg("");
    try {
      await createReview({
        doctor_id: selectedDoctor._id,
        hospital_id: selectedHospital._id,
        rating: revForm.rating,
        comment: revForm.comment,
      });
      setMsg("Review submitted successfully!");
      setRevForm({ rating: 5, comment: "" });
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  if (selectedHospital) {
    return (
      <div className="animate-fadeInUp">
        <button onClick={() => setSelectedHospital(null)}
          className="mb-4 px-4 py-2 rounded-xl text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 
                     hover:bg-emerald-100 transition-all cursor-pointer flex items-center gap-2">
          <span>←</span> Back to Hospitals
        </button>

        {/* Top: Hospital Details */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-emerald-500 to-green-600 px-8 py-6 text-white">
            <h2 className="text-3xl font-bold">{selectedHospital.hospital_name}</h2>
            <p className="text-emerald-100 text-sm mt-1">📍 {selectedHospital.location || "Location N/A"}</p>
          </div>
          <div className="p-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Address</div>
              <div className="text-sm text-gray-800 mt-1">{selectedHospital.address || "N/A"}</div>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact Email</div>
              <div className="text-sm text-gray-800 mt-1">{selectedHospital.email || "N/A"}</div>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</div>
              <div className="text-sm text-gray-800 mt-1">{selectedHospital.phone_numbers?.join(", ") || "N/A"}</div>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</div>
              <div className="text-sm text-gray-800 mt-1">{selectedHospital.description || "N/A"}</div>
            </div>
          </div>
        </div>

        {/* Layout: Departments (Left) and Doctor Details (Right) */}
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Left Panel: Departments */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-lg font-bold text-gray-800 px-1">Departments</h3>
            {departments && departments.length > 0 ? (
              departments.map((dept) => {
                const isExpanded = expandedDept === dept._id;
                // As a fallback, if department_id mapping fails, we just show all doctors if it's the only department, or rely on proper dept assignment.
                // In many cases, doctor object possesses department_id. Let's filter generically just in case.
                const deptDoctors = doctors.filter(doc => (doc.department_id === dept._id) || (doc.department?._id === dept._id) || (doc.specialization === dept.name));
                const docsToRender = deptDoctors.length > 0 ? deptDoctors : doctors; // Fallback to all doctors for rendering safety if missing dept binding

                return (
                  <div key={dept._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all">
                    <div 
                      className={`px-4 py-3 cursor-pointer flex justify-between items-center transition-colors ${isExpanded ? "bg-emerald-50 text-emerald-800" : "hover:bg-gray-50 text-gray-800"}`}
                      onClick={() => setExpandedDept(isExpanded ? null : dept._id)}
                    >
                      <h4 className="font-semibold">{dept.name || dept.department_name || "Department"}</h4>
                      <span className={`transition-transform flex w-6 h-6 items-center justify-center rounded-full ${isExpanded ? "rotate-180 bg-emerald-200 text-emerald-800" : "bg-gray-100 text-gray-500"}`}>▼</span>
                    </div>
                    {isExpanded && (
                      <div className="p-2 border-t border-gray-100 bg-gray-50/50">
                        {docsToRender.length > 0 ? (
                          <div className="space-y-2">
                            {docsToRender.map(doc => (
                              <div 
                                key={doc._id} 
                                onClick={() => { setSelectedDoctor(doc); setActiveForm(null); setMsg(""); }}
                                className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center gap-3
                                  ${selectedDoctor?._id === doc._id ? "bg-white border-emerald-400 shadow-sm ring-1 ring-emerald-400" : "bg-white border-gray-200 hover:border-emerald-300"}`}
                              >
                                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-lg">👨‍⚕️</div>
                                <div>
                                  <div className="text-sm font-semibold text-gray-800">Dr. {doc.user_id?.name || "Unknown"}</div>
                                  <div className="text-xs text-gray-500">{doc.specialization || "General"}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-500 p-2 text-center">No doctors found in this department.</p>
                        )}
                      </div>
                    )}
                  </div>
                )
              })
            ) : (
              // Fallback if no departments are fetched but there are doctors
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 bg-emerald-50 text-emerald-800 font-semibold border-b border-gray-100">
                  All Doctors
                </div>
                <div className="p-2 bg-gray-50/50 space-y-2">
                  {doctors.length > 0 ? doctors.map(doc => (
                    <div 
                      key={doc._id} 
                      onClick={() => { setSelectedDoctor(doc); setActiveForm(null); setMsg(""); }}
                      className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center gap-3
                        ${selectedDoctor?._id === doc._id ? "bg-white border-emerald-400 shadow-sm ring-1 ring-emerald-400" : "bg-white border-gray-200 hover:border-emerald-300"}`}
                    >
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-lg">👨‍⚕️</div>
                      <div>
                        <div className="text-sm font-semibold text-gray-800">Dr. {doc.user_id?.name || "Unknown"}</div>
                        <div className="text-xs text-gray-500">{doc.specialization || "General"}</div>
                      </div>
                    </div>
                  )) : (
                    <p className="text-xs text-gray-500 p-2 text-center">No doctors available.</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Panel: Doctor Details & Forms */}
          <div className="lg:col-span-2">
            {selectedDoctor ? (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden animate-fadeInUp">
                {/* Doctor Header card */}
                <div className="p-6 md:p-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center border-b border-gray-100">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-emerald-100 to-green-50 flex flex-shrink-0 items-center justify-center text-5xl shadow-inner border border-emerald-100">
                    👨‍⚕️
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-2xl font-bold text-gray-800">Dr. {selectedDoctor.user_id?.name || "N/A"}</h3>
                    <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg font-medium border border-emerald-100">
                        {selectedDoctor.specialization || "General"}
                      </span>
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg font-medium border border-blue-100">
                        {selectedDoctor.experience || 0} Yrs Experience
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 pt-1">
                      <div>📧 {selectedDoctor.user_id?.email || "Email N/A"}</div>
                      <div>📞 {selectedDoctor.user_id?.phone || "Phone N/A"}</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-6 bg-gray-50 border-b border-gray-100 flex flex-col sm:flex-row gap-4">
                  <button onClick={() => setActiveForm(activeForm === 'appointment' ? null : 'appointment')}
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all cursor-pointer border ${activeForm === 'appointment' ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-white text-emerald-600 border-emerald-200 hover:bg-emerald-50'}`}>
                    📅 Add Appointment
                  </button>
                  <button onClick={() => setActiveForm(activeForm === 'review' ? null : 'review')}
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all cursor-pointer border ${activeForm === 'review' ? 'bg-amber-500 text-white border-amber-500 shadow-md' : 'bg-white text-amber-600 border-amber-200 hover:bg-amber-50'}`}>
                    ⭐ Add Review
                  </button>
                </div>

                {/* Forms Area */}
                <div className="p-6">
                  {msg && (
                    <div className={`mb-6 p-4 rounded-xl text-sm font-medium border ${msg.includes("success") ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "bg-red-50 border-red-200 text-red-600"}`}>
                      {msg}
                    </div>
                  )}

                  {activeForm === 'appointment' && (
                    <form onSubmit={submitAppointment} className="space-y-4 animate-scaleIn">
                      <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 flex items-center justify-between text-sm text-emerald-800 mb-6">
                        <div><strong className="block text-xs uppercase text-emerald-600 mb-1">Patient</strong> {user?.name || "Your Profile"}</div>
                        <div className="text-right"><strong className="block text-xs uppercase text-emerald-600 mb-1">Doctor</strong> Dr. {selectedDoctor.user_id?.name}</div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date (Optional)</label>
                        <input type="date" value={aptForm.appointment_date} onChange={(e) => setAptForm({ ...aptForm, appointment_date: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-emerald-400 outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Visit / Symptoms</label>
                        <textarea value={aptForm.reason} onChange={(e) => setAptForm({ ...aptForm, reason: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-emerald-400 outline-none resize-none" rows={3}
                          placeholder="Please describe your symptoms briefly..." required />
                      </div>
                      <button type="submit" disabled={submitting}
                        className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-500 to-green-600 shadow-lg cursor-pointer disabled:opacity-50 transition-transform active:scale-95">
                        {submitting ? "Booking..." : "Confirm Appointment Request"}
                      </button>
                    </form>
                  )}

                  {activeForm === 'review' && (
                    <form onSubmit={submitReview} className="space-y-5 animate-scaleIn">
                      <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 flex items-center justify-between text-sm text-amber-800 mb-4">
                        <div><strong className="block text-xs uppercase text-amber-600 mb-1">Reviewing</strong> Dr. {selectedDoctor.user_id?.name}</div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                        <div className="flex gap-2">
                          {[1,2,3,4,5].map(star => (
                            <button key={star} type="button" onClick={() => setRevForm({ ...revForm, rating: star })}
                              className={`text-3xl transition-transform hover:scale-110 cursor-pointer ${star <= revForm.rating ? "text-amber-400" : "text-gray-200"}`}>
                              ★
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
                        <textarea value={revForm.comment} onChange={(e) => setRevForm({ ...revForm, comment: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-amber-400 outline-none resize-none" rows={3}
                          placeholder="How was your experience?" required />
                      </div>
                      <button type="submit" disabled={submitting}
                        className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-amber-500 to-amber-600 shadow-lg cursor-pointer disabled:opacity-50 transition-transform active:scale-95">
                        {submitting ? "Submitting..." : "Submit Review"}
                      </button>
                    </form>
                  )}
                  
                  {!activeForm && (
                     <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <span className="text-4xl block mb-2 opacity-50">✨</span>
                        <p>Select an action above to proceed</p>
                     </div>
                  )}

                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-2xl border border-dashed border-gray-300 h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl shadow-sm border border-gray-100 mb-4">
                  👨‍⚕️
                </div>
                <h3 className="text-xl font-bold text-gray-700">No Doctor Selected</h3>
                <p className="text-gray-500 text-sm mt-2 max-w-xs">Select a doctor from the departments list on the left to view their profile, book an appointment, or leave a review.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Hospital List View
  return (
    <div className="animate-fadeInUp">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Hospitals</h2>
          <p className="text-sm text-gray-500 mt-1">Search and browse available hospitals</p>
        </div>
        <div className="relative">
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or location..."
            className="w-full sm:w-80 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none pl-10" 
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading hospitals...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-5xl block mb-4">🏥</span>
          <p className="text-gray-500">No hospitals found matching your search</p>
          <button onClick={() => setSearch("")} className="mt-4 text-sm text-emerald-600 font-medium hover:underline cursor-pointer">Clear Search</button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((hospital, i) => (
            <div key={i} onClick={() => handleSelectHospital(hospital)}
              className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 
                         transition-all cursor-pointer group flex flex-col h-full">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-green-50 flex items-center justify-center text-3xl mb-4
                             group-hover:scale-110 transition-transform shadow-inner border border-emerald-50">🏥</div>
              <h3 className="text-lg font-bold text-gray-800 group-hover:text-emerald-600 transition-colors line-clamp-1">{hospital.hospital_name}</h3>
              <p className="text-sm text-gray-500 mt-1 flex-1 line-clamp-2">📍 {hospital.location || "Location not specified"}</p>
              
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 border border-emerald-100 text-emerald-700">
                  {hospital.departments?.length || 0} Departments
                </span>
                <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 border border-blue-100 text-blue-700">
                  {hospital.doctors?.length || 0} Doctors
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HospitalDetails;
