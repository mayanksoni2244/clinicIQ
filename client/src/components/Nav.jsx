import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useRole } from "../context/Rolecontext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const { role, setRole } = useRole();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    // Update isLoggedIn and role on route change or storage change
    const checkLogin = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
      const savedRole = localStorage.getItem("userRole");
      if (savedRole === "patient" || savedRole === "doctor") {
        setRole(savedRole);
      } else {
        setRole(null);
      }
    };
    checkLogin();
    window.addEventListener("storage", checkLogin);
    return () => window.removeEventListener("storage", checkLogin);
  }, [location, setRole]);

  // Fetch pending appointments count for doctor
  useEffect(() => {
    const fetchPending = async () => {
      if (role === "doctor" && isLoggedIn) {
        try {
          const res = await (await import("../api/api.js")).default.get('/appointment/doctor', {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
          });
          const pending = res.data.filter(a => a.status === 'pending').length;
          setPendingCount(pending);
        } catch {
          setPendingCount(0);
        }
      } else {
        setPendingCount(0);
      }
    };

    fetchPending();

    const handler = (e) => {
      if (typeof e.detail === 'number') setPendingCount(e.detail);
    };
    window.addEventListener('pendingCountUpdated', handler);
    return () => window.removeEventListener('pendingCountUpdated', handler);
  }, [role, isLoggedIn, location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    setIsLoggedIn(false);
    setRole(null);
    navigate("/");
  };

  return (
    <nav className="w-full bg-white shadow-md py-4 px-8 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600">
        <Link to="/">ClinicIQ</Link>
      </h1>
      <ul className="flex gap-6 text-gray-700 font-medium items-center">
        {/* Home link is dynamic based on role */}
        {!isLoggedIn && <Link to="/">Home</Link>}
        {isLoggedIn && role === "patient" && <Link to="/home">Home</Link>}
        {isLoggedIn && role === "doctor" && <Link to="/dashboard">Home</Link>}
        {/* About and Contact only if not logged in */}
        {!isLoggedIn && <Link to="/about">About</Link>}
        {!isLoggedIn && <Link to="/contact">Contact</Link>}
        {/* Patient Nav */}
        {isLoggedIn && role === "patient" && (
          <>
            <Link to="/myapp">My Appointments</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/contact">Contact</Link>
            <button
              onClick={handleLogout}
              className="ml-4 px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-all"
            >
              Logout
            </button>
          </>
        )}
        {/* Doctor Nav */}
        {isLoggedIn && role === "doctor" && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/appointments" className="relative">
              Appointments
              {pendingCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-600 text-white rounded-full h-5 w-5 text-xs flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </Link>
            <Link to="/history">History</Link>
            <button
              onClick={handleLogout}
              className="ml-4 px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-all"
            >
              Logout
            </button>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
