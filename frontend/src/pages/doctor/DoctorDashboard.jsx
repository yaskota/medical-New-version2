import { useState, useEffect } from "react";
import { getDoctorProfile } from "../../services/api";
import DashboardLayout from "../../components/DashboardLayout";
import DoctorRegistration from "./DoctorRegistration";

const DoctorDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [needsRegistration, setNeedsRegistration] = useState(false);

  useEffect(() => { checkProfile(); }, []);

  const checkProfile = async () => {
    try {
      console.log("fetching doctor data")
      const data = await getDoctorProfile();
      setProfile(data);
      if (!data.approved_by_admin) {
        setProfile(data); // show waiting screen
      }
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
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-3xl mx-auto mb-4 animate-pulse-slow">👨‍⚕️</div>
          <p className="text-gray-500">Loading doctor dashboard...</p>
        </div>
      </div>
    );
  }

  if (needsRegistration) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <DoctorRegistration onRegistered={checkProfile} />
      </div>
    );
  }

  if (profile && !profile.approved_by_admin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md animate-fadeInUp">
          <div className="w-20 h-20 rounded-2xl bg-amber-100 flex items-center justify-center text-4xl mx-auto mb-4">⏳</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Awaiting Admin Approval</h2>
          <p className="text-gray-500 leading-relaxed">
            Your doctor profile has been submitted and is pending approval from the admin. 
            You'll get access to the dashboard once approved.
          </p>
        </div>
      </div>
    );
  }

  const sidebarItems = [
    { path: "/doctor", label: "Doctor Details", icon: "👨‍⚕️" },
    { path: "/doctor/appointments", label: "Appointments", icon: "📅" },
    { path: "/doctor/hospitals", label: "Hospitals", icon: "🏥" },
    { path: "/doctor/medical-files", label: "Medical Files", icon: "📂" },
  ];

  return <DashboardLayout sidebarItems={sidebarItems} title="Doctor Dashboard" />;
};

export default DoctorDashboard;
