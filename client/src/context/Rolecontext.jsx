// src/context/RoleContext.js
import { createContext, useContext, useState, useEffect } from "react";

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState(null);

  // On mount, check localStorage
  useEffect(() => {
    const savedRole = localStorage.getItem("userRole");
    if (savedRole === "patient" || savedRole === "doctor") {
      setRole(savedRole);
    }
  }, []);

  // Keep localStorage in sync
  useEffect(() => {
    if (role) {
      localStorage.setItem("userRole", role);
    } else {
      localStorage.removeItem("userRole");
    }
  }, [role]);

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
