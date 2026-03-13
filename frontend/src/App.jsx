import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ChatBot from "./components/ChatBot/index";

// Pages
import LandingPage from "./pages/LandingPage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VerifyOTP from "./pages/auth/VerifyOTP";

// Patient
import DashboardLayout from "./components/DashboardLayout";
import PatientDetails from "./pages/patient/PatientDetails";
import PatientHistory from "./pages/patient/PatientHistory";
import MedicalFiles from "./pages/patient/MedicalFiles";
import HospitalDetails from "./pages/patient/HospitalDetails";
import Departments from "./pages/patient/Departments";
import Doctors from "./pages/patient/Doctors";
import AppointmentApprovals from "./pages/patient/AppointmentApprovals";

// Doctor
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorDetails from "./pages/doctor/DoctorDetails";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import DoctorHospitals from "./pages/doctor/DoctorHospitals";
import DoctorMedicalFiles from "./pages/doctor/DoctorMedicalFiles";

// Hospital
import HospitalDashboard from "./pages/hospital/HospitalDashboard";
import HospitalInfo from "./pages/hospital/HospitalInfo";
import HospitalDepartments from "./pages/hospital/HospitalDepartments";
import HospitalDoctors from "./pages/hospital/HospitalDoctors";
import HospitalMedicalRecords from "./pages/hospital/HospitalMedicalRecords";

// Admin
import AdminDoctors from "./pages/admin/AdminDoctors";
import AdminHospitals from "./pages/admin/AdminHospitals";
import AdminPatients from "./pages/admin/AdminPatients";
import AdminPatientRecords from "./pages/admin/AdminPatientRecords";

// Protected Route
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-2xl animate-pulse-slow">🏥</div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user?.role)) return <Navigate to="/" />;

  return children;
};

// Patient Layout Wrapper
const PatientLayout = () => {
  const sidebarItems = [
    { path: "/patient", label: "Patient Details", icon: "👤" },
    { path: "/patient/history", label: "Patient History", icon: "📋" },
    { path: "/patient/medical-files", label: "Medical Files", icon: "📂" },
    { path: "/patient/hospitals", label: "Hospital Details", icon: "🏥" },
    { path: "/patient/departments", label: "Departments", icon: "🏢" },
    { path: "/patient/doctors", label: "Doctors", icon: "👨‍⚕️" },
    { path: "/patient/appointments", label: "Appointment Approvals", icon: "📅" },
  ];

  return <DashboardLayout sidebarItems={sidebarItems} title="Patient Dashboard" />;
};

// Admin Layout Wrapper
const AdminLayout = () => {
  const sidebarItems = [
    { path: "/admin", label: "Patients", icon: "👥" },
    { path: "/admin/patient-records", label: "Patient Records", icon: "📋" },
    { path: "/admin/approved-doctors", label: "Approved Doctors", icon: "✅" },
    { path: "/admin/unapproved-doctors", label: "Unapproved Doctors", icon: "⏳" },
    { path: "/admin/approved-hospitals", label: "Approved Hospitals", icon: "🏥" },
    { path: "/admin/unapproved-hospitals", label: "Unapproved Hospitals", icon: "🔔" },
  ];

  return <DashboardLayout sidebarItems={sidebarItems} title="Admin Dashboard" />;
};

function AppRoutes() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />

        {/* Patient Routes */}
        <Route path="/patient" element={<ProtectedRoute allowedRoles={["patient"]}><PatientLayout /></ProtectedRoute>}>
          <Route index element={<PatientDetails />} />
          <Route path="history" element={<PatientHistory />} />
          <Route path="medical-files" element={<MedicalFiles />} />
          <Route path="hospitals" element={<HospitalDetails />} />
          <Route path="departments" element={<Departments />} />
          <Route path="doctors" element={<Doctors />} />
          <Route path="appointments" element={<AppointmentApprovals />} />
        </Route>

        {/* Doctor Routes */}
        <Route path="/doctor" element={<ProtectedRoute allowedRoles={["doctor"]}><DoctorDashboard /></ProtectedRoute>}>
          <Route index element={<DoctorDetails />} />
          <Route path="appointments" element={<DoctorAppointments />} />
          <Route path="hospitals" element={<DoctorHospitals />} />
          <Route path="medical-files" element={<DoctorMedicalFiles />} />
        </Route>

        {/* Hospital Routes */}
        <Route path="/hospital" element={<ProtectedRoute allowedRoles={["hospital"]}><HospitalDashboard /></ProtectedRoute>}>
          <Route index element={<HospitalInfo />} />
          <Route path="departments" element={<HospitalDepartments />} />
          <Route path="doctors" element={<HospitalDoctors />} />
          <Route path="medical-records" element={<HospitalMedicalRecords />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminPatients />} />
          <Route path="patient-records" element={<AdminPatientRecords />} />
          <Route path="approved-doctors" element={<AdminDoctors approved={true} />} />
          <Route path="unapproved-doctors" element={<AdminDoctors approved={false} />} />
          <Route path="approved-hospitals" element={<AdminHospitals approved={true} />} />
          <Route path="unapproved-hospitals" element={<AdminHospitals approved={false} />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {/* Global Chatbot - appears on every page */}
      <ChatBot />
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;