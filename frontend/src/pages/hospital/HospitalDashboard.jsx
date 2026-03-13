import { useState, useEffect } from "react";
import { getMyHospital } from "../../services/api";
import DashboardLayout from "../../components/DashboardLayout";
import HospitalRegistration from "./HospitalRegistration";

const HospitalDashboard = () => {
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [needsRegistration, setNeedsRegistration] = useState(false);

  useEffect(() => { checkProfile(); }, []);

  const checkProfile = async () => {
    try {
      const data = await getMyHospital();
      setHospital(data);
    } catch (err) {
      if (err.response?.status === 404) {
        setNeedsRegistration(true);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-3xl mx-auto mb-4 animate-pulse-slow">🏥</div>
          <p className="text-gray-500">Loading hospital dashboard...</p>
        </div>
      </div>
    );
  }

  if (needsRegistration) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <HospitalRegistration onRegistered={checkProfile} />
      </div>
    );
  }

  if (hospital && !hospital.approved_by_admin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md animate-fadeInUp">
          <div className="w-20 h-20 rounded-2xl bg-amber-100 flex items-center justify-center text-4xl mx-auto mb-4">⏳</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Awaiting Admin Approval</h2>
          <p className="text-gray-500 leading-relaxed">
            Your hospital profile has been submitted and is pending approval. 
            You'll get access to the dashboard once the admin verifies your information.
          </p>
        </div>
      </div>
    );
  }

  const sidebarItems = [
    { path: "/hospital", label: "Hospital Details", icon: "🏥" },
    { path: "/hospital/departments", label: "Departments", icon: "🏢" },
    { path: "/hospital/doctors", label: "Doctors", icon: "👨‍⚕️" },
    { path: "/hospital/medical-records", label: "Medical Records", icon: "📂" },
  ];

  return <DashboardLayout sidebarItems={sidebarItems} title="Hospital Dashboard" />;
};

export default HospitalDashboard;
