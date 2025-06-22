import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/authContext";
import "./Leaderboard.css";

const Leaderboard = () => {
  const { premium } = useAuth();
  const [leaders, setLeaders] = useState([]);
  const [minExpense, setMinExpense] = useState(null);
  const [maxExpense, setMaxExpense] = useState(null);

 useEffect(() => {
  const fetchExpenses = async () => {
    const authUser = sessionStorage.getItem("authUser");
    if (!authUser) {
      console.error("No user found in session storage.");
      return;
    }
    const userObject = JSON.parse(authUser); 
    const userEmail = userObject.email;
    if (!userEmail) {
      console.error("No email found in session storage.");
      return;
    }
    try {
      const maxResponse = await fetch(
        `http://localhost:3001/expense/getMaxExpense?email=${encodeURIComponent(userEmail)}`
      );
      const maxData = await maxResponse.json();
      // Fetch Min Expense
      const minResponse = await fetch(
        `http://localhost:3001/expense/getMinExpense?email=${encodeURIComponent(userEmail)}`
      );
      const minData = await minResponse.json();
      // Prepare leaderboard data
      const dummyLeaderboard = [
        { label: "Max Expense", value: maxData },
        { label: "Min Expense", value: minData },
      ];
      setLeaders(dummyLeaderboard);
      setMaxExpense(maxData);
      setMinExpense(minData);

    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  fetchExpenses();
}, []);


  // if (!premium) return null; // Uncomment if needed

  return (
    <div className="leaderboard-container">
      <h2>🏆 Leaderboard</h2>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Type</th>
            <th>Expense (₹)</th>
          </tr>
        </thead>
        <tbody>
          {leaders.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.label}</td>
              <td>{parseFloat(item.value).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
