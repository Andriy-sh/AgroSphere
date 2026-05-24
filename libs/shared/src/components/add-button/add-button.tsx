'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '../../utils/cn';
import { Button } from '../button/button';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { createPopper, Instance } from '@popperjs/core';
import { Icon } from '../icon';

export interface AddButtonProps {
  className?: string;
  buttonText?: string;
  disabled?: boolean;
  onAddTask?: () => void;
  onAddClient?: () => void;
  onAddFarm?: () => void;
  onAddParcel?: () => void;
  customOptions?: Array<{
    id: string;
    label: string;
    onClick: () => void;
  }>;
  useCustomOptions?: boolean;
}

const DROPDOWN_ITEMS = [
  { id: 'task', label: 'Add task', path: '/tasks/create-task' },
  { id: 'client', label: 'Add client', path: '/clients' },
  { id: 'farm', label: 'Add farm', path: '/my-farm/create-farm' },
  { id: 'parcel', label: 'Add parcel', path: '/my-farm/create-parcel-zone' },
] as const;

const BUTTON_STYLES = {
  base: 'w-full flex items-center justify-between gap-3 px-2.5 py-1.5 text-left text-sm text-basic-black hover:bg-basic-white transition-colors duration-150',
  first: 'rounded-t-lg',
  middle: '',
  last: 'rounded-b-lg',
};

export const AddButton: React.FC<AddButtonProps> = ({
  className,
  buttonText = 'Add',
  disabled = false,
  onAddTask,
  onAddClient,
  onAddFarm,
  onAddParcel,
  customOptions = [],
  useCustomOptions = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [popperInstance, setPopperInstance] = useState<Instance | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef(true);
  const router = useRouter();

  useEffect(() => {
    if (isOpen && buttonRef.current && dropdownRef.current) {
      const popper = createPopper(buttonRef.current, dropdownRef.current, {
        placement: 'bottom-start',
        modifiers: [
          { name: 'offset', options: { offset: [0, 8] } },
          { name: 'preventOverflow', options: { boundary: 'viewport' } },
          {
            name: 'flip',
            options: {
              fallbackPlacements: ['top-start', 'bottom-end', 'top-end'],
            },
          },
        ],
      });
      setPopperInstance(popper);
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (popperInstance) {
        popperInstance.destroy();
      }
    };
  }, [popperInstance]);

  useEffect(() => {
    if (!isOpen && popperInstance) {
      popperInstance.destroy();
      setPopperInstance(null);
    }
  }, [isOpen, popperInstance]);

  useEffect(() => {
    if (!isOpen) {
      const dropdown = document.querySelector(
        '[data-popper-placement="bottom-start"]'
      );
      if (dropdown) {
        dropdown.remove();
      }
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        dropdownRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleItemClick = useCallback(
    (item: (typeof DROPDOWN_ITEMS)[number]) => {
      setIsOpen(false);

      if (dropdownRef.current) {
        dropdownRef.current.style.display = 'none';
      }

      requestAnimationFrame(() => {
        if (item.id === 'client') {
          if (onAddClient) {
            onAddClient();
          } else {
            router.replace(item.path);
          }
        } else {
          const handlers = {
            task: onAddTask,
            farm: onAddFarm,
            parcel: onAddParcel,
          };

          const handler = handlers[item.id as keyof typeof handlers];

          if (handler) {
            handler();
          } else if (item.path) {
            router.replace(item.path);
          }
        }
      });
    },
    [onAddTask, onAddClient, onAddFarm, onAddParcel, router]
  );

  const handleCustomItemClick = useCallback(
    (item: { id: string; label: string; onClick: () => void }) => {
      item.onClick();
      setIsOpen(false);
    },
    []
  );

  const getButtonClassName = (index: number) => {
    const style =
      index === 0
        ? BUTTON_STYLES.first
        : index === DROPDOWN_ITEMS.length - 1
        ? BUTTON_STYLES.last
        : BUTTON_STYLES.middle;
    return cn(BUTTON_STYLES.base, style);
  };

  return (
    <>
      <div className={cn('relative', className)}>
        <Button
          ref={buttonRef}
          variant="complete"
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'gap-0 rounded-lg px-0',
            isOpen
              ? 'bg-[#004E3A] hover:bg-[#003d2e]'
              : 'bg-basic-green hover:bg-basic-green-dark'
          )}
        >
          <div className="flex items-center gap-2 px-3 py-2">
            <Icon icon="add" size="md" />
            <span className="text-sm">{buttonText}</span>
          </div>
          <div className="w-px h-9 bg-white" />
          <Icon icon="expand_all" size="sm" className="px-2" />
        </Button>
      </div>

      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            className="bg-white rounded-lg shadow-lg border border-gray-200 z-50"
            style={{
              zIndex: 9999,
              width: buttonRef.current?.offsetWidth || 'auto',
            }}
            data-popper-placement="bottom-start"
          >
            <div className="py-0">
              {useCustomOptions && customOptions.length > 0
                ? customOptions.map((item, index) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleCustomItemClick(item)}
                      className={getButtonClassName(index)}
                    >
                      <span>{item.label}</span>
                    </button>
                  ))
                : DROPDOWN_ITEMS.map((item, index) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleItemClick(item)}
                      className={getButtonClassName(index)}
                    >
                      <span>{item.label}</span>
                    </button>
                  ))}
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
