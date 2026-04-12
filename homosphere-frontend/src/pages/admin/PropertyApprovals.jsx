import { Link } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import ApprovalCard from '../../components/admin/ApprovalCard';

export default function PropertyApprovals() {
  return (
    <div className="bg-surface text-on-surface font-body min-h-screen flex">
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <AdminHeader />

        {/* Main Content Canvas */}
        <main className="flex-1 p-10 bg-surface">
          {/* Header Section */}
          <div className="mb-10 flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-extrabold text-on-surface font-headline tracking-tight">Property Approvals</h1>
              <p className="text-on-surface-variant font-body mt-2">Review and manage incoming property listings for Horizon Realty.</p>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-2 rounded-full bg-secondary-container text-on-secondary-container font-label text-sm font-semibold hover:opacity-90 transition-all">
                Export Report
              </button>
              <button className="px-6 py-2 rounded-full bg-primary text-on-primary font-label text-sm font-semibold shadow-[0px_12px_32px_rgba(26,27,31,0.06)] hover:opacity-90 transition-all">
                Bulk Actions
              </button>
            </div>
          </div>

          {/* Approval Dashboard Layout */}
          <div className="grid grid-cols-12 gap-8">
            {/* Statistics Sidebar (Editorial Bento Style) */}
            <div className="col-span-12 lg:col-span-3 space-y-6">
              <div className="p-6 bg-surface-container-lowest rounded-xl shadow-[0px_12px_32px_rgba(26,27,31,0.06)]">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Pipeline Status</p>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-on-surface-variant">Pending</span>
                    <span className="px-3 py-1 bg-primary-container/20 text-primary text-xs font-bold rounded-full">24</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-on-surface-variant">Flagged</span>
                    <span className="px-3 py-1 bg-error-container text-error text-xs font-bold rounded-full">03</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-on-surface-variant">Processed (Today)</span>
                    <span className="px-3 py-1 bg-secondary-container text-on-secondary-container text-xs font-bold rounded-full">48</span>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-primary-container text-on-primary-container rounded-xl">
                <span className="material-symbols-outlined mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                <h3 className="text-lg font-bold font-headline mb-2 leading-tight">Average Approval Time</h3>
                <p className="text-3xl font-black mb-1">4.2h</p>
                <p className="text-xs opacity-80">12% faster than last week</p>
              </div>
            </div>

            {/* Main Approval List */}
            <div className="col-span-12 lg:col-span-9 space-y-4">
              {/* Listing Card 1 */}
              <ApprovalCard
                image="https://lh3.googleusercontent.com/aida-public/AB6AXuCiPnoWuC4gCK0XP01PIzkRgmkwL3F5D7-OIO9lcx494Iw_yUMJwLsBz-bPTgg_5UkCidf5gmfSzh5l9FJiBHCrpcaliCHlTfQULEOjpluHZBOCePSsmwnc7BElNa6X0O6C6NcKBs48Odc-ArO65z867FzhG8I8GAO4MfbMU3nqMn83wnFdqc7canlftsugIbjzrwlpRMYjSkzeIKDiBXIZZCEAyLvqw7k2L6MTdHFCsv9pwJwMZKozkl49tGjOu2PZ5Fj6q-KQPC2D"
                title="The Obsidian Sanctuary"
                address="324 Glasshouse Way, San Francisco"
                price="$4,250,000"
                agent="Marcus Thorne"
                photosCount={12}
                status="Pending Review"
                submittedTime="2h ago"
              />

              {/* Listing Card 2 */}
              <ApprovalCard
                image="https://lh3.googleusercontent.com/aida-public/AB6AXuDMCRDnOjQLZ3Uv81CfJ25cG3bOPo6-9RyYr2O1LkrLOkRFOu-JvGimO_5qOM1jZ0zNWng2F9RFHaZbjrsIN9uxUpYMAoIZN1uyztcXs5PaMEoqfaO02iy4nG6ICPCmKXRCZOkoDPOAo_QO0CWZnEUA3aig98lhMj3k5NsMyvQzAUNNRYwjERKYJq3_qsYUE1QAzMXc9vP4FH0M4HWnqTKFr53-RPvx2TpcGhoZT8601sN8lv07KPMSWa1NSfOGMZiGvMQGrIGk2ycy"
                title="Lavender Hill Retreat"
                address="89 Country Lane, Napa Valley"
                price="$1,150,000"
                agent="Elena Rossi"
                photosCount={8}
                status="Pending Review"
                submittedTime="5h ago"
              />

              {/* Listing Card 3 - Flagged State */}
              <ApprovalCard
                image="https://lh3.googleusercontent.com/aida-public/AB6AXuA5wo6pCxuVRY28rZ3WV0PZEN3H_JBuqWlHHj9kkJT22eC2Io93NdUHFSoannBNanD3Ur8fRZkOWMiAbABlqq1t3aCeNpnabHoAY8eTAOt-35QPaGmcAIYsggSAFGQApbST0zd35SFagMfcMbJ3ZKsFffPNdBPr4JdtkHmsJPoKclAEHTIOScwEt_iVqZ39oxJPfUdXp4ICqy69ZrUVDGb6JXzTg_nma2Ndx_ZFtA8NmnIb3qrEONyL1Ooz5gxYMizKA9to1BtVPdqF"
                title="The Loft at Pier 9"
                address="12 Harbor Blvd, Boston"
                price="$890,000"
                status="Flagged"
                submittedTime="Yesterday"
                flaggedReason="Low Res Photos"
                warningMessage="Missing HDR verification"
              />

              {/* Pagination/Load More */}
              <div className="py-8 flex justify-center">
                <button className="px-8 py-3 rounded-full bg-white text-[#476738] font-bold text-sm shadow-[0px_12px_32px_rgba(26,27,31,0.06)] hover:bg-surface-container-low transition-colors">
                  View 15 More Pending
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activity Toast (Optional Overlay Element) */}
          <div className="fixed bottom-8 right-8 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-xl shadow-[0px_12px_32px_rgba(26,27,31,0.06)] flex items-center gap-3 z-50">
            <div className="w-2 h-2 rounded-full bg-[#add198]"></div>
            <p className="text-xs font-medium">Approved "Silvercrest Estate" (2 mins ago)</p>
            <button className="text-[10px] uppercase font-bold text-[#add198] ml-2">Undo</button>
          </div>
        </main>
      </div>
    </div>
  );
}
