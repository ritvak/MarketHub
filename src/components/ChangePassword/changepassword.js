import React, { useState } from "react";
import { Input, Button, message } from "antd";
import "../ChangePassword/changepassword.css";
import APIUtils from "../../helpers/APIUtils";

const ChangePassword = ({ token }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const api = (msg) => new APIUtils(msg);

  const handleChangePassword = async () => {
    try {
      if (newPassword !== confirmNewPassword) {
        message.error("New password and confirm password must match.");
        return;
      }

      const response = await api(true).changePasswordAPI(
        oldPassword,
        newPassword
      );

      if (response.status === 200) {
        message.success("Password changed successfully.");
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error("An error occurred while changing the password.");
    }
  };

  return (
    <div className="container1">
      <h2>Change Password</h2>
      <div className="input-container">
        <label htmlFor="oldPassword">Old Password</label>
        <Input
          type="password"
          id="oldPassword"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
      </div>

      <div className="input-container">
        <label htmlFor="newPassword">New Password</label>
        <Input
          type="password"
          id="newPassword"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>

      <div className="input-container">
        <label htmlFor="confirmNewPassword">Confirm New Password</label>
        <Input
          type="password"
          id="confirmNewPassword"
          placeholder="Confirm New Password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
        />
      </div>

      <div className="button-container">
        <Button onClick={handleChangePassword}>Change Password</Button>
      </div>
    </div>
  );
};

export default ChangePassword;
