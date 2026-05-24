'use client';

import React from 'react';
import { LabItem } from '@@agrosphere/shared';

interface LabDetailHeaderProps {
  labItem: LabItem;
}

export function LabDetailHeader({ labItem }: LabDetailHeaderProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return 'hourglass_empty';
      case 'completed':
        return 'check_circle';
      case 'in_progress':
        return 'pending';
      default:
        return 'info';
    }
  };

  return (
    <div className="flex items-center gap-4 mb-2 p-2 ml-4 bg-white justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-[28px] font-semibold text-gray-900">
          #{labItem.id}
        </h1>
        <div
          className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
            labItem.status
          )}`}
        >
          <span className="material-symbols-outlined text-sm">
            {getStatusIcon(labItem.status)}
          </span>
          {labItem.status.charAt(0).toUpperCase() +
            labItem.status.slice(1).replace('_', ' ')}
        </div>
      </div>
      <button className="text-gray-400 hover:text-gray-600">
        <span className="material-symbols-outlined">more_vert</span>
      </button>
    </div>
  );
}
