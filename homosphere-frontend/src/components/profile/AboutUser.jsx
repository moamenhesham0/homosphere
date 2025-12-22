import React from "react";

export default function AboutUser({ tempUser, editMode, handleChange }) {
  return (
    <div className="section">
      <h3>About the User</h3>
      <textarea
        name="bio"
        value={tempUser.bio}
        onChange={handleChange}
        disabled={!editMode}
      />
    </div>
  );
}
