import { Link } from 'react-router-dom';

export default function UserManagement() {
  return (
    <div className="bg-surface text-on-surface font-body min-h-screen flex">
      {/* SideNavBar */}
      <aside className="fixed top-0 left-0 h-screen w-64 border-r border-gray-100 dark:border-gray-800 bg-[#faf9fe] dark:bg-gray-950 flex flex-col py-6 px-4 z-50">
        <div className="mb-10 px-2">
          <h1 className="text-xl font-bold text-[#476738] dark:text-[#99bc85] font-headline">Admin Portal</h1>
          <p className="text-xs text-gray-500 font-medium">Management Console</p>
        </div>
        <nav className="flex-1 space-y-1">
          {/* Inactive */}
          <Link to="/admin/property-approvals" className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-500 dark:text-gray-400 hover:text-[#476738] dark:hover:text-[#99bc85] hover:bg-[#f4f3f8] dark:hover:bg-gray-800 transition-colors font-headline font-medium text-sm">
            <span className="material-symbols-outlined">fact_check</span>
            <span>Property Approvals</span>
          </Link>
          {/* Active: User Management */}
          <Link to="/admin/user-management" className="flex items-center gap-3 px-3 py-3 rounded-lg text-[#476738] dark:text-[#99bc85] font-bold border-r-4 border-[#476738] dark:border-[#99bc85] bg-[#f4f3f8] dark:bg-gray-800/50 font-headline text-sm">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>group</span>
            <span>User Management</span>
          </Link>
          {/* Inactive */}
          <a className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-500 dark:text-gray-400 hover:text-[#476738] dark:hover:text-[#99bc85] hover:bg-[#f4f3f8] dark:hover:bg-gray-800 transition-colors font-headline font-medium text-sm" href="#">
            <span className="material-symbols-outlined">badge</span>
            <span>Admin List</span>
          </a>
          {/* Inactive */}
          <a className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-500 dark:text-gray-400 hover:text-[#476738] dark:hover:text-[#99bc85] hover:bg-[#f4f3f8] dark:hover:bg-gray-800 transition-colors font-headline font-medium text-sm" href="#">
            <span className="material-symbols-outlined">settings</span>
            <span>System Settings</span>
          </a>
        </nav>
        <div className="mt-auto p-2 flex items-center gap-3 bg-surface-container-low rounded-xl">
          <img alt="Admin User Avatar" className="w-10 h-10 rounded-full border-2 border-primary-container" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQGgO4SLscUzAK7KXWkedS5CbtxW-ZoOGiYi__HmIpRcScIDl5LmTBJ61DHhEfsT_p1JVpCOQsE2On_lsn1pHyH8oNJiI5i_pCTHeVIXL8GRgoh7QmKgpkxwT-tjBsAMfNvYCxXq0CKi9LyiYU6bZZcuPJYgMIb2n6wtzLDFFVtt7Am7KJ1kDkTznAtAgCa6PYaxY7Bxc2Nwr6VzNOpIrJya_866fUBzjv6Xv2Zeqy5sVx6SVv6zFhtyMN3Gom7i2k2yoFyc6fY0EO" />
          <div className="overflow-hidden">
            <p className="text-sm font-bold truncate">Alex Sterling</p>
            <p className="text-xs text-gray-500 truncate">Super Admin</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* TopAppBar */}
        <header className="sticky top-0 h-16 bg-white/60 dark:bg-gray-950/60 backdrop-blur-md flex items-center justify-between px-8 w-full border-b border-gray-100 dark:border-gray-800 z-40 font-headline text-base">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">search</span>
              <input className="w-full pl-10 pr-4 py-2 bg-surface-container-high rounded-full border-none focus:ring-2 focus:ring-[#476738]/20 focus:bg-surface-container-lowest transition-all text-sm font-body" placeholder="Search directory..." type="text" />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <button className="relative text-gray-400 hover:text-[#476738] transition-opacity">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
              </button>
              <button className="text-gray-400 hover:text-[#476738] transition-opacity">
                <span className="material-symbols-outlined">help</span>
              </button>
            </div>
            <div className="h-8 w-[1px] bg-gray-200"></div>
            <span className="text-lg font-black text-[#476738] dark:text-[#99bc85]">Sage & Stone Admin</span>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-surface">
          {/* Header Section */}
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2 font-headline">User Directory</h2>
              <p className="text-on-surface-variant text-lg max-w-xl">Manage platform access, audit account status, and assign administrative privileges across the ecosystem.</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-6 py-3 bg-secondary-container text-on-secondary-container rounded-full font-semibold hover:bg-opacity-80 transition-all">
                <span className="material-symbols-outlined">download</span>
                <span>Export CSV</span>
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-full font-semibold shadow-lg hover:shadow-primary/20 transition-all">
                <span className="material-symbols-outlined">person_add</span>
                <span>Add New User</span>
              </button>
            </div>
          </div>

          {/* Stats Bento Grid */}
          <div className="grid grid-cols-4 gap-6 mb-10">
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/15 flex flex-col justify-between">
              <span className="material-symbols-outlined text-primary mb-4">groups</span>
              <div>
                <p className="text-sm text-on-surface-variant font-medium">Total Users</p>
                <p className="text-3xl font-black text-on-surface">12,482</p>
              </div>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/15 flex flex-col justify-between">
              <span className="material-symbols-outlined text-primary-container mb-4">verified_user</span>
              <div>
                <p className="text-sm text-on-surface-variant font-medium">Verified Admins</p>
                <p className="text-3xl font-black text-on-surface">42</p>
              </div>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/15 flex flex-col justify-between">
              <span className="material-symbols-outlined text-tertiary mb-4">apartment</span>
              <div>
                <p className="text-sm text-on-surface-variant font-medium">Active Agents</p>
                <p className="text-3xl font-black text-on-surface">156</p>
              </div>
            </div>
            <div className="bg-primary text-on-primary p-6 rounded-xl flex flex-col justify-between overflow-hidden relative">
              <div className="z-10">
                <p className="text-sm opacity-80 font-medium">Monthly Growth</p>
                <p className="text-3xl font-black">+14.2%</p>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <span className="material-symbols-outlined text-[120px]">trending_up</span>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <button className="px-5 py-2 bg-primary text-on-primary rounded-full text-sm font-semibold">All Users</button>
            <button className="px-5 py-2 bg-secondary-fixed text-on-secondary-fixed-variant rounded-full text-sm font-medium hover:bg-secondary-container transition-colors">Admins</button>
            <button className="px-5 py-2 bg-secondary-fixed text-on-secondary-fixed-variant rounded-full text-sm font-medium hover:bg-secondary-container transition-colors">Agents</button>
            <button className="px-5 py-2 bg-secondary-fixed text-on-secondary-fixed-variant rounded-full text-sm font-medium hover:bg-secondary-container transition-colors">Regular Users</button>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm text-on-surface-variant font-medium">Filter by Status:</span>
              <select className="bg-surface-container-high border-none rounded-full text-sm px-4 py-2 focus:ring-1 focus:ring-primary outline-none">
                <option>Active Only</option>
                <option>Pending Approval</option>
                <option>Suspended</option>
              </select>
            </div>
          </div>

          {/* Directory Table */}
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
                {/* User Row 1 */}
                <tr className="group hover:bg-surface-container-low/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img alt="User Profile" className="w-10 h-10 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaCil3NP0TiVspgINfjGaVnCacgE9YiBhv1CeqX70Opz6m31Xg5OqNsK4gWIlsqUwv3w_9l8xE-n5kahxcSNtw8opd2K1I-9A1xnSke1LHoCiQ-xspZQ3-N8KDwTwJpAtjtywfOWOucXS_TErufIUnasczxcgqEN6u82JttiEqPNEXD5b5cP4guQ5sPTNwChTgnOHYeeHI83BSj4AQFv_RnyHmMr1Jwx4WUC4FIQM2SMWErkl7sGQA78BXHbUA6hgq_R1YWkhumcsG" />
                      <div>
                        <p className="font-bold text-on-surface">Julian Thorne</p>
                        <p className="text-xs text-on-surface-variant">julian.thorne@horizonrealty.com</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 bg-primary-container/20 text-on-primary-container rounded-full text-xs font-bold uppercase tracking-wider">Admin</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary"></span>
                      <span className="text-sm font-medium">Active</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-surface-container-high rounded-lg text-on-surface-variant transition-colors" title="Edit User">
                        <span className="material-symbols-outlined text-lg">edit_note</span>
                      </button>
                      <button className="p-2 hover:bg-surface-container-high rounded-lg text-on-surface-variant transition-colors" title="Change Role">
                        <span className="material-symbols-outlined text-lg">shield_person</span>
                      </button>
                      <button className="p-2 hover:bg-error-container/20 text-error rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" title="Delete User">
                        <span className="material-symbols-outlined text-lg">delete_sweep</span>
                      </button>
                    </div>
                  </td>
                </tr>
                {/* User Row 2 */}
                <tr className="group hover:bg-surface-container-low/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img alt="User Profile" className="w-10 h-10 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7-E71QN83WW12KjUDXP-sZzy0W4-Dlgie-smdtQBgI3Bm3Q0CkHqxRphccvUejd2FKdOWSiYPoEvZGznxeSu32OJ-4CQ8Sevi4YcpyByn6zpBH49btVo17bfyJcCdmSIZfDuoXHtvSx1jjNRO0udSCsK9RiD4EHFo5GAHqoqlMzXI4oiilx1QE_EfLkXv_6VySHWFXSwLCgdSZ4BXam3DqpU3Mv6seWgzlbW6sDHwUCksULiADPXUvjdG64GPqZ3mg7I5yQOvnYrq" />
                      <div>
                        <p className="font-bold text-on-surface">Elena Rodriguez</p>
                        <p className="text-xs text-on-surface-variant">e.rodriguez@agents.stone.com</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-xs font-bold uppercase tracking-wider">Agent</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary"></span>
                      <span className="text-sm font-medium">Active</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-surface-container-high rounded-lg text-on-surface-variant transition-colors">
                        <span className="material-symbols-outlined text-lg">edit_note</span>
                      </button>
                      <button className="p-2 hover:bg-surface-container-high rounded-lg text-on-surface-variant transition-colors">
                        <span className="material-symbols-outlined text-lg">shield_person</span>
                      </button>
                      <button className="p-2 hover:bg-error-container/20 text-error rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-lg">delete_sweep</span>
                      </button>
                    </div>
                  </td>
                </tr>
                {/* User Row 3 */}
                <tr className="group hover:bg-surface-container-low/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img alt="User Profile" className="w-10 h-10 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTXynm_YW2zTNl_q1bCGU-VCtWkcit0E7zDTrvyJRnFPPy4noQLwG_lov-9c7rTmpt18aOHnogfbM5RSqRGGvP8F-6hLKDw9zujiS08wEl6uP5NYFB4G8dzOYu2akTTh7HKRKrlwgYce2tzwoGr1r6TKYyf6gs7_ABX1Z9diOBX370pc-bodG7TohhdJceBh04B9QB5E09DVe511zUojXrtoae9CSwb-VfbeFHopirYKjhGQ3ErUyveS3P8Q-kDr-59hAWFvVbK8q6" />
                      <div>
                        <p className="font-bold text-on-surface">Marcus Chen</p>
                        <p className="text-xs text-on-surface-variant">mchen_92@gmail.com</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 bg-surface-container-highest text-on-surface-variant rounded-full text-xs font-bold uppercase tracking-wider">User</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-tertiary-container"></span>
                      <span className="text-sm font-medium">Pending</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-surface-container-high rounded-lg text-on-surface-variant transition-colors">
                        <span className="material-symbols-outlined text-lg">edit_note</span>
                      </button>
                      <button className="p-2 hover:bg-surface-container-high rounded-lg text-on-surface-variant transition-colors">
                        <span className="material-symbols-outlined text-lg">shield_person</span>
                      </button>
                      <button className="p-2 hover:bg-error-container/20 text-error rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-lg">delete_sweep</span>
                      </button>
                    </div>
                  </td>
                </tr>
                {/* User Row 4 */}
                <tr className="group hover:bg-surface-container-low/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img alt="User Profile" className="w-10 h-10 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDK6JObRP6FUl4y_W0A2NHo_ewscG-YWhcVjtjCxGbgR71YWdkQOLfvCGJ1oNFm2f4oeeVrd7IJyMxMf34lmfH-AnkM5w1O5pl76vQtY5Z-7cJqxGhDP9NgtvA8dfuG8Im09wYjAXYfz4LfeQoEuTqnweGsQfS_TFQuNGWzVWHxWQIC0edh1yPx3adjFzCo8EKjWszcFDKXC5QASFAITnHPa30TvuuPsRUt_jrbIYHqT2oe7PJvphGqV2zlGfeyuPYionqVWmkjd8A3" />
                      <div>
                        <p className="font-bold text-on-surface">Sarah Jenkins</p>
                        <p className="text-xs text-on-surface-variant">s.jenkins@vanguard-estate.com</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-xs font-bold uppercase tracking-wider">Agent</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-error"></span>
                      <span className="text-sm font-medium">Suspended</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-surface-container-high rounded-lg text-on-surface-variant transition-colors">
                        <span className="material-symbols-outlined text-lg">edit_note</span>
                      </button>
                      <button className="p-2 hover:bg-surface-container-high rounded-lg text-on-surface-variant transition-colors">
                        <span className="material-symbols-outlined text-lg">shield_person</span>
                      </button>
                      <button className="p-2 hover:bg-error-container/20 text-error rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-lg">delete_sweep</span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            {/* Pagination */}
            <div className="px-6 py-4 bg-surface-container-low flex items-center justify-between border-t border-outline-variant/10">
              <p className="text-sm text-on-surface-variant">Showing <span className="font-bold">1-10</span> of <span className="font-bold">12,482</span> users</p>
              <div className="flex gap-1">
                <button className="p-2 hover:bg-surface-container-lowest rounded-lg transition-colors">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button className="px-3 py-1 bg-primary text-on-primary rounded-lg text-sm font-bold">1</button>
                <button className="px-3 py-1 hover:bg-surface-container-lowest rounded-lg text-sm font-medium">2</button>
                <button className="px-3 py-1 hover:bg-surface-container-lowest rounded-lg text-sm font-medium">3</button>
                <span className="px-2">...</span>
                <button className="px-3 py-1 hover:bg-surface-container-lowest rounded-lg text-sm font-medium">1248</button>
                <button className="p-2 hover:bg-surface-container-lowest rounded-lg transition-colors">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Tips Sidebar / Drawer (Hidden initially or contextually visible) */}
          <div className="mt-12 p-8 bg-primary-container/10 rounded-2xl border border-primary-container/20 flex items-start gap-6">
            <div className="bg-primary-container p-3 rounded-xl">
              <span className="material-symbols-outlined text-on-primary-container">info</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-on-primary-container mb-1">Administrative Guidelines</h3>
              <p className="text-sm text-on-primary-container/80 max-w-2xl leading-relaxed">Ensure all new 'Agent' accounts are verified against their real estate license numbers within 24 hours of registration. Role upgrades to 'Admin' must be approved by the Head of Security. Suspended accounts will retain historical data for 90 days before permanent archival.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
