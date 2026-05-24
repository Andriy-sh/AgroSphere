'use client';
import React from 'react';

interface DetailRowProps {
  icon: React.ReactNode;
  label: string;
  value?: React.ReactNode;
  valueClass?: string;
  children?: React.ReactNode;
}

export function DetailRow({
  icon,
  label,
  value,
  valueClass = '',
  children,
}: DetailRowProps) {
  return (
    <>
      <div className="flex items-center gap-2 text-gray-400 text-sm">
        <span className="material-symbols-outlined text-xl">{icon}</span>
        <span>{label}</span>
      </div>
      <div className={'text-black text-sm font-medium ' + valueClass}>
        {value ?? children}
      </div>
    </>
  );
}
