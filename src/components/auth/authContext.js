import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [premium, setPremium] = useState(false);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("authUser");
   

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

   
  }, []);

  const login = (userData) => {
    setUser(userData);
    sessionStorage.setItem("authUser", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setPremium(false);
    sessionStorage.removeItem("authUser");
    sessionStorage.removeItem("isPremium");
  };

  const activatePremium = () => {
    console.log()
    setPremium(true);
    sessionStorage.setItem("isPremium", "true");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, premium, activatePremium }}>
      {children}
    </AuthContext.Provider>
  );
};
