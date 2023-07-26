import React, { useEffect, useState } from "react";
import "../UserManagement/usermanagement.css";
import APIUtils from "../../helpers/APIUtils";
const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getAllUsers();
  }, );

  const api = (msg) => new APIUtils(msg);

  const getAllUsers = async () => {
    try {
      const response = await api().getAllUsers();
      if (Array.isArray(response.data.userData)) {
        setUsers(response.data.userData);
      } else {
        console.error("Invalid data format. Expected an array:", response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const blockUser = async (id) => {
    try {
      const response = await api(true).blockUser(id); 
      if (response.status === 200) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === id ? { ...user, status: true } : user
          )
        );
        window.alert("User blocked successfully!");
      } else {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("Error blocking user:", error);
    }
  };

  const unblockUser = async (id) => {
    try {
      const response = await api(true).unblockUser(id); 
      if (response.status === 200) {
        
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === id ? { ...user, status: false } : user
          )
        );
        window.alert("User unblocked successfully!");
      } else {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("Error blocking user:", error);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: "24px", textAlign: "center", color: "blue" }}>
        User Account Management
      </h1>
      <div className="user-grid">
        {users.map((user) => (
          <div key={user._id} className="user-card">
            <h2>{user.name}</h2>
            <p>Email: {user.email}</p>

            <button
              onClick={() => blockUser(user._id)}
              disabled={user.status}
              style={{
                backgroundColor: "#0000FF",
                opacity: user.status ? "0.5" : "1.5", 
              }}
            >
              Block
            </button>
            <span style={{ margin: "0 10px" }}></span>
            <button
              onClick={() => unblockUser(user._id)}
              disabled={!user.status}
              style={{
                backgroundColor: "#0000FF",
                opacity: !user.status ? "0.5" : "1.5", 
              }}
            >
              Unblock
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
