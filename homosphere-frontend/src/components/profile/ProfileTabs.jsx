import React from "react";
import { MdPerson, MdSecurity, MdHome, MdQuestionAnswer, MdAssignment, MdPublic } from "react-icons/md";
import "../../styles/ProfileSidebar.css";

const tabIcons = [
  <MdPerson />,         // Profile
  <MdSecurity />,       // Security
  <MdHome />,           // Properties
  <MdQuestionAnswer />, // Inquiries
  <MdAssignment />,     // Management Requests
  <MdPublic />          // Public Profile
];

export default function ProfileTabs({ tab, setTab, tabLabels }) {
  return (
    <aside className="profile-sidebar">
      <div className="profile-sidebar-header">
        <h2>Profile Menu</h2>
      </div>
      <nav className="profile-sidebar-nav">
        {tabLabels.map((label, idx) => (
          <button
            key={label}
            className={`profile-sidebar-link${tab === idx ? " active" : ""}`}
            onClick={() => setTab(idx)}
          >
            <span className="profile-sidebar-icon">{tabIcons[idx]}</span>
            {label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
