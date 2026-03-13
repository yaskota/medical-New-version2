import { useState, useEffect } from "react";
import { getDepartmentsByHospital, getAllHospitals } from "../../services/api";

const Departments = () => {
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospitalId, setSelectedHospitalId] = useState("");
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const data = await getAllHospitals();
        setHospitals(data.hospitals || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchHospitals();
  }, []);

  const fetchDepartments = async (hospitalId) => {
    setLoading(true);
    try {
      const data = await getDepartmentsByHospital(hospitalId);
      setDepartments(data.departments || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleHospitalChange = (e) => {
    const id = e.target.value;
    setSelectedHospitalId(id);
    if (id) fetchDepartments(id);
    else setDepartments([]);
  };

  return (
    <div className="animate-fadeInUp">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Departments</h2>
        <p className="text-sm text-gray-500 mt-1">Browse hospital departments</p>
      </div>

      <div className="mb-6">
        <select value={selectedHospitalId} onChange={handleHospitalChange}
          className="w-full sm:w-80 px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white
                     focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none">
          <option value="">Select a hospital</option>
          {hospitals.map((h) => (
            <option key={h._id} value={h._id}>{h.hospital_name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading departments...</div>
      ) : departments.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-5xl block mb-4">🏢</span>
          <p className="text-gray-500">{selectedHospitalId ? "No departments found" : "Select a hospital to view departments"}</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept, i) => (
            <div key={i} className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center text-xl mb-3">🏢</div>
              <h3 className="font-bold text-gray-800">{dept.department_name}</h3>
              <p className="text-sm text-gray-500 mt-1">{dept.description || "No description"}</p>
              <div className="mt-3">
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 border border-blue-200 text-blue-700">
                  {dept.doctors?.length || 0} Doctors
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Departments;
