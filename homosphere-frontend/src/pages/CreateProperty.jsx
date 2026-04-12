import React from 'react';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';

export default function CreateProperty() {
  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col font-body">
      <TopNavBar />
      
      <main className="pt-32 pb-24 max-w-5xl mx-auto px-6 flex-grow w-full">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight mb-4 font-headline">List Your Property</h1>
          <p className="text-on-surface-variant text-lg max-w-2xl">Showcase your architectural masterpiece to a discerning audience. Horizon Estates ensures your property meets the eyes of true connoisseurs.</p>
        </header>
        
        <form className="space-y-12" onSubmit={(e) => e.preventDefault()}>
          {/* Section 1: Basic Details */}
          <section className="bg-surface-container-low p-8 md:p-10 rounded-xl space-y-8">
            <div className="flex items-center space-x-3 mb-2">
              <span className="material-symbols-outlined text-primary">description</span>
              <h2 className="text-2xl font-bold text-on-surface font-headline">Basic Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-on-surface-variant mb-2">Property Title</label>
                <input className="w-full h-12 bg-surface-container-high border-none rounded-lg focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all px-4 outline-none" placeholder="e.g. Modernist Cantilever Residence in Silver Lake" type="text" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-on-surface-variant mb-2">Description</label>
                <textarea className="w-full bg-surface-container-high border-none rounded-lg focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all p-4 outline-none" placeholder="Describe the soul of the home, the architectural intent, and the living experience..." rows={5}></textarea>
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-2">Property Type</label>
                <select className="w-full h-12 bg-surface-container-high border-none rounded-lg focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all px-4 outline-none appearance-none">
                  <option>Single Family</option>
                  <option>Condo</option>
                  <option>Townhouse</option>
                  <option>Multi-Family</option>
                  <option>Land</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-2">Condition</label>
                <select className="w-full h-12 bg-surface-container-high border-none rounded-lg focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all px-4 outline-none appearance-none">
                  <option>New</option>
                  <option>Excellent</option>
                  <option>Good</option>
                  <option>Fair</option>
                </select>
              </div>
            </div>
          </section>

          {/* Section 2: Specifications */}
          <section className="bg-surface-container-low p-8 md:p-10 rounded-xl space-y-8">
            <div className="flex items-center space-x-3 mb-2">
              <span className="material-symbols-outlined text-primary">square_foot</span>
              <h2 className="text-2xl font-bold text-on-surface font-headline">Specifications & Price</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-2">Year Built</label>
                <input className="w-full h-12 bg-surface-container-high border-none rounded-lg focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all px-4 outline-none" placeholder="2024" type="number" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-on-surface-variant mb-2">Asking Price</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-on-surface-variant">$</span>
                  <input className="w-full h-12 bg-surface-container-high border-none rounded-lg focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all pl-8 pr-4 outline-none" placeholder="2,500,000" type="number" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-2">Lot Area (sq ft)</label>
                <input className="w-full h-12 bg-surface-container-high border-none rounded-lg focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all px-4 outline-none" placeholder="8,500" type="number" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-2">Property Area (sq ft)</label>
                <input className="w-full h-12 bg-surface-container-high border-none rounded-lg focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all px-4 outline-none" placeholder="3,200" type="number" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-2">Seeking Broker</label>
                <div className="flex items-center space-x-6 h-12">
                  <label className="flex items-center space-x-2 cursor-pointer group">
                    <input className="w-5 h-5 text-primary border-none bg-surface-container-high focus:ring-primary/20" name="broker" type="radio" />
                    <span className="text-on-surface-variant group-hover:text-primary transition-colors">Yes</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer group">
                    <input className="w-5 h-5 text-primary border-none bg-surface-container-high focus:ring-primary/20" name="broker" type="radio" />
                    <span className="text-on-surface-variant group-hover:text-primary transition-colors">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-2">Bedrooms</label>
                <input className="w-full h-12 bg-surface-container-high border-none rounded-lg focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all px-4 outline-none" placeholder="4" type="number" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-2">Bathrooms</label>
                <input className="w-full h-12 bg-surface-container-high border-none rounded-lg focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all px-4 outline-none" placeholder="3.5" type="number" />
              </div>
            </div>
          </section>

          {/* Section 3: Location */}
          <section className="bg-surface-container-low p-8 md:p-10 rounded-xl space-y-8">
            <div className="flex items-center space-x-3 mb-2">
              <span className="material-symbols-outlined text-primary">location_on</span>
              <h2 className="text-2xl font-bold text-on-surface font-headline">Location</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-on-surface-variant mb-2">Street Address</label>
                  <input className="w-full h-12 bg-surface-container-high border-none rounded-lg focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all px-4 outline-none" placeholder="123 Vista Horizon Dr" type="text" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-on-surface-variant mb-2">City</label>
                    <input className="w-full h-12 bg-surface-container-high border-none rounded-lg focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all px-4 outline-none" placeholder="Malibu" type="text" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-on-surface-variant mb-2">State</label>
                    <input className="w-full h-12 bg-surface-container-high border-none rounded-lg focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all px-4 outline-none" placeholder="CA" type="text" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-on-surface-variant mb-2">Zip Code</label>
                  <input className="w-full h-12 bg-surface-container-high border-none rounded-lg focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all px-4 outline-none" placeholder="90265" type="text" />
                </div>
              </div>
              <div className="h-full min-h-[300px] rounded-xl overflow-hidden grayscale contrast-125 brightness-90">
                <img className="w-full h-full object-cover" alt="simplified stylistic map of a residential coastal neighborhood in Malibu California with clean lines and sage green accents" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAg0peJTAtLGI_3y5yUmW3F-z1b0CX43OmxjGPmD-xzkOT62oWH5AVCXKMepl9TtrYP60T9v00XLi4R2IAkME3HxKLFb9-67gPsLo9XEmUq1cOeoQUJbaCV1q7xB7JTpUv3P1MMSgeNoscwMfMeq1VUrx-JK5wr5E6Qnzo84DjEqUPD64t9FjfsjSv-dieT9uOzJjt2tlcQiHzjbQJukVP_erAbEDDoRzJXfaNmkD3yIM11IO8yfIekOeRyck22DCo7O1I4BsgriJHT" />
              </div>
            </div>
          </section>

          {/* Section 4: Media */}
          <section className="bg-surface-container-low p-8 md:p-10 rounded-xl space-y-8">
            <div className="flex items-center space-x-3 mb-2">
              <span className="material-symbols-outlined text-primary">photo_camera</span>
              <h2 className="text-2xl font-bold text-on-surface font-headline">Visual Narrative</h2>
            </div>
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-4">Banner Image (The Cover Story)</label>
                <div className="w-full h-64 border-2 border-dashed border-outline-variant/30 rounded-xl bg-surface-container-lowest/50 flex flex-col items-center justify-center space-y-4 hover:bg-white hover:border-primary/40 transition-all cursor-pointer group">
                  <span className="material-symbols-outlined text-4xl text-primary/40 group-hover:text-primary transition-colors">cloud_upload</span>
                  <div className="text-center">
                    <p className="font-semibold text-on-surface">Drag and drop your primary hero image</p>
                    <p className="text-sm text-on-surface-variant">Recommended: 1920x1080px or higher</p>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-4">Gallery Photos (The Details)</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="aspect-square border-2 border-dashed border-outline-variant/30 rounded-xl flex items-center justify-center hover:bg-white hover:border-primary/40 transition-all cursor-pointer">
                    <span className="material-symbols-outlined text-primary/40">add</span>
                  </div>
                  <div className="aspect-square border-2 border-dashed border-outline-variant/30 rounded-xl flex items-center justify-center hover:bg-white hover:border-primary/40 transition-all cursor-pointer">
                    <span className="material-symbols-outlined text-primary/40">add</span>
                  </div>
                  <div className="aspect-square border-2 border-dashed border-outline-variant/30 rounded-xl flex items-center justify-center hover:bg-white hover:border-primary/40 transition-all cursor-pointer">
                    <span className="material-symbols-outlined text-primary/40">add</span>
                  </div>
                  <div className="aspect-square border-2 border-dashed border-outline-variant/30 rounded-xl flex items-center justify-center hover:bg-white hover:border-primary/40 transition-all cursor-pointer">
                    <span className="material-symbols-outlined text-primary/40">add</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-col md:flex-row items-center justify-end space-y-4 md:space-y-0 md:space-x-6 pt-12 border-t border-outline-variant/10">
            <button className="text-primary font-bold hover:underline px-8 py-4 transition-all" type="button">Cancel</button>
            <button className="w-full md:w-auto bg-primary text-on-primary font-bold px-12 py-4 rounded-full shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all" type="submit">Submit Listing</button>
          </div>
        </form>
      </main>
      
      <Footer />
    </div>
  );
}
