'use client';
import { ReactNode } from 'react';
import { DetailRow } from '../detail-row/detail-row';
import { Icon } from '../icon';

interface DetailCardProps {
  title: string;
  children: ReactNode;
  className?: string;
  showEditButton?: boolean;
  onEdit?: () => void;
}

export function DetailCard({
  title,
  children,
  className = '',
  showEditButton = false,
  onEdit,
}: DetailCardProps) {
  return (
    <div
      className={`bg-white rounded-xl border border-basic-white relative h-full flex flex-col overflow-hidden ${className}`}
    >
      {showEditButton && onEdit && (
        <Icon className="absolute top-6 right-6" onClick={onEdit} icon="edit" />
      )}
      <h2 className="text-base font-medium text-black p-5 border-b border-basic-white text-start">
        {title}
      </h2>
      <div className="grid grid-cols-[220px_1fr] gap-y-2 gap-x-4 items-center p-5">
        {children}
      </div>
    </div>
  );
}
