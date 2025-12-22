import React from "react";

export default function ContactInfo({ tempUser, editMode, handleChange }) {
  return (
    <div className="section">
      <h3>Contact Info</h3>
      <div className="field-row">
        <div className="field">
          <label>Email</label>
          <input
            name="email"
            value={tempUser.email}
            onChange={handleChange}
            disabled={!editMode}
          />
        </div>
        <div className="field">
          <label>WhatsApp</label>
          <input
            name="whatsapp"
            value={tempUser.whatsapp}
            onChange={handleChange}
            disabled={!editMode}
          />
        </div>
      </div>
      <div className="field-row">
        <div className="field">
          <label>Telegram</label>
          <input
            name="telegram"
            value={tempUser.telegram}
            onChange={handleChange}
            disabled={!editMode}
          />
        </div>
      </div>
    </div>
  );
}
