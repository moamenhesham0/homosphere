import React from 'react';

export default function FactFeatureCard({ icon, title, value }) {
  return (
    <div className="bg-surface-container-low p-6 rounded-lg flex items-start gap-4">
      <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
      <div>
        <h4 className="font-bold font-headline mb-1">{title}</h4>
        <p className="text-on-surface-variant text-sm">{value}</p>
      </div>
    </div>
  );
}
