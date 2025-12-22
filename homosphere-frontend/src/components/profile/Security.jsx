import React from "react";

export default function Security({ onChangePassword, onDeleteAccount }) {
  return (
    <div className="section">
      <h3>Security</h3>
      <div className="field-row">
        <div className="field">
          <label>Password</label>
          <input type="password" value={"********"} disabled />
        </div>
      </div>
      <button className="change-password-btn" onClick={onChangePassword}>
        Change Password
      </button>
      <button className="delete-account-btn" style={{marginLeft: 16}} onClick={onDeleteAccount}>
        Delete Account
      </button>
    </div>
  );
}
