import { Link } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import ReviewRequestCard from '../../components/admin/ReviewRequestCard';

export default function ReviewRequest() {
  return (
    <div className="text-on-surface antialiased bg-surface min-h-screen flex">
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <AdminHeader />

        {/* Main Content Canvas */}
        <main className="flex-1 p-10 bg-surface">
          {/* Header Section */}
          <div className="flex justify-between items-end mb-10">
            <div>
              <h3 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight mb-2">Review Queue</h3>
              <p className="text-on-surface-variant font-medium font-body">You have <span className="text-primary font-bold">12 pending approvals</span> for the current period.</p>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-2.5 bg-secondary-container text-on-secondary-container rounded-full font-semibold flex items-center gap-2 hover:opacity-90 transition-all font-body text-sm">
                <span className="material-symbols-outlined text-lg">filter_list</span>
                Filter
              </button>
              <button className="px-6 py-2.5 bg-primary text-on-primary rounded-full font-semibold flex items-center gap-2 hover:opacity-90 shadow-sm transition-all font-body text-sm">
                <span className="material-symbols-outlined text-lg">check_circle</span>
                Approve Selected
              </button>
            </div>
          </div>

          {/* Bento Style Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Main Listing Table Area (Spans 2 columns) */}
            <div className="xl:col-span-2 space-y-6">
              {/* Card 1 */}
              <div className="bg-surface-container-lowest rounded-xl p-6 flex gap-6 hover:shadow-md transition-shadow group shadow-[0px_12px_32px_rgba(26,27,31,0.06)]">
                <div className="w-48 h-48 rounded-lg overflow-hidden flex-shrink-0">
                  <img alt="Property thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUxSASCMqq2nleF9usTQbJXnde0myH42mrGCF_-gOG6GHQjKxKnFr27JQPIr2InDkDqIMEksuXWxAzAUu6DUJAzAII6SZIXvsuPAH0gZK_DQyzTy8WxgznXxNixkDBm4xixyWU04DF6X8mHm6GQ-rV5IrWm4e1AC0MwDd6tlayo2T2qCZAKYRdOfgjZBd4lDil3-cyhVBLHREh4-RyHRV6g84wC0V5IsZSuy3YEG3g6iHkObWpIDAqiWv1sArTHxb0EzULlIoTiIIl" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xl font-bold font-headline text-on-surface">The Glass Pavilion</h4>
                      <span className="px-3 py-1 bg-amber-100 text-amber-800 text-[10px] uppercase font-black tracking-widest rounded-full font-body">Pending Review</span>
                    </div>
                    <p className="text-sm text-on-surface-variant mb-4 font-body">Beverly Hills, CA • $4,250,000</p>
                    <div className="grid grid-cols-2 gap-4 text-xs font-body">
                      <div className="flex items-center gap-2 text-stone-500">
                        <span className="material-symbols-outlined text-base">person</span>
                        <span>Agent: Julian Vance</span>
                      </div>
                      <div className="flex items-center gap-2 text-stone-500">
                        <span className="material-symbols-outlined text-base">calendar_today</span>
                        <span>Submitted: Oct 12, 2023</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4 border-t border-surface-container mt-4 font-body">
                    <button className="flex-1 py-2 bg-primary text-on-primary rounded-lg text-sm font-bold hover:opacity-90 transition-all">Approve</button>
                    <button className="px-4 py-2 border border-outline-variant text-error font-semibold rounded-lg text-sm hover:bg-error/5 transition-all">Flag</button>
                    <button className="px-4 py-2 text-primary font-bold text-sm flex items-center gap-1 hover:underline underline-offset-4">Details</button>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <ReviewRequestCard
                image="https://lh3.googleusercontent.com/aida-public/AB6AXuCHuGWS1dCZorQRIabdlKCr7zUIqLmyYiG3e9sISciSYNJLlCA5Le4zFuqGolP301OhiZ5uCCOGlepNyzYQz2_h61XT8uin5gnFBRw9zfj-4BqpmLvnHoWLrn34f0rLDUgCv_ZWfqyj6l7gq4T8HO8ay7XBbXW615fl9L1RklhrO8ULrXxuWQuZ8G4k7cCtRAKR6vAEVcVk9gPYEPi0JxoZZ1xm1FYu0QqBmmxWnDcDr1t1eM1quwEL9eDkPYImIEsVIEDtjsVd86QV"
                title="The White Solstice"
                address="Aspen, CO"
                price="$8,900,000"
                agent="Sarah Connor"
                submittedDate="Oct 11, 2023"
                status="Flagged"
                flaggedReason="Documents"
              />

              {/* Card 3 */}
              <ReviewRequestCard
                image="https://lh3.googleusercontent.com/aida-public/AB6AXuBx1WWd5a5oPbtSj97YhreomwiaiVMi9uDhcv0IyPksn4C_AI-wbP8CrgwfxqCaun3CnCZBztK9xwn44J7-LaBX3G0ZlMiBrKKb6VoizHrzFlgeOimcrGifq37zIfRWZr_weDlVg9EFe5H_o7XLBsYwfwNRufcKR4Vh_VWU3oGltGn-us6bu4feJSr_vtxetIlsco2O6tbJ-GnNgdRuF0Inbgv0Xn-RMIJYWox3tdh5YfGyXfHXlcGuhfTOwpL6zLAw5sIf_1rHhExh"
                title="Azure Horizon Estate"
                address="Malibu, CA"
                price="$12,400,000"
                agent="Michael Chen"
                submittedDate="Oct 10, 2023"
                status="Pending Review"
              />
            </div>

            {/* Stats & Context Area (1 column) */}
            <div className="space-y-8">
              {/* Quick Stats */}
              <div className="bg-primary-container p-8 rounded-xl text-on-primary-container relative overflow-hidden">
                <div className="relative z-10">
                  <h5 className="text-sm font-bold uppercase tracking-widest mb-6 opacity-80 font-body">Efficiency Score</h5>
                  <div className="text-5xl font-black mb-2 font-headline">94%</div>
                  <p className="text-sm font-medium leading-relaxed font-body">Approvals processed within 24 hours this week. Excellent performance.</p>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-10">
                  <span className="material-symbols-outlined text-[120px]" style={{ fontVariationSettings: "'FILL' 1" }}>speed</span>
                </div>
              </div>

              {/* Agent Activity Sidebar */}
              <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10">
                <h5 className="font-headline font-bold text-lg mb-6">Recent Activity</h5>
                <div className="space-y-6 font-body">
                  <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold">Azure Manor Approved</p>
                      <p className="text-xs text-on-surface-variant">2 hours ago • By Admin</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-full bg-error/10 flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>report</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold">Oakwood Loft Flagged</p>
                      <p className="text-xs text-on-surface-variant">4 hours ago • Missing permit</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-full bg-secondary-container flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-on-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>history</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold">History Exported</p>
                      <p className="text-xs text-on-surface-variant">Yesterday • CSV Format</p>
                    </div>
                  </div>
                </div>
                <button className="w-full mt-8 py-3 text-primary font-bold border-2 border-primary/20 rounded-xl hover:bg-primary/5 transition-all text-sm font-body">
                  View Full Audit Log
                </button>
              </div>

              {/* Guidance Note */}
              <div className="bg-tertiary-fixed p-6 rounded-xl text-on-tertiary-fixed border-l-4 border-tertiary">
                <div className="flex items-center gap-2 mb-2 font-body">
                  <span className="material-symbols-outlined">lightbulb</span>
                  <span className="font-bold">Manager Tip</span>
                </div>
                <p className="text-xs font-medium leading-relaxed font-body">Ensure all high-value listings ($5M+) have double verification of title deeds before final approval.</p>
              </div>
            </div>
          </div>

          {/* Floating Action Button (Contextual for Approvals) */}
          <button className="fixed bottom-10 right-10 flex items-center gap-3 px-8 py-4 bg-primary text-on-primary rounded-full font-bold shadow-2xl hover:scale-105 active:scale-95 transition-all z-50 font-body">
            <span className="material-symbols-outlined">verified</span>
            Bulk Approve (5)
          </button>
        </main>
      </div>
    </div>
  );
}
