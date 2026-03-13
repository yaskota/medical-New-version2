import { useState, useEffect } from "react";
import { getMyHospital } from "../../services/api";

const HospitalInfo = () => {
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHospital = async () => {
      try {
        const data = await getMyHospital();
        setHospital(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHospital();
  }, []);

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>;
  if (!hospital) return <div className="text-center py-20 text-gray-500">Hospital profile not found</div>;

  return (
    <div className="animate-fadeInUp">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Hospital Details</h2>
        <p className="text-sm text-gray-500 mt-1">Your hospital information</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-green-600 px-8 py-8">
          <h3 className="text-2xl font-bold text-white">{hospital.hospital_name}</h3>
          <p className="text-emerald-100 mt-1">📍 {hospital.location || "N/A"}</p>
          <div className="mt-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${hospital.approved_by_admin ? "bg-white/20 text-white" : "bg-amber-400/20 text-amber-200"}`}>
              {hospital.approved_by_admin ? "✅ Approved" : "⏳ Pending Approval"}
            </span>
          </div>
        </div>
        <div className="p-8 grid sm:grid-cols-2 gap-6">
          {[
            { label: "Hospital Name", value: hospital.hospital_name, icon: "🏥" },
            { label: "Gov. ID", value: hospital.government_hospital_id, icon: "🆔" },
            { label: "Location", value: hospital.location, icon: "📍" },
            { label: "Address", value: hospital.address, icon: "🏠" },
            { label: "Email", value: hospital.email, icon: "✉️" },
            { label: "Phones", value: hospital.phone_numbers?.join(", "), icon: "📞" },
            { label: "Departments", value: `${hospital.departments?.length || 0}`, icon: "🏢" },
            { label: "Doctors", value: `${hospital.doctors?.length || 0}`, icon: "👨‍⚕️" },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
              <span className="text-xl">{item.icon}</span>
              <div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">{item.label}</div>
                <div className="text-sm font-semibold text-gray-800 mt-0.5">{item.value || "N/A"}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HospitalInfo;
