import { Link, useLocation } from 'react-router-dom';

export default function AdminSidebar() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <aside className="fixed inset-y-0 left-0 h-screen w-64 border-r border-gray-100 dark:border-gray-800 bg-[#faf9fe] dark:bg-gray-950 flex flex-col py-6 px-4 z-50">
      <div className="mb-10 px-4">
        <span className="text-xl font-bold text-[#476738] dark:text-[#99bc85] font-headline">Admin Portal</span>
        <p className="text-xs text-gray-400 font-medium tracking-wide">Management Console</p>
      </div>
      
      <button className="mb-8 w-full py-3 px-4 bg-primary text-on-primary rounded-xl font-semibold flex items-center justify-center gap-2 shadow-sm hover:opacity-90 transition-all font-body">
        <span className="material-symbols-outlined text-sm">add</span>
        New Property
      </button>

      <nav className="flex-1 space-y-2">
        <Link 
          to="/admin/review-request" 
          className={`flex items-center gap-3 px-4 py-3 transition-all ${path === '/admin/review-request' ? 'text-[#476738] dark:text-[#99bc85] font-bold border-r-4 border-[#476738] dark:border-[#99bc85] bg-[#f4f3f8] dark:bg-gray-800/50' : 'text-gray-500 dark:text-gray-400 hover:text-[#476738] dark:hover:text-[#99bc85] hover:bg-[#f4f3f8] dark:hover:bg-gray-800 font-medium'}`}
        >
          <span className="material-symbols-outlined" style={path === '/admin/review-request' ? { fontVariationSettings: "'FILL' 1" } : {}}>dashboard</span>
          <span className="font-headline text-sm">Review Queue</span>
        </Link>
        <Link 
          to="/admin/property-approvals" 
          className={`flex items-center gap-3 px-4 py-3 transition-all ${path === '/admin/property-approvals' ? 'text-[#476738] dark:text-[#99bc85] font-bold border-r-4 border-[#476738] dark:border-[#99bc85] bg-[#f4f3f8] dark:bg-gray-800/50' : 'text-gray-500 dark:text-gray-400 hover:text-[#476738] dark:hover:text-[#99bc85] hover:bg-[#f4f3f8] dark:hover:bg-gray-800 font-medium'}`}
        >
          <span className="material-symbols-outlined" style={path === '/admin/property-approvals' ? { fontVariationSettings: "'FILL' 1" } : {}}>fact_check</span>
          <span className="font-headline text-sm">Property Approvals</span>
        </Link>
        <Link 
          to="/admin/user-management" 
          className={`flex items-center gap-3 px-4 py-3 transition-all ${path === '/admin/user-management' ? 'text-[#476738] dark:text-[#99bc85] font-bold border-r-4 border-[#476738] dark:border-[#99bc85] bg-[#f4f3f8] dark:bg-gray-800/50' : 'text-gray-500 dark:text-gray-400 hover:text-[#476738] dark:hover:text-[#99bc85] hover:bg-[#f4f3f8] dark:hover:bg-gray-800 font-medium'}`}
        >
          <span className="material-symbols-outlined" style={path === '/admin/user-management' ? { fontVariationSettings: "'FILL' 1" } : {}}>group</span>
          <span className="font-headline text-sm">User Management</span>
        </Link>
        <a className="flex items-center gap-3 px-4 py-3 text-gray-500 dark:text-gray-400 hover:text-[#476738] dark:hover:text-[#99bc85] hover:bg-[#f4f3f8] dark:hover:bg-gray-800 transition-colors font-medium" href="#">
          <span className="material-symbols-outlined">badge</span>
          <span className="font-headline text-sm">Admin List</span>
        </a>
        <a className="flex items-center gap-3 px-4 py-3 text-gray-500 dark:text-gray-400 hover:text-[#476738] dark:hover:text-[#99bc85] hover:bg-[#f4f3f8] dark:hover:bg-gray-800 transition-colors font-medium" href="#">
          <span className="material-symbols-outlined">settings</span>
          <span className="font-headline text-sm">System Settings</span>
        </a>
      </nav>
      <div className="mt-auto px-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center overflow-hidden">
          <img alt="Admin User Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzYC0lUE3KE60Xr2M4zf1lvB87rvGscKLRbizxuZW_gLTIm4SATya9ccnhhmFTk0PxbB_3tsdUjUfWJWTVFc7BYyf1BDqQQNXGq23llcZIjfYP4thFvGQ45frX5e4T0d3HyEb1_jlAb2bpJ6I7IlzYKXs7DrsxmGFWpxIPhyXu9uUjLADEa7ZTaQSoRtzgtsFCqDPMi6M2JYLdeW0lIc9FCNffUlOvbDsjacvmmk3aRUeKabFpwC531fY-xmHwBhbkIauPapxKlTn2" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-on-surface">Alex Horizon</span>
          <span className="text-[10px] text-gray-400">Senior Admin</span>
        </div>
      </div>
    </aside>
  );
}
