import React from 'react';
import { cn } from '../../utils';

interface AdditionalSection {
  content: React.ReactNode;
  className?: string;
}

interface SplitCardProps {
  topContent: React.ReactNode;
  bottomContent?: React.ReactNode;
  className?: string;
  bottomClassName?: string;
  topClassName?: string;
  hideBottom?: boolean;
  additionalSections?: AdditionalSection[];
}

export function SplitCard({
  topContent,
  topClassName = '',
  bottomContent,
  bottomClassName = '',
  className = '',
  hideBottom = false,
  additionalSections,
}: SplitCardProps) {
  return (
    <div
      className={cn(
        `bg-white rounded-xl border border-basic-white flex flex-col ${className}`
      )}
    >
      <div className={`p-5  flex-shrink-0 ${topClassName}`}>{topContent}</div>

      {!hideBottom && (
        <div
          className={cn(
            `p-5 overflow-y-auto border-t border-basic-white flex-shrink-0 ${bottomClassName}`
          )}
        >
          {bottomContent}
        </div>
      )}

      {additionalSections && additionalSections.length > 0 && (
        <>
          {additionalSections.map((section, index) => (
            <React.Fragment key={index}>
              <div className="border-t border-basic-white flex-shrink-0" />
              <div className={cn('p-4 flex-shrink-0', section.className)}>
                {section.content}
              </div>
            </React.Fragment>
          ))}
        </>
      )}
    </div>
  );
}
