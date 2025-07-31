import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useRole } from "../context/Rolecontext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const { role, setRole } = useRole();

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
            <Link to="/appointments">Appointments</Link>
            <Link to="/availability">Availability</Link>
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
