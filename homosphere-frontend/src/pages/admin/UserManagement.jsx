import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  adminApi,
  getAuthToken,
  getFullName,
  usersListingApi,
} from '../../services';

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

export default function UserManagement() {
  const [usersPage, setUsersPage] = useState({
    content: [],
    number: 0,
    totalPages: 1,
    totalElements: 0,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [adminCount, setAdminCount] = useState(0);

  const loadUsers = useCallback(
    async (targetPage = 0) => {
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
        const query = searchQuery.trim();

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
    [roleFilter, searchQuery],
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

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen flex">
      <aside className="fixed top-0 left-0 h-screen w-64 border-r border-gray-100 bg-[#faf9fe] flex flex-col py-6 px-4 z-50">
        <div className="mb-10 px-2">
          <h1 className="text-xl font-bold text-[#476738] font-headline">Admin Portal</h1>
          <p className="text-xs text-gray-500 font-medium">Management Console</p>
        </div>
        <nav className="flex-1 space-y-1">
          <Link to="/admin/property-approvals" className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-500 hover:text-[#476738] hover:bg-[#f4f3f8] transition-colors font-headline font-medium text-sm">
            <span className="material-symbols-outlined">fact_check</span>
            <span>Property Approvals</span>
          </Link>
          <Link to="/admin/user-management" className="flex items-center gap-3 px-3 py-3 rounded-lg text-[#476738] font-bold border-r-4 border-[#476738] bg-[#f4f3f8] font-headline text-sm">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>group</span>
            <span>User Management</span>
          </Link>
        </nav>
      </aside>

      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <header className="sticky top-0 h-16 bg-white/60 backdrop-blur-md flex items-center justify-between px-8 w-full border-b border-gray-100 z-40 font-headline text-base">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">search</span>
              <input
                className="w-full pl-10 pr-4 py-2 bg-surface-container-high rounded-full border-none focus:ring-2 focus:ring-[#476738]/20 focus:bg-surface-container-lowest transition-all text-sm font-body"
                placeholder="Search directory..."
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    loadUsers(0);
                  }
                }}
              />
            </div>
            <button
              className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-on-primary"
              type="button"
              onClick={() => loadUsers(0)}
            >
              Search
            </button>
          </div>
        </header>

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
            <div className="bg-primary text-on-primary p-6 rounded-xl flex flex-col justify-between overflow-hidden relative">
              <div className="z-10">
                <p className="text-sm opacity-80 font-medium">Current Page</p>
                <p className="text-3xl font-black">{usersPage.number + 1}</p>
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
                  <th className="px-6 py-4">Status</th>
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
                          <img
                            alt="User Profile"
                            className="w-10 h-10 rounded-full object-cover"
                            src={user.photo || 'https://via.placeholder.com/80x80?text=User'}
                          />
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
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${statusDotClass(user.status)}`} />
                          <span className="text-sm font-medium">{user.status || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 hover:bg-surface-container-high rounded-lg text-on-surface-variant transition-colors" type="button" title="View User">
                            <span className="material-symbols-outlined text-lg">visibility</span>
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
    </div>
  );
}
