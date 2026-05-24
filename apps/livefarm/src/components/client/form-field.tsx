'use client';
import React from 'react';

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({ label, children, className = '' }: FormFieldProps) {
  return (
    <div className={className}>
      <label className="block mb-2 text-basic-gray font-medium">{label}</label>
      {children}
    </div>
  );
}
