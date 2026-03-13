import { useState } from "react";
import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DashboardLayout = ({ sidebarItems, title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 
                         flex flex-col transform transition-transform duration-300 
                         ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        {/* Sidebar Header */}
        <div className="shrink-0 h-16 flex items-center gap-3 px-5 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 
                          flex items-center justify-center text-white text-sm font-bold shadow-md">H</div>
            <span className="text-lg font-bold text-gray-800">Health<span className="text-emerald-600">care</span></span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden ml-auto w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 cursor-pointer">
            ✕
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                  ${isActive
                    ? "bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border border-emerald-200 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                  }`}>
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="shrink-0 p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 
                          flex items-center justify-center text-white text-sm font-bold shadow-md">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-800 truncate">{user?.name}</div>
              <div className="text-xs text-gray-500 capitalize">{user?.role}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="shrink-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-10 h-10 rounded-lg flex items-center justify-center hover:bg-gray-100 cursor-pointer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </button>
            <h1 className="text-lg font-bold text-gray-800">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="px-3 py-1.5 rounded-lg text-sm text-gray-500 hover:bg-gray-100 transition-all">
              🏠 Home
            </Link>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 
                          flex items-center justify-center text-white text-sm font-bold shadow-md">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <button onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 
                         border border-red-200 transition-all cursor-pointer">
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
