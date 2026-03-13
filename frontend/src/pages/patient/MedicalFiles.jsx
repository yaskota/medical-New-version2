import { useState } from "react";

const MedicalFiles = () => {
  const [filter, setFilter] = useState("");

  return (
    <div className="animate-fadeInUp">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Medical Files</h2>
          <p className="text-sm text-gray-500 mt-1">Your uploaded medical records</p>
        </div>
        <input type="text" value={filter} onChange={(e) => setFilter(e.target.value)}
          placeholder="Search files..."
          className="px-4 py-2 rounded-xl border border-gray-200 text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none" />
      </div>

      <div className="text-center py-20">
        <span className="text-5xl block mb-4">📂</span>
        <p className="text-gray-500 text-lg font-medium">No medical files yet</p>
        <p className="text-gray-400 text-sm mt-1">Your medical files will appear here when doctors upload them</p>
      </div>
    </div>
  );
};

export default MedicalFiles;
