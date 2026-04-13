export default function ProfileCard({
  profile,
  displayName,
  randomProfilePhoto,
  isEditing,
  editData,
  setEditData,
  fullNameDraft,
  setFullNameDraft,
  onToggleEdit,
  onCancelEdit,
  onSaveProfile,
  isSaving,
  activePanel,
  setActivePanel,
  homesPanelLabel = 'Saved Homes',
}) {
  return (
    <aside className="w-full lg:w-72 flex-shrink-0">
      <div className="sticky top-28 space-y-8">
        <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/10 shadow-sm transition-all">
          <div className="flex flex-col items-center text-center">
            <div className="relative group w-24 h-24 rounded-full overflow-hidden mb-4 bg-secondary-container">
              <img
                className="w-full h-full object-cover"
                alt="Profile"
                src={profile?.photo || randomProfilePhoto}
              />
              {isEditing && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity cursor-pointer">
                  <span className="material-symbols-outlined text-white">photo_camera</span>
                </div>
              )}
            </div>

            {isEditing ? (
              <div className="w-full space-y-4 text-center">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1 px-1">
                    Full Name
                  </label>
                  <input
                    className="w-full px-3 py-2 rounded-lg border border-outline-variant/30 bg-surface text-on-surface font-headline font-bold outline-none transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    type="text"
                    value={fullNameDraft}
                    onChange={(event) => setFullNameDraft(event.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1 px-1">
                    Email Address
                  </label>
                  <input
                    className="w-full px-3 py-2 bg-surface-container-low rounded-lg border border-outline-variant/30 text-on-surface text-sm outline-none cursor-not-allowed"
                    type="email"
                    value={profile?.email || ''}
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1 px-1">
                    Location
                  </label>
                  <input
                    className="w-full px-3 py-2 rounded-lg border border-outline-variant/30 bg-surface text-on-surface text-sm outline-none transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    type="text"
                    value={editData.location}
                    onChange={(event) =>
                      setEditData((current) => ({ ...current, location: event.target.value }))
                    }
                  />
                </div>
              </div>
            ) : (
              <div className="w-full text-center">
                <h2 className="font-manrope font-extrabold text-xl text-on-surface">{displayName}</h2>
                <p className="text-on-surface-variant text-sm mt-1">{profile?.email || ''}</p>
                <p className="text-on-surface-variant text-sm">{profile?.location || 'Location not set'}</p>
              </div>
            )}

            {isEditing ? (
              <div className="mt-8 flex flex-col gap-3 w-full">
                <button
                  className="w-full py-2.5 bg-primary text-on-primary font-bold rounded-lg hover:shadow-md transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                  type="button"
                  onClick={onSaveProfile}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  className="w-full py-2.5 border border-outline-variant/30 text-on-surface-variant font-semibold rounded-lg hover:bg-surface-container-low transition-colors"
                  type="button"
                  onClick={onCancelEdit}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="mt-6 w-full">
                <button
                  className="w-full py-2 border border-outline-variant/15 text-primary font-semibold rounded-lg hover:bg-surface-container-low transition-colors"
                  type="button"
                  onClick={onToggleEdit}
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>

        <nav className="space-y-2">
          <button
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activePanel === 'saved-homes'
                ? 'bg-secondary-container text-on-secondary-container font-semibold'
                : 'text-on-surface-variant hover:bg-surface-container-low'
            }`}
            type="button"
            onClick={() => setActivePanel('saved-homes')}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
            <span>{homesPanelLabel}</span>
          </button>
          <button
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activePanel === 'account-settings'
                ? 'bg-secondary-container text-on-secondary-container font-semibold'
                : 'text-on-surface-variant hover:bg-surface-container-low'
            }`}
            type="button"
            onClick={() => setActivePanel('account-settings')}
          >
            <span className="material-symbols-outlined">settings</span>
            <span>Account Settings</span>
          </button>
        </nav>
      </div>
    </aside>
  );
}
