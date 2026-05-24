import * as React from 'react';
import { Toggle } from '../toggle/toggle';
import { cn } from '../../utils';

interface PreferenceOptionProps {
  icon?: string;
  title: string;
  titleClassName?: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}

export const PreferenceOption: React.FC<PreferenceOptionProps> = ({
  icon,
  title,
  titleClassName,
  description,
  enabled,
  onToggle,
}) => (
  <div className="flex items-center justify-between">
    <div className="flex-1">
      {icon && (
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-lg text-basic-black">
            {icon}
          </span>
          <h3 className={cn("text-sm font-medium text-basic-black", titleClassName)}>{title}</h3>
        </div>
      )}
      {!icon && (
        <h3 className="text-sm font-medium text-basic-black">{title}</h3>
      )}
      <p className="text-sm font-normal text-basic-gray">{description}</p>
    </div>
    <Toggle checked={enabled} onCheckedChange={onToggle} size="md" />
  </div>
);
