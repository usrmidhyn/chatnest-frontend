import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ currentUser, selectedUser, setSelectedUser }) => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      if (!currentUser?._id) return;

      try {
        const res = await axios.get("http://localhost:5000/api/auth/users");
        const filtered = res.data.filter((u) => u._id !== currentUser._id);
        setUsers(filtered);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    fetchUsers();
  }, [currentUser]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/register");
  };

  return (
    <div className="col-3 bg-light border-end p-3 d-flex flex-column">
      <div>
        <h5 className="mb-3">Welcome, {currentUser?.username}</h5>
        <hr />
        {users.length === 0 ? (
          <p className="text-muted">No other users available</p>
        ) : (
          users.map((user) => (
            <div
              key={user._id}
              className={`card mb-2 p-2 ${
                selectedUser?._id === user._id ? "bg-primary text-white" : ""
              }`}
              style={{ cursor: "pointer" }}
              onClick={() => setSelectedUser(user)}
            >
              {user.username}
            </div>
          ))
        )}
      </div>

      <div className="mt-auto pt-3">
        <button className="btn btn-outline-danger w-100" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
