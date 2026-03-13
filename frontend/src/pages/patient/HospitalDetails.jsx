import { useState, useEffect } from "react";
import { getAllHospitals, getHospitalDoctors, getReviewsByHospital } from "../../services/api";

const HospitalDetails = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("info");

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
    setActiveTab("info");
    try {
      const [docsData, revData] = await Promise.all([
        getHospitalDoctors(hospital._id),
        getReviewsByHospital(hospital._id),
      ]);
      setDoctors(Array.isArray(docsData) ? docsData : []);
      setReviews(revData?.reviews || []);
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = hospitals.filter((h) =>
    h.hospital_name?.toLowerCase().includes(search.toLowerCase()) ||
    h.location?.toLowerCase().includes(search.toLowerCase())
  );

  if (selectedHospital) {
    return (
      <div className="animate-fadeInUp">
        <button onClick={() => setSelectedHospital(null)}
          className="mb-4 px-4 py-2 rounded-xl text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 
                     hover:bg-emerald-100 transition-all cursor-pointer">
          ← Back to Hospitals
        </button>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-green-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white">{selectedHospital.hospital_name}</h2>
            <p className="text-emerald-100 text-sm mt-1">📍 {selectedHospital.location || "N/A"}</p>
          </div>

          <div className="flex border-b border-gray-200">
            {["info", "doctors", "reviews"].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-sm font-medium text-center capitalize transition-all cursor-pointer
                  ${activeTab === tab ? "text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50" : "text-gray-500 hover:text-gray-700"}`}>
                {tab}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === "info" && (
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: "Address", value: selectedHospital.address },
                  { label: "Email", value: selectedHospital.email },
                  { label: "Phone", value: selectedHospital.phone_numbers?.join(", ") },
                  { label: "Description", value: selectedHospital.description },
                ].map((item) => (
                  <div key={item.label} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="text-xs font-medium text-gray-500 uppercase">{item.label}</div>
                    <div className="text-sm font-semibold text-gray-800 mt-1">{item.value || "N/A"}</div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "doctors" && (
              doctors.length === 0 ? (
                <p className="text-center py-10 text-gray-400">No doctors found in this hospital</p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {doctors.map((doc, i) => (
                    <div key={i} className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-xl">👨‍⚕️</div>
                      <div>
                        <div className="font-semibold text-gray-800 text-sm">{doc.user_id?.name || "Doctor"}</div>
                        <div className="text-xs text-gray-500">{doc.specialization || "General"}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {activeTab === "reviews" && (
              reviews.length === 0 ? (
                <p className="text-center py-10 text-gray-400">No reviews yet</p>
              ) : (
                <div className="space-y-3">
                  {reviews.map((rev, i) => (
                    <div key={i} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm text-gray-800">{rev.patient_id?.name || "Patient"}</span>
                        <div className="text-amber-500 text-sm">{"⭐".repeat(rev.rating || 0)}</div>
                      </div>
                      <p className="text-sm text-gray-600">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeInUp">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Hospitals</h2>
          <p className="text-sm text-gray-500 mt-1">Browse available hospitals</p>
        </div>
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search hospitals..."
          className="px-4 py-2 rounded-xl border border-gray-200 text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none" />
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading hospitals...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-5xl block mb-4">🏥</span>
          <p className="text-gray-500">No hospitals found</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((hospital, i) => (
            <div key={i} onClick={() => handleSelectHospital(hospital)}
              className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 
                         transition-all cursor-pointer group">
              <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center text-2xl mb-4
                             group-hover:scale-110 transition-transform">🏥</div>
              <h3 className="font-bold text-gray-800 group-hover:text-emerald-600 transition-colors">{hospital.hospital_name}</h3>
              <p className="text-sm text-gray-500 mt-1">📍 {hospital.location || "N/A"}</p>
              <div className="flex items-center gap-2 mt-3">
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 border border-emerald-200 text-emerald-700">
                  {hospital.departments?.length || 0} Departments
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 border border-blue-200 text-blue-700">
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
