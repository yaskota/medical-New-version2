import { useState, useEffect } from "react";
import { getAllHospitals } from "../../services/api";

const DoctorHospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const data = await getAllHospitals();
        setHospitals(data.hospitals || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHospitals();
  }, []);

  return (
    <div className="animate-fadeInUp">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Hospitals</h2>
        <p className="text-sm text-gray-500 mt-1">View available hospitals</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading...</div>
      ) : hospitals.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-5xl block mb-4">🏥</span>
          <p className="text-gray-500">No hospitals available</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {hospitals.map((h, i) => (
            <div key={i} className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-xl mb-3">🏥</div>
              <h3 className="font-bold text-gray-800">{h.hospital_name}</h3>
              <p className="text-sm text-gray-500 mt-1">📍 {h.location || "N/A"}</p>
              <p className="text-sm text-gray-500">{h.email || ""}</p>
              <div className="flex gap-2 mt-3">
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 border border-emerald-200 text-emerald-700">
                  {h.departments?.length || 0} Depts
                </span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${h.approved_by_admin ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>
                  {h.approved_by_admin ? "Verified" : "Pending"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorHospitals;
