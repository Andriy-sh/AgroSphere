'use client'; 
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { InlineOrganizationSelectProps } from '../types';

export const InlineOrganizationSelect: React.FC<
  InlineOrganizationSelectProps
> = ({
  organizations,
  value,
  onChange,
  disabled,
  placeholder = 'Select organization',
  className = '',
  triggerClassName = '',
}) => {
  const [orgSort, setOrgSort] = useState<'distance' | 'tasks'>('distance');
  const [sortDir, setSortDir] = useState<{
    distance: 'asc' | 'desc';
    tasks: 'asc' | 'desc';
  }>({ distance: 'asc', tasks: 'desc' });
  const [orgOpen, setOrgOpen] = useState(false);
  const orgRef = useRef<HTMLDivElement>(null);

  const sortedOrgs = useMemo(() => {
    if (orgSort === 'distance') {
      return [...organizations].sort((a, b) =>
        sortDir.distance === 'asc'
          ? (a.distance ?? 0) - (b.distance ?? 0)
          : (b.distance ?? 0) - (a.distance ?? 0)
      );
    } else {
      return [...organizations].sort((a, b) =>
        sortDir.tasks === 'asc'
          ? (a.tasks ?? 0) - (b.tasks ?? 0)
          : (b.tasks ?? 0) - (a.tasks ?? 0)
      );
    }
  }, [organizations, orgSort, sortDir]);

  useEffect(() => {
    if (!orgOpen) return;
    const handler = (e: MouseEvent) => {
      if (orgRef.current && !orgRef.current.contains(e.target as Node)) {
        setOrgOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [orgOpen]);

  const selectedOrg = organizations.find((o) => o.value === value);

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setOrgOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={orgRef}>
      <button
        type="button"
        className={`w-full px-3 py-2 text-basic-black  focus:border-basic-green flex items-center justify-between ${
          disabled
            ? 'border border-basic-white bg-transparent rounded-lg cursor-not-allowed opacity-50'
            : 'border border-basic-white rounded-lg '
        } ${triggerClassName}`}
        onClick={() => !disabled && setOrgOpen((v) => !v)}
        disabled={disabled}
      >
        <div className="flex-1 text-left min-w-0">
          {selectedOrg ? (
            <div className="flex items-center text-sm font-medium text-basic-black min-w-0">
              <span className="truncate whitespace-nowrap overflow-hidden flex-1 min-w-0">
                {selectedOrg.label}
                {selectedOrg.own && (
                  <span className="text-basic-gray"> (own)</span>
                )}
                {typeof selectedOrg.distance === 'number' && (
                  <span className="text-basic-gray">
                    {' '}
                    • {selectedOrg.distance} km
                  </span>
                )}
                {typeof selectedOrg.tasks === 'number' && (
                  <span className="text-basic-gray">
                    {' '}
                    • {selectedOrg.tasks} tasks
                  </span>
                )}
              </span>
            </div>
          ) : (
            <span className="text-gray-400 truncate whitespace-nowrap overflow-hidden">
              {placeholder}
            </span>
          )}
        </div>
        <span className="material-symbols-outlined text-lg text-basic-gray ml-2 flex-shrink-0">
          expand_all
        </span>
      </button>
      {orgOpen && (
        <div
          className="absolute z-20 left-0 mt-2 w-full bg-white border-2  rounded-xl p-0 min-w-[400px] max-h-[350px] overflow-y-auto shadow-xl"
          style={{ minWidth: 400 }}
        >
          <div className="flex  gap-2 p-1">
            <button
              className="flex-1 flex items-center justify-start p-1 rounded-lg border-0 text-sm font-medium transition-all bg-basic-white text-basic-black"
              onClick={() => {
                if (orgSort === 'distance') {
                  setSortDir((s) => ({
                    ...s,
                    distance: s.distance === 'asc' ? 'desc' : 'asc',
                  }));
                } else {
                  setOrgSort('distance');
                }
              }}
              type="button"
              style={{ borderTopLeftRadius: 12 }}
            >
              <span className="material-symbols-outlined mr-2 text-xl">
                height
              </span>
              Sort by distance{' '}
            </button>
            <button
              className="flex-1 flex items-center justify-start p-0 rounded-md border-0 text-sm font-medium transition-all bg-basic-white text-black"
              onClick={() => {
                if (orgSort === 'tasks') {
                  setSortDir((s) => ({
                    ...s,
                    tasks: s.tasks === 'asc' ? 'desc' : 'asc',
                  }));
                } else {
                  setOrgSort('tasks');
                }
              }}
              type="button"
              style={{ borderTopRightRadius: 12 }}
            >
              <span className="material-symbols-outlined mr-2 text-xl">
                height
              </span>
              Sort by tasks{' '}
            </button>
          </div>
          <div className="border border-dashed  rounded-b-xl p-0">
            <div className="text-basic-green text-sm font-medium p-3">
              -- Select organization --
            </div>
            <div className="max-h-[220px] overflow-y-auto px-2 pb-2">
              {sortedOrgs.map((opt) => (
                <div
                  key={opt.value}
                  className={`flex items-center px-4 py-2 rounded-lg cursor-pointer transition-all hover:bg-[#EEF0F6] ${
                    value === opt.value ? 'bg-basic-white' : ''
                  }`}
                  onClick={() => handleOptionClick(opt.value)}
                >
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-basic-black text-sm">
                      {opt.label}
                    </span>
                    {opt.own && (
                      <span className="text-basic-gray text-sm ml-1">
                        (own)
                      </span>
                    )}
                    {typeof opt.distance === 'number' && (
                      <span className="text-basic-gray text-xs ml-2">
                        • {opt.distance} km
                      </span>
                    )}
                    {typeof opt.tasks === 'number' && (
                      <span className="text-basic-gray text-xs ml-2">
                        • {opt.tasks} tasks
                      </span>
                    )}
                  </div>
                  {value === opt.value && (
                    <span className="material-symbols-outlined text-green-500 ml-2 flex-shrink-0">
                      check
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
