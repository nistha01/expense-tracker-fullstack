import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/authContext";
import { useNavigate } from "react-router-dom";
import "./ExpenseTracker.css";
import Leaderboard from "./Leaderboard";

const ExpenseTracker = () => {
  const { user, logout,premium,activatePremium } = useAuth();
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    date: "",
    description: "",
    paymentMethod: ""
  });

  const [editData, setEditData] = useState(null);
  useEffect(() => {
    const fetchExpenses = async () => {
      // 1. Fetch expenses
      try {
        const response = await fetch("http://localhost:3001/expense/get", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userEmail: user.email })
        });
  
        if (response.ok) {
          const data = await response.json();
          setExpenses(data);
        } else {
          console.error("Failed to fetch expenses");
        }
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
  
      // 2. Check if user is premium
      try {
        const response = await fetch(`http://localhost:3001/order/status2/${user.email}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        });
  
        if (response.ok) {
          const data = await response.json();
          if (data.message === "true") {
            activatePremium();
          }
        } else {
          console.error("Failed to fetch premium status");
        }
      } catch (error) {
        console.error("Error fetching premium status:", error);
      }
  
      // 3. Get orderId and trigger webhook
      try {
        const resOrderId = await fetch(`http://localhost:3001/order/getOrderIDFromEmail/${user.email}`);
        if (resOrderId.ok) {
          const orderIdfetched = await resOrderId.text(); 
          const orderId = JSON.parse(orderIdfetched);
          console.log("Order ID received:", orderId);
  
          await fetch("http://localhost:3001/order/webhook", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderID: orderId })
          });
  
          console.log("Webhook called for:", orderId);
        } else {
          console.error("Failed to fetch order ID");
        }
      } catch (error) {
        console.error("Error calling webhook:", error);
      }
    };
  
    if (user?.email) fetchExpenses();
  }, [user]);
  
  
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    const { amount, category, date, description, paymentMethod } = formData;

    if (!amount || !category || !date) {
      alert("Amount, category, and date are required.");
      return;
    }

    const userData = JSON.parse(sessionStorage.getItem("authUser"));
    const userEmail = userData?.email;

    if (!userEmail) {
      alert("User not logged in.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/expense/addExpense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          category,
          date,
          description,
          paymentMethod,
          userEmail,
        }),
      });

      if (res.ok) {
        const newExpense = await res.json();
        setExpenses((prev) => [...prev, newExpense]);
        setFormData({
          amount: "",
          category: "",
          date: "",
          description: "",
          paymentMethod: "",
        });
      } else {
        console.error("Failed to add expense");
      }
    } catch (err) {
      console.error("Error adding expense:", err);
    }
  };

  const handleDelete = (id) => {
    setExpenses(expenses.filter((exp) => exp.id !== id));
  };

  const handleEdit = (expense) => {
    setEditData(expense);
  };

  const handleUpdate = () => {
    setExpenses(
      expenses.map((exp) => (exp.id === editData.id ? editData : exp))
    );
    setEditData(null);
  };

  const handlePremiumClick = () => {
    navigate("/payment"); 
  };

  return (
    <>
    <div className="tracker-wrapper">
      
      <header className="header">
        <h1>Welcome, {user.email}</h1>
        {!premium && <button className="premium-btn" onClick={handlePremiumClick}>
          Go Premium
        </button>}
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </header>

      <div className="expense-form">
        <input name="amount" type="number" placeholder="Amount" value={formData.amount} onChange={handleChange} />
        <input name="category" type="text" placeholder="Category" value={formData.category} onChange={handleChange} />
        <input name="date" type="date" value={formData.date} onChange={handleChange} />
        <input name="description" type="text" placeholder="Description" value={formData.description} onChange={handleChange} />
        <input name="paymentMethod" type="text" placeholder="Payment Method" value={formData.paymentMethod} onChange={handleChange} />
        <button className="add-btn" onClick={handleAdd}>Add Expense</button>
      </div>
      {premium &&<Leaderboard/>}
      <ul className="expense-list">
        {expenses.map((exp) => (
          <li key={exp.id} className="expense-item">
            <div>
              <strong>₹{exp.amount}</strong> — {exp.category} ({exp.date})
              <div className="description">{exp.description} | {exp.paymentMethod}</div>
            </div>
            <div>
              <button onClick={() => handleEdit(exp)}>✏️</button>
              <button onClick={() => handleDelete(exp.id)}>🗑️</button>
            </div>
          </li>
        ))}
      </ul>

      {editData && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Edit Expense</h3>
            <input name="amount" type="number" value={editData.amount} onChange={handleEditChange} />
            <input name="category" type="text" value={editData.category} onChange={handleEditChange} />
            <input name="date" type="date" value={editData.date} onChange={handleEditChange} />
            <input name="description" type="text" value={editData.description} onChange={handleEditChange} />
            <input name="paymentMethod" type="text" value={editData.paymentMethod} onChange={handleEditChange} />
            <button className="update-btn" onClick={handleUpdate}>Update</button>
            <button className="cancel-btn" onClick={() => setEditData(null)}>Cancel</button>
          </div>
        </div>
      )}
      
    
    </div>
  
    </>
  );
};

export default ExpenseTracker;
