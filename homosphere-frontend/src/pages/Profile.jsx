import { Link } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';
import PropertyCard from '../components/PropertyCard';

export default function Profile() {
  return (
    <div className="bg-surface text-on-surface font-body min-h-screen flex flex-col">
      <TopNavBar />

      <main className="pt-24 flex-grow max-w-7xl mx-auto px-8 pb-16 w-full">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="sticky top-28 space-y-8">
              <div className="bg-surface-container-lowest rounded-xl p-8 transition-all shadow-[0px_12px_32px_rgba(26,27,31,0.06)]">
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-4 bg-secondary-container">
                    <img className="w-full h-full object-cover" alt="Profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuADJIHuvQI5WvNO3RCQRUnwebc3QOEjw-AshIiBHXtHW1xqcEJPu9zVYtIGc1pJCZaHUvSK4e_m9j_4G7s7zyhLNxq_Op1LJYyhKYefwlzLLhUgNIXFsh8kBhJgqMqNGkfCxvIudj4UOKzwC1hGfdt4MwAUDfZ1cJvOM9CbDa3yfhcCT215Gyhtvp8Rq5IhTHizYS7sTDWGOdkEro90CFDpcVa_iLEWXslQ04H2R7iwM1y6trkgiXpfZPr4XkeFYaMD5WsX4WrvtDm0" />
                  </div>
                  <h2 className="font-headline font-extrabold text-xl text-on-surface">Eleanor Vance</h2>
                  <p className="text-on-surface-variant text-sm mt-1">vance.e@horizon.com</p>
                  <p className="text-on-surface-variant text-sm">San Francisco, CA</p>
                  <button className="mt-6 w-full py-2 border border-outline-variant/15 text-primary font-semibold rounded-lg hover:bg-surface-container-low transition-colors">
                    Edit Profile
                  </button>
                </div>
              </div>
              <nav className="space-y-2">
                <a className="flex items-center gap-3 px-4 py-3 bg-secondary-container text-on-secondary-container font-semibold rounded-lg transition-all" href="#">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                  <span>Saved Homes</span>
                </a>
                <a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-all" href="#">
                  <span className="material-symbols-outlined">search</span>
                  <span>Saved Searches</span>
                </a>
                <a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-all" href="#">
                  <span className="material-symbols-outlined">settings</span>
                  <span>Account Settings</span>
                </a>
                <a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-all" href="#">
                  <span className="material-symbols-outlined">notifications</span>
                  <span>Notifications</span>
                </a>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <section className="flex-grow space-y-12">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-4xl font-headline font-black text-emerald-900 tracking-tight">Saved Homes</h1>
                <p className="text-on-surface-variant font-body">You have 12 properties saved in your curated list.</p>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-secondary-fixed text-on-secondary-fixed-variant rounded-full text-sm font-semibold transition-all hover:opacity-80">
                  <span className="material-symbols-outlined text-sm">filter_list</span>
                  Filter
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-secondary-fixed text-on-secondary-fixed-variant rounded-full text-sm font-semibold transition-all hover:opacity-80">
                  Sort: Newest
                </button>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Property Card 1 */}
              <PropertyCard
                image="https://lh3.googleusercontent.com/aida-public/AB6AXuCliRw5IfMfpnl0m_kqiLBmCj_kQ-5nw3fK-3n_YfapFTwEFpNGBUt8KeJpBwjh7jNfeOAsmD85x-ww5eC_8Rn7by8osp47THifPZluCiJ0PAd0xnk8BxO6I7Nflv-pukUnID0xoHn3Ty_bTPWeJc6814DoKLd0eotvvxZLm1LzX92LcrgSkvPm_tUWiQg6DWfSrKrubInjN_5ta3sAuDWux9k7-o4Gl5O2K-ZVgK7KCbCmsqCtDTtDzt_Lt4SuIFJzMK1enffJN6gi"
                price="$2,450,000"
                addressLine1="4582 Oakwood Dr, Marin County, CA"
                beds={4}
                baths={3.5}
                sqft="3,200"
                featured={true}
              />

              {/* Property Card 2 */}
              <PropertyCard
                image="https://lh3.googleusercontent.com/aida-public/AB6AXuAw_7km0axsozpczdaQ9Zen0F15eLRUizSO1HyVJk1U0WMtwy7HNDIJ-m_qH3JRiJ_lkObmzeJsJfCJkaCXfhY8yJKQTG3bxQLKbgMXk148lJFunaJqve7noCBiTNUJUqfTlbwBiWPK2n9B72G9bEkmFiiL1I9nXXlxfiRLlTSUYc1g0fbiqjjDNIO_THWOnyLGZ_3zw4KxLDBYlzqwVSRjPzKiCddKCavduKKVSpwlNhicjTKkpJVJSSMgOmAU-BfHSC_MKTCb0tuq"
                price="$1,890,000"
                addressLine1="1209 Skyline Blvd, San Francisco, CA"
                beds={3}
                baths={2}
                sqft="2,100"
              />

              {/* Property Card 3 */}
              <PropertyCard
                image="https://lh3.googleusercontent.com/aida-public/AB6AXuBwHfY3pMThRglmd8z4vC2dswe4BGxEsNSmH2EIZ8mNfY_ES-_rjGeKZ1z1eDNwPzn2wUG13_UBtSAbd1DWMXx-T0hzrhTP-CLSWrXkzNY-DhpuiRWM6TtN0-pRY-YoPeCG_PoR5vty7L_cR92ta-WoKcYL1Xr5RRUyYPs2bXMHW2hcKacebiqkxRHxHmqz_RkeWyyImkf_mIXqc9Q7cFN_AFa6SSP2GgCjXvkB-XuA_UMSsfHqP1um01TgtsD3y1HfcugYU68P_uLR"
                price="$3,100,000"
                addressLine1="Ocean View Penthouse, Sausalito, CA"
                beds={3}
                baths={3}
                sqft="2,850"
              />

              {/* Property Card 4 */}
              <PropertyCard
                image="https://lh3.googleusercontent.com/aida-public/AB6AXuDxZlTGP0ABM6fJ265sW2Aa2lptnMt1MF0TQx8pz3_-986lBS1Tnwc_PU_egehGhemNWo3zvxptdtYYJ_eubnliWZ9SqiBcAWrXYt-TU3_s8bADe8KLPvleHkh197RgFlbqaMkxLhEz1lBAAxJUgA22tnhJVQYCtRwc6WWlkeZtZ-PDmogn9CaH08huR7YH6LMPWwWs8yLr0EOwlB0gsn0nF1U_idgf_g6-88h1ll4gnTcDLIHDhMv-6gfex1sc_4cQaJc39yJ7o3FB"
                price="$4,200,000"
                addressLine1="772 Ridgecrest Dr, Napa Valley, CA"
                beds={5}
                baths={4.5}
                sqft="5,400"
              />
            </div>

            <div className="bg-primary-container/20 rounded-xl p-12 text-center space-y-4">
              <h4 className="text-2xl font-headline font-bold text-emerald-900">Looking for something specific?</h4>
              <p className="text-on-surface-variant max-w-md mx-auto">Our local agents are ready to help you find the perfect property that matches your unique vision.</p>
              <button className="px-8 py-3 bg-primary text-on-primary font-bold rounded-lg mt-4 hover:shadow-lg transition-all">
                Contact an Agent
              </button>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
