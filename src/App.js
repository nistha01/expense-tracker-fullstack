import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Authentication from "./components/auth/Authentication";
import ExpenseTracker from "./components/home/ExpenseTracker";
import PaymentPage from "./components/payment/PaymentPage";
import { useAuth } from "./components/auth/authContext";

function App() {
  const { user } = useAuth(); 

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={user ? <Navigate to="/home" /> : <Authentication />} />

        {/* Protected Routes */}
        <Route path="/home" element={user ? <ExpenseTracker /> : <Navigate to="/" />} />
        <Route path="/payment" element={user ? <PaymentPage /> : <Navigate to="/" />} />
        
      </Routes>
    </Router>
  );
}

export default App;
