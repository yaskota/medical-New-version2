import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./../context/AuthContext";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const scrollToSection = (id) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const getDashboardPath = () => {
    if (!user) return "/";
    switch (user.role) {
      case "patient": return "/patient";
      case "doctor": return "/doctor";
      case "hospital": return "/hospital";
      case "admin": return "/admin";
      default: return "/";
    }
  };

  const getDashboardLabel = () => {
    if (!user) return "";
    switch (user.role) {
      case "patient": return "Patient";
      case "doctor": return "Doctor";
      case "hospital": return "Hospital";
      case "admin": return "Admin";
      default: return "Dashboard";
    }
  };

  const navLinks = [
    { label: "Home", id: "home" },
    { label: "About", id: "about" },
    { label: "Services", id: "services" },
    { label: "Blog", id: "blog" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 
      ${scrolled ? "bg-white/95 backdrop-blur-md shadow-lg shadow-green-100/40" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 
                          flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-emerald-200/50
                          group-hover:scale-105 transition-transform">
              H
            </div>
            <span className={`text-xl font-bold tracking-tight transition-colors
              ${scrolled ? "text-gray-800" : "text-gray-800"}`}>
              Health<span className="text-emerald-600">care</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button key={link.id} onClick={() => scrollToSection(link.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer
                  ${scrolled ? "text-gray-600 hover:text-emerald-600 hover:bg-emerald-50" : "text-gray-700 hover:text-emerald-600 hover:bg-white/50"}`}>
                {link.label}
              </button>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link to={getDashboardPath()}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-emerald-700 bg-emerald-50 
                             hover:bg-emerald-100 border border-emerald-200 transition-all">
                  {getDashboardLabel()} Dashboard
                </Link>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 
                                flex items-center justify-center text-white text-sm font-bold shadow-md">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <button onClick={handleLogout}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 
                               border border-red-200 transition-all cursor-pointer">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link to="/login"
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white
                           bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700
                           shadow-lg shadow-emerald-200/50 hover:shadow-xl hover:shadow-emerald-300/50
                           transition-all hover:-translate-y-0.5">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-10 h-10 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 animate-slideDown">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 space-y-1">
              {navLinks.map((link) => (
                <button key={link.id} onClick={() => scrollToSection(link.id)}
                  className="block w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-gray-700 
                             hover:bg-emerald-50 hover:text-emerald-700 transition-all cursor-pointer">
                  {link.label}
                </button>
              ))}
              <div className="border-t border-gray-100 pt-3 mt-3">
                {isAuthenticated ? (
                  <>
                    <Link to={getDashboardPath()} onClick={() => setMobileOpen(false)}
                      className="block w-full text-center px-4 py-3 rounded-xl text-sm font-semibold text-emerald-700 
                                 bg-emerald-50 border border-emerald-200 mb-2">
                      {getDashboardLabel()} Dashboard
                    </Link>
                    <button onClick={() => { handleLogout(); setMobileOpen(false); }}
                      className="block w-full text-center px-4 py-3 rounded-xl text-sm font-medium text-red-600 
                                 hover:bg-red-50 border border-red-200 cursor-pointer">
                      Logout
                    </button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setMobileOpen(false)}
                    className="block w-full text-center px-4 py-3 rounded-xl text-sm font-semibold text-white
                               bg-gradient-to-r from-emerald-500 to-green-600 shadow-lg">
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
