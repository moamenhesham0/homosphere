import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  adminApi,
  getAuthToken,
  getCurrentUserId,
  getFullName,
  usersListingApi,
} from '../../services';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';

const PAGE_SIZE = 10;

function roleBadgeClass(role) {
  const normalized = (role || '').toUpperCase();
  if (normalized === 'ADMIN') {
    return 'bg-primary-container/20 text-on-primary-container';
  }
  if (normalized === 'BROKER' || normalized === 'SELLER') {
    return 'bg-secondary-container text-on-secondary-container';
  }

  return 'bg-surface-container-highest text-on-surface-variant';
}

function statusDotClass(status) {
  const normalized = (status || '').toUpperCase();
  if (normalized === 'ACTIVE') {
    return 'bg-primary';
  }
  if (normalized === 'SUSPENDED' || normalized === 'BANNED') {
    return 'bg-error';
  }
  return 'bg-tertiary-container';
}

function UserManagement() {
  const navigate = useNavigate();
  const currentUserId = getCurrentUserId();
  const [usersPage, setUsersPage] = useState({
    content: [],
    number: 0,
    totalPages: 1,
    totalElements: 0,
  });
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [adminCount, setAdminCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedSearchQuery, setAppliedSearchQuery] = useState('');
  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState('');
  const [deleteTargetUser, setDeleteTargetUser] = useState(null);
  const [addAdminError, setAddAdminError] = useState('');
  const [addAdminForm, setAddAdminForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  const loadUsers = useCallback(
    async (targetPage = 0, queryOverride = appliedSearchQuery) => {
      const token = getAuthToken();
      if (!token) {
        setErrorMessage('Admin token is required to access user management.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage('');

      try {
        let payload;
        const query = queryOverride.trim();

        if (query) {
          payload = await usersListingApi.searchUsers(
            query,
            { page: targetPage, size: PAGE_SIZE },
            token,
          );
        } else if (roleFilter !== 'ALL') {
          payload = await usersListingApi.getUsersByRole(
            roleFilter,
            { page: targetPage, size: PAGE_SIZE },
            token,
          );
        } else {
          payload = await usersListingApi.getAllUsers(
            { page: targetPage, size: PAGE_SIZE },
            token,
          );
        }

        let adminsPayload = [];
        try {
          adminsPayload = await adminApi.getAllAdmins(token);
        } catch {
          adminsPayload = [];
        }

        setUsersPage({
          content: payload?.content || [],
          number: payload?.number || 0,
          totalPages: payload?.totalPages || 1,
          totalElements: payload?.totalElements || 0,
        });
        setAdminCount(Array.isArray(adminsPayload) ? adminsPayload.length : 0);
      } catch (error) {
        setErrorMessage(error.message || 'Failed to load users.');
      } finally {
        setIsLoading(false);
      }
    },
    [appliedSearchQuery, roleFilter],
  );

  useEffect(() => {
    loadUsers(0);
  }, [loadUsers]);

  const stats = useMemo(() => {
    const users = usersPage.content || [];
    return {
      totalUsers: usersPage.totalElements || users.length,
      admins: adminCount || users.filter((user) => (user.role || '').toUpperCase() === 'ADMIN').length,
      activeAgents: users.filter((user) =>
        ['BROKER', 'SELLER'].includes((user.role || '').toUpperCase()),
      ).length,
    };
  }, [adminCount, usersPage]);

  const openAddAdminModal = () => {
    setAddAdminError('');
    setAddAdminForm({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    });
    setIsAddAdminModalOpen(true);
  };

  const closeAddAdminModal = () => {
    if (isAddingAdmin) {
      return;
    }
    setIsAddAdminModalOpen(false);
  };

  const handleAddAdminSubmit = async (event) => {
    event.preventDefault();

    const token = getAuthToken();
    if (!token) {
      setAddAdminError('Admin token is required to create a new admin.');
      return;
    }

    const payload = {
      email: addAdminForm.email.trim(),
      password: addAdminForm.password,
      firstName: addAdminForm.firstName.trim(),
      lastName: addAdminForm.lastName.trim(),
      role: 'ADMIN',
    };

    if (!payload.email) {
      setAddAdminError('Email is required.');
      return;
    }

    if (!payload.password) {
      setAddAdminError('Password is required.');
      return;
    }

    setIsAddingAdmin(true);
    setAddAdminError('');

    try {
      await adminApi.addAdmin(payload, token);
      setIsAddAdminModalOpen(false);
      setAddAdminForm({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
      });
      await loadUsers(usersPage.number || 0);
    } catch (error) {
      setAddAdminError(error.message || 'Failed to create admin.');
    } finally {
      setIsAddingAdmin(false);
    }
  };

  const getUserDisplayName = (user) => (
    getFullName(user?.firstName, user?.lastName, user?.userName || 'this user')
  );

  const openDeleteUserModal = (user) => {
    if (!user?.id) {
      setErrorMessage('User id is required to delete this account.');
      return;
    }

    if (user.id === currentUserId) {
      setErrorMessage('You cannot delete your own account from User Management.');
      return;
    }

    setDeleteTargetUser(user);
  };

  const closeDeleteUserModal = () => {
    if (deletingUserId) {
      return;
    }
    setDeleteTargetUser(null);
  };

  const handleDeleteUserAccount = async () => {
    const user = deleteTargetUser;
    const token = getAuthToken();
    if (!token) {
      setErrorMessage('Admin token is required to delete user accounts.');
      return;
    }

    if (!user?.id) {
      setErrorMessage('User id is required to delete this account.');
      return;
    }

    if (user.id === currentUserId) {
      setErrorMessage('You cannot delete your own account from User Management.');
      return;
    }

    const targetRole = (user.role || '').toUpperCase();
    setDeletingUserId(user.id);
    setErrorMessage('');

    try {
      if (targetRole === 'ADMIN') {
        await adminApi.removeAdmin(user.id, token);
      } else {
        await adminApi.removeUserAccount(user.id, token);
      }
      setDeleteTargetUser(null);
      const shouldLoadPreviousPage = usersPage.content.length === 1 && usersPage.number > 0;
      const targetPage = shouldLoadPreviousPage ? usersPage.number - 1 : usersPage.number;
      await loadUsers(targetPage);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to delete account.');
    } finally {
      setDeletingUserId('');
    }
  };

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen flex">
      <AdminSidebar />

      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <AdminHeader
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          onSearch={() => {
            const nextQuery = searchQuery.trim();
            setAppliedSearchQuery(nextQuery);
            loadUsers(0, nextQuery);
          }}
        />

        <main className="flex-1 p-8 bg-surface">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2 font-headline">User Directory</h2>
              <p className="text-on-surface-variant text-lg max-w-xl">Manage platform access and account roles.</p>
            </div>
          </div>

          {errorMessage && (
            <p className="mb-6 rounded-lg bg-error-container px-4 py-3 text-sm text-error">
              {errorMessage}
            </p>
          )}

          <div className="grid grid-cols-4 gap-6 mb-10">
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/15 flex flex-col justify-between">
              <span className="material-symbols-outlined text-primary mb-4">groups</span>
              <div>
                <p className="text-sm text-on-surface-variant font-medium">Total Users</p>
                <p className="text-3xl font-black text-on-surface">{stats.totalUsers}</p>
              </div>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/15 flex flex-col justify-between">
              <span className="material-symbols-outlined text-primary-container mb-4">verified_user</span>
              <div>
                <p className="text-sm text-on-surface-variant font-medium">Admins</p>
                <p className="text-3xl font-black text-on-surface">{stats.admins}</p>
              </div>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/15 flex flex-col justify-between">
              <span className="material-symbols-outlined text-tertiary mb-4">apartment</span>
              <div>
                <p className="text-sm text-on-surface-variant font-medium">Active Agents</p>
                <p className="text-3xl font-black text-on-surface">{stats.activeAgents}</p>
              </div>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/15 flex flex-col justify-between">
              <span className="material-symbols-outlined text-primary mb-4">admin_panel_settings</span>
              <div className="space-y-3">
                <p className="text-sm text-on-surface-variant font-medium">Add New Admin</p>
                <button
                  className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary hover:opacity-90 transition-opacity"
                  type="button"
                  onClick={openAddAdminModal}
                >
                  Add Admin
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            {['ALL', 'ADMIN', 'BROKER', 'SELLER', 'BUYER'].map((role) => (
              <button
                key={role}
                className={`px-5 py-2 rounded-full text-sm font-semibold ${roleFilter === role
                    ? 'bg-primary text-on-primary'
                    : 'bg-secondary-fixed text-on-secondary-fixed-variant'
                  }`}
                type="button"
                onClick={() => {
                  setRoleFilter(role);
                }}
              >
                {role === 'ALL' ? 'All Users' : role}
              </button>
            ))}
          </div>

          <div className="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/15">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/10 text-on-surface-variant uppercase text-[10px] tracking-widest font-bold">
                  <th className="px-6 py-4">User Details</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {isLoading ? (
                  <tr>
                    <td className="px-6 py-6 text-on-surface-variant" colSpan={4}>
                      Loading users...
                    </td>
                  </tr>
                ) : usersPage.content.length === 0 ? (
                  <tr>
                    <td className="px-6 py-6 text-on-surface-variant" colSpan={4}>
                      No users found for the selected filter.
                    </td>
                  </tr>
                ) : (
                  usersPage.content.map((user) => (
                    <tr key={user.id} className="group hover:bg-surface-container-low/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-secondary-container flex items-center justify-center">
                            {user.photo ? (
                              <img
                                alt="User Profile"
                                className="w-full h-full object-cover"
                                src={user.photo}
                              />
                            ) : (
                              <span className="material-symbols-outlined text-xl text-on-secondary-container">person</span>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-on-surface">
                              {getFullName(user.firstName, user.lastName, user.userName || 'Unnamed')}
                            </p>
                            <p className="text-xs text-on-surface-variant">{user.email || 'No email'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${roleBadgeClass(user.role)}`}>
                          {user.role || 'USER'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {(user.role || '').toUpperCase() !== 'ADMIN' ? (
                            <>
                              <button
                                className="p-2 hover:bg-surface-container-high rounded-lg text-on-surface-variant transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                                type="button"
                                title="View User"
                                disabled={!user.id || deletingUserId === user.id}
                                onClick={() =>
                                  navigate(`/admin/user-management/${encodeURIComponent(user.id)}/profile`, {
                                    state: {
                                      userSummary: user,
                                    },
                                  })
                                }
                              >
                                <span className="material-symbols-outlined text-lg">visibility</span>
                              </button>
                            </>
                          ) : null}
                          <button
                            className="inline-flex items-center gap-1.5 rounded-lg bg-red-500 px-1 py-1 text-xs font-semibold text-white hover:bg-red-700 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                            type="button"
                            title="Delete Account"
                            disabled={!user.id || deletingUserId === user.id || user.id === currentUserId}
                            onClick={() => openDeleteUserModal(user)}
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="px-6 py-4 bg-surface-container-low flex items-center justify-between border-t border-outline-variant/10">
              <p className="text-sm text-on-surface-variant">
                Showing page <span className="font-bold">{usersPage.number + 1}</span> of{' '}
                <span className="font-bold">{usersPage.totalPages}</span>
              </p>
              <div className="flex gap-2">
                <button
                  className="p-2 hover:bg-surface-container-lowest rounded-lg transition-colors disabled:opacity-40"
                  type="button"
                  disabled={usersPage.number <= 0}
                  onClick={() => loadUsers(usersPage.number - 1)}
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button
                  className="p-2 hover:bg-surface-container-lowest rounded-lg transition-colors disabled:opacity-40"
                  type="button"
                  disabled={usersPage.number >= usersPage.totalPages - 1}
                  onClick={() => loadUsers(usersPage.number + 1)}
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {isAddAdminModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-2xl font-headline font-bold text-on-surface">Create New Admin</h3>
              <button
                className="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-40"
                type="button"
                onClick={closeAddAdminModal}
                disabled={isAddingAdmin}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {addAdminError && (
              <p className="mb-4 rounded-lg bg-error-container px-4 py-3 text-sm text-error">
                {addAdminError}
              </p>
            )}

            <form className="space-y-4" onSubmit={handleAddAdminSubmit}>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="admin-email">
                  Email *
                </label>
                <input
                  id="admin-email"
                  className="w-full rounded-lg border border-outline-variant/30 bg-surface px-3 py-2 text-sm text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  type="email"
                  value={addAdminForm.email}
                  onChange={(event) =>
                    setAddAdminForm((current) => ({ ...current, email: event.target.value }))
                  }
                  placeholder="admin@example.com"
                  disabled={isAddingAdmin}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="admin-password">
                  Password *
                </label>
                <input
                  id="admin-password"
                  className="w-full rounded-lg border border-outline-variant/30 bg-surface px-3 py-2 text-sm text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  type="password"
                  value={addAdminForm.password}
                  onChange={(event) =>
                    setAddAdminForm((current) => ({ ...current, password: event.target.value }))
                  }
                  placeholder="Enter a secure password"
                  disabled={isAddingAdmin}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="admin-first-name">
                    First Name
                  </label>
                  <input
                    id="admin-first-name"
                    className="w-full rounded-lg border border-outline-variant/30 bg-surface px-3 py-2 text-sm text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    type="text"
                    value={addAdminForm.firstName}
                    onChange={(event) =>
                      setAddAdminForm((current) => ({ ...current, firstName: event.target.value }))
                    }
                    disabled={isAddingAdmin}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="admin-last-name">
                    Last Name
                  </label>
                  <input
                    id="admin-last-name"
                    className="w-full rounded-lg border border-outline-variant/30 bg-surface px-3 py-2 text-sm text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    type="text"
                    value={addAdminForm.lastName}
                    onChange={(event) =>
                      setAddAdminForm((current) => ({ ...current, lastName: event.target.value }))
                    }
                    disabled={isAddingAdmin}
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  className="rounded-lg border border-outline-variant/30 px-4 py-2 text-sm font-semibold text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-40"
                  type="button"
                  onClick={closeAddAdminModal}
                  disabled={isAddingAdmin}
                >
                  Cancel
                </button>
                <button
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary hover:opacity-90 transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
                  type="submit"
                  disabled={isAddingAdmin}
                >
                  {isAddingAdmin ? 'Creating...' : 'Create Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTargetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-headline font-bold text-on-surface">Delete Account</h3>
              <button
                className="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-40"
                type="button"
                onClick={closeDeleteUserModal}
                disabled={Boolean(deletingUserId)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <p className="text-sm text-on-surface-variant">
              Delete <span className="font-bold text-on-surface">{getUserDisplayName(deleteTargetUser)}</span> permanently? This action cannot be undone.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                className="rounded-lg border border-outline-variant/30 px-4 py-2 text-sm font-semibold text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-40"
                type="button"
                onClick={closeDeleteUserModal}
                disabled={Boolean(deletingUserId)}
              >
                Cancel
              </button>
              <button
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                type="button"
                onClick={handleDeleteUserAccount}
                disabled={Boolean(deletingUserId)}
              >
                {deletingUserId ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { UserManagement };
export default UserManagement;
