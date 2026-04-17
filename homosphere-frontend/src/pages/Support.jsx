import React from 'react';
import { Link } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';

export default function Support() {
  return (
    <div className="min-h-screen bg-background text-on-surface font-body">
      <TopNavBar />
      <main className="pt-28 pb-16 px-4 md:px-8 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black text-on-surface mb-6 font-headline tracking-tight">Help & Support</h1>

        <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-8 md:p-12 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-on-surface mb-4 font-headline">Contact Information</h2>
            <div className="flex flex-col gap-4 text-on-surface-variant text-lg">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-primary text-3xl">mail</span>
                <span>support@homosphere.com</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-primary text-3xl">call</span>
                <span>+1 (800) 123-4567</span>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-on-surface mb-4 font-headline">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <details className="group cursor-pointer bg-surface-container rounded-lg p-5 border border-outline-variant open:bg-primary-container transition-colors">
                <summary className="font-bold text-on-surface text-lg flex justify-between items-center group-open:text-primary">
                  How do I list a property?
                  <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <p className="mt-4 text-on-surface-variant leading-relaxed pl-2 border-l-2 border-primary">
                  You can list a property by clicking "Sell" in the top navigation, or directly from your user dashboard if you are a seller or broker. Simply navigate to the create-property page and fill out the details.
                </p>
              </details>

              <details className="group cursor-pointer bg-surface-container rounded-lg p-5 border border-outline-variant open:bg-primary-container transition-colors">
                <summary className="font-bold text-on-surface text-lg flex justify-between items-center group-open:text-primary">
                  What subscriptions do you offer?
                  <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <p className="mt-4 text-on-surface-variant leading-relaxed pl-2 border-l-2 border-primary">
                  Homosphere offers different subscription tiers for buyers, sellers, and brokers. You can manage your subscription settings directly through the profile panel to gain access to premium features.
                </p>
              </details>
            </div>
          </section>

          <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center border-t border-outline-variant">
            <Link
              to="/search"
              className="px-8 py-3 bg-primary text-on-primary font-semibold rounded-xl hover:opacity-90 transition-all text-center"
            >
              Back to Search
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
