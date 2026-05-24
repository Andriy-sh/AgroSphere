'use client';

import React from 'react';

export function LabResultsCard() {
  return (
    <div className="bg-white rounded-xl shadow border p-6 border-[#EEF0F6] h-full">
      <h2 className="text-base font-medium text-black mb-6 text-start">
        Lab results
      </h2>
      <div className="flex flex-col items-center justify-center py-12 text-center h-full">
        <div className="mb-4">
          <div className="relative">
            <span className="material-symbols-outlined text-6xl text-gray-300">
              description
            </span>
            <span className="material-symbols-outlined text-4xl text-gray-300 absolute -top-2 -right-2">
              description
            </span>
            <span className="material-symbols-outlined text-3xl text-gray-300 absolute -top-4 -right-4">
              description
            </span>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No lab results yet!
        </h3>
        <p className="text-gray-600 max-w-md">
          Your test results will appear here as soon as they&apos;re received
          from the laboratory.
        </p>
      </div>
    </div>
  );
}
