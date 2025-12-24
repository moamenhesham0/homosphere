export default function ProfileInfo({ tempUser, editMode, handleChange, handlePhotoChange, handleDeletePhoto, publicMode }) {
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
  if (publicMode) {
    return (
      <div className="profile-info-card public-profile-info v2-profile-info">
        <div className="v2-profile-avatar-block">
          {tempUser.photo ? (
            <img className="v2-profile-avatar profile-avatar-large" src={`https://pub-5fe480d20f5b4a3e9d119df2e1376fbc.r2.dev/${tempUser.photo}`} alt={fullName} />
          ) : (
            <div className="v2-profile-avatar v2-profile-avatar-placeholder profile-avatar-large">{getInitial()}</div>
          )}
        </div>
        <div className="profile-info-details">
          <div className="profile-info-name">{fullName || tempUser.username || "User"}</div>
          {/* Optionally add a verified badge here */}
          <div style={{display:'flex',alignItems:'center',marginBottom:'10px'}}>
            {/* Example: <span className="verified-badge">Verified Business</span> */}
          </div>
          {tempUser.bio && <div className="profile-info-bio">{tempUser.bio}</div>}
          {tempUser.location && <div className="profile-info-row"><b>Location:</b> <span style={{fontWeight:400}}>{tempUser.location}</span></div>}
          {tempUser.email && <div className="profile-info-row"><b>Email:</b> <span style={{fontWeight:400}}>{tempUser.email}</span></div>}
          {tempUser.whatsapp && <div className="profile-info-row"><b>WhatsApp:</b> <span style={{fontWeight:400}}>{tempUser.whatsapp}</span></div>}
          {tempUser.telegram && <div className="profile-info-row"><b>Telegram:</b> <span style={{fontWeight:400}}>{tempUser.telegram}</span></div>}
        </div>
      </div>
    );
  }
  return (
    <div className={
      publicMode
        ? "profile-info-card public-profile-info v2-profile-info"
        : "profile-info-card modern-profile-info v2-profile-info"
    }>
      <div className="v2-profile-header-row">
        <div className="v2-profile-avatar-block" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {tempUser.photo ? (
            <img className="v2-profile-avatar" src={`https://pub-5fe480d20f5b4a3e9d119df2e1376fbc.r2.dev/${tempUser.photo}`} alt={fullName} />
          ) : (
            <div className="v2-profile-avatar v2-profile-avatar-placeholder">{getInitial()}</div>
          )}
          {editMode && (
            <div className="profile-photo-controls" style={{ marginTop: 12 }}>
              <label className="upload-btn">
                Upload Photo
                <input type="file" accept="image/*" onChange={handlePhotoChange} />
              </label>
              <button className="delete-photo-btn" onClick={handleDeletePhoto}>
                Delete Photo
              </button>
            </div>
          )}
        </div>
        <div className="v2-profile-user-block">
          <div className="v2-profile-name">{fullName || tempUser.username || "User"}</div>
          <div className="v2-profile-email">{tempUser.email}</div>
        </div>
        {/* Edit button is handled outside this component */}
      </div>
      <div className="v2-profile-fields-grid">
        {publicMode ? (
          <>
            <div className="v2-profile-field"><label>First Name</label><div>{tempUser.firstname}</div></div>
            <div className="v2-profile-field"><label>Last Name</label><div>{tempUser.lastname}</div></div>
            <div className="v2-profile-field"><label>Username</label><div>{tempUser.username}</div></div>
            <div className="v2-profile-field"><label>Location</label><div>{tempUser.location}</div></div>
            <div className="v2-profile-field"><label>WhatsApp</label><div>{tempUser.whatsapp}</div></div>
            <div className="v2-profile-field"><label>Telegram</label><div>{tempUser.telegram}</div></div>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}
