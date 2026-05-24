'use client';
import { Collapsible as CollapsibleBase } from '@base-ui-components/react/collapsible';
import { ChevronDown } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../utils/cn';
import { Checkbox } from '../../components/checkbox/checkbox';
import { Badge } from '../../components/badge/badge';
import { Toggle } from '../../components/toggle/toggle';
import Skeleton from '@mui/material/Skeleton';

type BaseCollapsibleRootProps =
  typeof CollapsibleBase.Root extends React.ComponentType<infer P> ? P : never;

type CollapsibleProps = BaseCollapsibleRootProps & {
  children: React.ReactNode;
  title: string;
  icon?: string;
  className?: string;
  defaultOpen?: boolean;
  showArrow?: boolean;
  titleClassName?: string;
  onOpenChange?: (isOpen: boolean) => void;
};

type CollapsibleWithToggleProps = BaseCollapsibleRootProps & {
  children: React.ReactNode;
  title: string;
  icon?: string;
  iconClassName?: string;
  className?: string;
  defaultOpen?: boolean;
  defaultEnabled?: boolean;
  disabled?: boolean;
  titleClassName?: string;
  onOpenChange?: (isOpen: boolean) => void;
  onToggleChange?: (enabled: boolean) => void;
};

type CollapsibleWithPercentageProps = BaseCollapsibleRootProps & {
  children: React.ReactNode;
  title: string;
  percentage: number;
  statusIcon?: React.ReactNode;
  className?: string;
  defaultOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
};

export function CollapsibleWithToggle({
  children,
  title,
  icon = 'arrow_right',
  className,
  iconClassName,
  defaultOpen = true,
  defaultEnabled = false,
  disabled = false,
  titleClassName,
  onOpenChange,
  onToggleChange,
  ...props
}: CollapsibleWithToggleProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [enabled, setEnabled] = useState(defaultEnabled);
  const panelRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState('0px');

  useEffect(() => {
    if (open && panelRef.current) {
      setMaxHeight(panelRef.current.scrollHeight + 'px');
    } else {
      setMaxHeight('0px');
    }
  }, [open]);

  useEffect(() => {
    setOpen(defaultOpen);
  }, [defaultOpen]);

  useEffect(() => {
    setEnabled(defaultEnabled);
  }, [defaultEnabled]);

  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;

    const newEnabled = !enabled;
    setEnabled(newEnabled);
    onToggleChange?.(newEnabled);
  };

  const handleToggleChange = (checked: boolean) => {
    if (disabled) return;

    setEnabled(checked);
    onToggleChange?.(checked);
  };

  const handleHeaderClick = () => {
    const newOpen = !open;
    setOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  return (
    <CollapsibleBase.Root className={cn('', className)} {...props}>
      <div
        onClick={handleHeaderClick}
        className={cn(
          'flex items-center justify-between cursor-pointer select-none w-full transition-colors duration-200',
          disabled && 'cursor-default'
        )}
      >
        <div className="flex items-center gap-3 flex-1">
          <span
            className={cn(
              'material-symbols-outlined text-xl text-basic-black transition-transform duration-300',
              open && 'rotate-90',
              iconClassName
            )}
          >
            {icon}
          </span>
          <span className="font-medium text-basic-black text-sm">{title}</span>
        </div>

        <div onClick={handleToggleClick}>
          <Toggle
            checked={enabled}
            onCheckedChange={handleToggleChange}
            disabled={disabled}
          />
        </div>
      </div>

      <div
        ref={panelRef}
        style={{ maxHeight, transition: 'max-height 0.3s ease' }}
        className="overflow-hidden"
        aria-hidden={!open}
      >
        <div className="p-4">{children}</div>
      </div>
    </CollapsibleBase.Root>
  );
}

export function CollapsibleWithPercentage({
  children,
  title,
  percentage,
  statusIcon,
  className,
  defaultOpen = true,
  onOpenChange,
  ...props
}: CollapsibleWithPercentageProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState('0px');

  useEffect(() => {
    if (open && panelRef.current) {
      setMaxHeight(panelRef.current.scrollHeight + 'px');
    } else {
      setMaxHeight('0px');
    }
  }, [open, children]);

  useEffect(() => {
    setOpen(defaultOpen);
  }, [defaultOpen]);

  const handleHeaderClick = () => {
    const newOpen = !open;
    setOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  return (
    <CollapsibleBase.Root className={cn('', className)} {...props}>
      <div
        onClick={handleHeaderClick}
        className="flex items-center justify-between cursor-pointer select-none w-full transition-colors duration-200"
      >
        <div className="flex items-center gap-3 flex-1">
          <span
            className={cn(
              'material-symbols-outlined text-xl text-basic-black transition-transform duration-300',
              open && 'rotate-90'
            )}
          >
            arrow_right
          </span>
          {statusIcon}
          <span className="font-medium text-basic-black text-sm">{title}</span>
        </div>

        <div className="flex items-center">
          <span className="text-sm text-basic-gray">{percentage}%</span>
        </div>
      </div>

      <div
        ref={panelRef}
        style={{ maxHeight, transition: 'max-height 0.3s ease' }}
        className="overflow-hidden"
        aria-hidden={!open}
      >
        {children}
      </div>
    </CollapsibleBase.Root>
  );
}

export function Collapsible({
  children,
  title,
  icon,
  className,
  defaultOpen = true,
  showArrow = true,
  titleClassName,
  onOpenChange,
  ...props
}: CollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState('0px');

  useEffect(() => {
    if (open && panelRef.current) {
      setMaxHeight(panelRef.current.scrollHeight + 'px');
    } else {
      setMaxHeight('0px');
    }
  }, [open]);

  useEffect(() => {
    setOpen(defaultOpen);
  }, [defaultOpen]);

  const wrappedChildren = React.Children.map(children, (child) => (
    <div className="flex items-center gap-2">{child}</div>
  ));

  return (
    <CollapsibleBase.Root className={cn('')} {...props}>
      <CollapsibleBase.Trigger
        onClick={() => {
          const newOpen = !open;
          setOpen(newOpen);
          onOpenChange?.(newOpen);
        }}
        className={cn(
          'flex items-center font-semibold justify-between px-4 py-2 cursor-pointer select-none w-full',
          className
        )}
      >
        <div className={cn('flex items-center flex-1 gap-2', titleClassName)}>
          {icon && (
            <span className="material-symbols-outlined text-14 text-basic-black">
              {icon}
            </span>
          )}
          <span
            className={cn(
              'block overflow-hidden whitespace-nowrap text-ellipsis'
            )}
          >
            {title}
          </span>
        </div>

        {showArrow && (
          <ChevronDown
            className={cn(
              'w-4 h-4 text-gray-600 transition-transform duration-300 ml-2',
              open && 'rotate-180'
            )}
          />
        )}
      </CollapsibleBase.Trigger>

      <div
        ref={panelRef}
        style={{ maxHeight, transition: 'max-height 0.3s ease' }}
        className="overflow-hidden rounded-b-md px-4"
        aria-hidden={!open}
      >
        <div className="pt-2 flex flex-col gap-2 text-gray-700 min-w-0">
          {wrappedChildren}
        </div>
      </div>
    </CollapsibleBase.Root>
  );
}

type RecoveryKeyRowProps = {
  checked: boolean;
  label: string;
  badgeCount: number | string;
  loading?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export function RecoveryKeyRow({
  label,
  badgeCount,
  checked: initialChecked = false,
  loading = false,
  onCheckedChange,
}: RecoveryKeyRowProps) {
  const [checked, setChecked] = useState(initialChecked);

  useEffect(() => {
    setChecked(initialChecked);
  }, [initialChecked]);

  const handleCheckedChange = (newChecked: boolean) => {
    setChecked(newChecked);
    onCheckedChange?.(newChecked);
  };

  return (
    <div className="flex items-center gap-2 py-1 min-w-0">
      <Checkbox
        checked={checked}
        className="w-4 h-4 flex-shrink-0"
        onCheckedChange={handleCheckedChange}
      />
      <div className="text-sm font-medium text-basic-gray truncate min-w-0 flex-1">
        {label}
      </div>
      <Badge variant="ghost" size="xs" className="flex-shrink-0">
        {loading ? (
          <Skeleton variant="text" width={20} height={16} className="rounded" />
        ) : (
          badgeCount
        )}
      </Badge>
    </div>
  );
}
