import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/authContext";
import "./Leaderboard.css"; // Optional: for styling

const Leaderboard = () => {
  const { premium } = useAuth();
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
   
    const dummyData = [
      { email: "user1@example.com", total: 15000 },
      { email: "user2@example.com", total: 12500 },
      { email: "user3@example.com", total: 9800 },
      { email: "user4@example.com", total: 8700 },
    ];

    setLeaders(dummyData);
  }, []);

  //if (!premium) return null;

  return (
    <div className="leaderboard-container">
      <h2>🏆 Leaderboard</h2>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>#</th>
            <th>User</th>
            <th>Total Expense (₹)</th>
          </tr>
        </thead>
        <tbody>
          {leaders.map((user, index) => (
            <tr key={user.email}>
              <td>{index + 1}</td>
              <td>{user.email}</td>
              <td>{parseFloat(user.total).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
