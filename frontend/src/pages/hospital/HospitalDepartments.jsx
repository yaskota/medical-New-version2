import { useState, useEffect } from "react";
import { getMyHospital, createDepartment, addDoctorsToDepartment, getDepartmentsByHospital } from "../../services/api";

const HospitalDepartments = () => {
  const [hospital, setHospital] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ department_name: "", description: "" });
  const [createLoading, setCreateLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const h = await getMyHospital();
      setHospital(h);
      const d = await getDepartmentsByHospital(h._id);
      setDepartments(d.departments || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    setMsg("");
    try {
      await createDepartment({ ...form, hospital_id: hospital._id });
      setMsg("Department created!");
      setForm({ department_name: "", description: "" });
      setShowCreate(false);
      fetchData();
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed");
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="animate-fadeInUp">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Departments</h2>
          <p className="text-sm text-gray-500 mt-1">Manage hospital departments</p>
        </div>
        <button onClick={() => setShowCreate(!showCreate)}
          className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-green-600 
                     shadow-md cursor-pointer transition-all hover:-translate-y-0.5">
          + Create Department
        </button>
      </div>

      {msg && <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-600">{msg}</div>}

      {showCreate && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6 animate-slideDown">
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department Name</label>
              <input type="text" value={form.department_name} onChange={(e) => setForm({ ...form, department_name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-emerald-400 outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-emerald-400 outline-none resize-none" rows={3} />
            </div>
            <button type="submit" disabled={createLoading}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-green-600 shadow-md cursor-pointer disabled:opacity-50">
              {createLoading ? "Creating..." : "Create"}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading...</div>
      ) : departments.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-5xl block mb-4">🏢</span>
          <p className="text-gray-500">No departments yet. Create your first one!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept, i) => (
            <div key={i} className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center text-xl mb-3">🏢</div>
              <h3 className="font-bold text-gray-800">{dept.department_name}</h3>
              <p className="text-sm text-gray-500 mt-1">{dept.description || "No description"}</p>
              <span className="inline-block mt-3 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 border border-blue-200 text-blue-700">
                {dept.doctors?.length || 0} Doctors
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HospitalDepartments;
