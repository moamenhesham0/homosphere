import React from 'react';
import { Link } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';

export default function About() {
  return (
    <div className="min-h-screen bg-background text-on-surface font-body">
      <TopNavBar />
      <main className="pt-28 pb-16 px-4 md:px-8 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black text-on-surface mb-6 font-headline tracking-tight">About Homosphere</h1>

        <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-8 md:p-12 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-on-surface mb-4 font-headline">Future of Real Estate</h2>
            <p className="text-on-surface-variant text-lg leading-relaxed">
              Homosphere simplifies real estate transactions through an advanced digital ecosystem. We connect buyers, sellers, and brokers by leveraging cutting-edge technology and artificial intelligence to provide secure, transparent, and efficient property dealings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-on-surface mb-4 font-headline">Our Vision</h2>
            <p className="text-on-surface-variant text-lg leading-relaxed">
              Transforming traditional property markets into seamless global networks where anyone can find their dream home or optimal investment with absolute confidence and clarity.
            </p>
          </section>

          <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center border-t border-outline-variant">
            <Link
              to="/search"
              className="px-8 py-3 bg-primary text-on-primary font-semibold rounded-xl hover:opacity-90 transition-all text-center"
            >
              Start Exploring
            </Link>
            <Link
              to="/support"
              className="px-8 py-3 bg-surface-container-high text-on-surface font-semibold rounded-xl hover:opacity-90 transition-all text-center"
            >
              Get Support
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
