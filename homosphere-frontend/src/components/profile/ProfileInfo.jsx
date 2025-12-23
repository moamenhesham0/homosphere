
export default function ProfileInfo({ tempUser, editMode, handleChange }) {
  const fullName = [tempUser.firstname, tempUser.lastname].filter(Boolean).join(" ");
  const getInitial = () => {
    if (tempUser.firstname && tempUser.firstname.length > 0) {
      return tempUser.firstname[0].toUpperCase();
    }
    if (tempUser.username && tempUser.username.length > 0) {
      return tempUser.username[0].toUpperCase();
    }
    return '?';
  };
  return (
    <div className="profile-info-card modern-profile-info v2-profile-info">
      <div className="v2-profile-header-row">
        <div className="v2-profile-avatar-block">
          {tempUser.photo ? (
            <img className="v2-profile-avatar" src={`https://pub-5fe480d20f5b4a3e9d119df2e1376fbc.r2.dev/${tempUser.photo}`} alt={fullName} />
          ) : (
            <div className="v2-profile-avatar v2-profile-avatar-placeholder">{getInitial()}</div>
          )}
        </div>
        <div className="v2-profile-user-block">
          <div className="v2-profile-name">{fullName || tempUser.username || "User"}</div>
          <div className="v2-profile-email">{tempUser.email}</div>
        </div>
        {/* Edit button is handled outside this component */}
      </div>
      <div className="v2-profile-fields-grid">
        <div className="v2-profile-field">
          <label>First Name</label>
          <input name="firstname" value={tempUser.firstname || ""} onChange={handleChange} disabled={!editMode} autoComplete="given-name" />
        </div>
        <div className="v2-profile-field">
          <label>Last Name</label>
          <input name="lastname" value={tempUser.lastname || ""} onChange={handleChange} disabled={!editMode} autoComplete="family-name" />
        </div>
        <div className="v2-profile-field">
          <label>Username</label>
          <input name="username" value={tempUser.username || ""} onChange={handleChange} disabled={!editMode} autoComplete="username" />
        </div>
        <div className="v2-profile-field">
          <label>Location</label>
          <input name="location" value={tempUser.location || ""} onChange={handleChange} disabled={!editMode} autoComplete="address-level2" />
        </div>
        <div className="v2-profile-field">
          <label>WhatsApp</label>
          <input name="whatsapp" value={tempUser.whatsapp || ""} onChange={handleChange} disabled={!editMode} autoComplete="tel" />
        </div>
        <div className="v2-profile-field">
          <label>Telegram</label>
          <input name="telegram" value={tempUser.telegram || ""} onChange={handleChange} disabled={!editMode} />
        </div>
      </div>
      <div className="v2-profile-bio-block">
        <label>Bio</label>
        <textarea name="bio" value={tempUser.bio || ""} onChange={handleChange} disabled={!editMode} rows={3} />
      </div>
    </div>
  );
}
