import { Link, useLocation } from 'react-router-dom';

export default function AdminSidebar() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <aside className="fixed inset-y-0 left-0 h-screen w-64 border-r border-gray-100 bg-[#faf9fe] flex flex-col py-6 px-4 z-50">
      <div className="mb-10 px-4">
        <span className="text-xl font-bold text-[#476738] font-headline">Admin Portal</span>
        <p className="text-xs text-gray-400 font-medium tracking-wide">Management Console</p>
      </div>

      <nav className="flex-1 space-y-2">
        <Link 
          to="/admin/user-management" 
          className={`flex items-center gap-3 px-4 py-3 transition-all ${path === '/admin/user-management' ? 'text-[#476738] font-bold border-r-4 border-[#476738] bg-[#f4f3f8]' : 'text-gray-500 hover:text-[#476738] hover:bg-[#f4f3f8] font-medium'}`}
        >
          <span className="material-symbols-outlined" style={path === '/admin/user-management' ? { fontVariationSettings: "'FILL' 1" } : {}}>group</span>
          <span className="font-headline text-sm">User Management</span>
        </Link>
        <Link 
          to="/admin/property-approvals" 
          className={`flex items-center gap-3 px-4 py-3 transition-all ${path === '/admin/property-approvals' ? 'text-[#476738] font-bold border-r-4 border-[#476738] bg-[#f4f3f8]' : 'text-gray-500 hover:text-[#476738] hover:bg-[#f4f3f8] font-medium'}`}
        >
          <span className="material-symbols-outlined" style={path === '/admin/property-approvals' ? { fontVariationSettings: "'FILL' 1" } : {}}>fact_check</span>
          <span className="font-headline text-sm">Property Approvals</span>
        </Link>
      </nav>
    </aside>
  );
}
