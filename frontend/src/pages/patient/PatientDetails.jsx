import { useAuth } from "../../context/AuthContext";

const PatientDetails = () => {
  const { user } = useAuth();

  return (
    <div className="animate-fadeInUp">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Patient Profile</h2>
        <p className="text-sm text-gray-500 mt-1">Your personal information</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-green-600 px-8 py-8">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-3xl text-white font-bold shadow-lg">
              {user?.name?.charAt(0)?.toUpperCase() || "P"}
            </div>
            <div className="text-white">
              <h3 className="text-2xl font-bold">{user?.name || "Patient"}</h3>
              <p className="text-emerald-100 text-sm mt-1 capitalize">{user?.role} Account</p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="p-8 grid sm:grid-cols-2 gap-6">
          {[
            { label: "Full Name", value: user?.name, icon: "👤" },
            { label: "Email", value: user?.email, icon: "✉️" },
            { label: "Phone", value: user?.phone, icon: "📞" },
            { label: "Role", value: user?.role, icon: "🏷️" },
            { label: "Date of Birth", value: user?.dob ? new Date(user.dob).toLocaleDateString() : "Not set", icon: "🎂" },
            { label: "Address", value: user?.address || "Not set", icon: "📍" },
            { label: "Account Status", value: user?.isVerified ? "Verified" : "Unverified", icon: "✅" },
            { label: "Member Since", value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A", icon: "📅" },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
              <span className="text-xl">{item.icon}</span>
              <div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">{item.label}</div>
                <div className="text-sm font-semibold text-gray-800 mt-0.5 capitalize">{item.value || "N/A"}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;
