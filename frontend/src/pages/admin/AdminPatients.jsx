const AdminPatients = () => {
  return (
    <div className="animate-fadeInUp">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">All Patients</h2>
        <p className="text-sm text-gray-500 mt-1">View all registered patients in the system</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="text-center py-12">
          <span className="text-5xl block mb-4">👥</span>
          <p className="text-gray-500 text-lg font-medium">Patient Management</p>
          <p className="text-gray-400 text-sm mt-1">Patient records are accessible through the Patient Records section</p>
        </div>
      </div>
    </div>
  );
};

export default AdminPatients;
