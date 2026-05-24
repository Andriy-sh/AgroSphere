'use client';
import React from 'react';
import { Input } from '@@agrosphere/shared';

interface PhoneInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export function PhoneInput({
  value,
  onChange,
  className = '',
}: PhoneInputProps) {
  return (
    <div className={`relative ${className}`}>
      <Input
        value={value}
        onChange={onChange}
        className="w-full h-12 pr-4 py-2 rounded-lg border border-basic-white"
        placeholder="+353 85 123 4567"
      />
    </div>
  );
}
