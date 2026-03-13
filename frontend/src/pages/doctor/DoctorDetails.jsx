import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { getDoctorProfile } from "../../services/api";

const DoctorDetails = () => {
  const { user } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getDoctorProfile();
        setDoctor(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>;

  return (
    <div className="animate-fadeInUp">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Doctor Profile</h2>
        <p className="text-sm text-gray-500 mt-1">Your professional details</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-green-600 px-8 py-8">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-3xl text-white font-bold shadow-lg">
              {user?.name?.charAt(0)?.toUpperCase() || "D"}
            </div>
            <div className="text-white">
              <h3 className="text-2xl font-bold">Dr. {user?.name}</h3>
              <p className="text-emerald-100 mt-1">{doctor?.specialization || "General Practice"}</p>
            </div>
          </div>
        </div>

        <div className="p-8 grid sm:grid-cols-2 gap-6">
          {[
            { label: "Doctor ID", value: doctor?.doctor_id, icon: "🆔" },
            { label: "Specialization", value: doctor?.specialization, icon: "🩺" },
            { label: "Experience", value: `${doctor?.experience || 0} years`, icon: "📅" },
            { label: "Education", value: doctor?.education, icon: "🎓" },
            { label: "Email", value: user?.email, icon: "✉️" },
            { label: "Phone", value: user?.phone, icon: "📞" },
            { label: "Approval Status", value: doctor?.approved_by_admin ? "Approved ✅" : "Pending ⏳", icon: "📋" },
            { label: "Hospitals", value: `${doctor?.hospitals?.length || 0} affiliated`, icon: "🏥" },
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

export default DoctorDetails;
