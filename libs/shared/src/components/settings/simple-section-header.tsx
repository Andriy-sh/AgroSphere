import * as React from 'react';

interface SimpleSectionHeaderProps {
  title: string;
  children?: React.ReactNode;
}

export const SimpleSectionHeader: React.FC<SimpleSectionHeaderProps> = ({
  title,
  children,
}) => (
  <div className="flex items-center justify-between p-5 border-b border-basic-white">
    <h2 className="text-base font-semibold text-basic-black">{title}</h2>
    {children}
  </div>
);
