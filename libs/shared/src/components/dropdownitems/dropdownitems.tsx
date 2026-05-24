'use client';

import { MoreVertical } from 'lucide-react';
import { cn } from '../../utils/cn';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { createPortal } from 'react-dom';
import { Icon } from '../icon';

export type DropdownActionItem = {
  id: string;
  label?: React.ReactNode;
  icon?: React.ReactNode | string;
  iconClassName?: string;
  onClick?: () => void;
  isDisabled?: boolean;
  isSeparator?: boolean;
  className?: string;
  rowClassName?: string;
  children?: DropdownActionItem[];
  customComponent?: React.ReactNode | ((close: () => void) => React.ReactNode);
  href?: string;
};

export type Placement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';

interface DropdownActionsNoLibProps
  extends React.HTMLAttributes<HTMLDivElement> {
  items: DropdownActionItem[];
  triggerIcon?: React.ReactNode;
  triggerClassName?: string;
  contentClassName?: string;
  rowClassName?: string;
  placement?: Placement;
  onOpenChange?: (isOpen: boolean) => void;
  isActive?: boolean;
  activeTriggerClassName?: string;
}

export const DropdownActionsNoLib: React.FC<DropdownActionsNoLibProps> = ({
  items,
  triggerIcon = <MoreVertical size={20} />,
  triggerClassName,
  contentClassName,
  className,
  placement = 'bottom-end',
  rowClassName,
  onOpenChange,
  isActive = false,
  activeTriggerClassName,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const submenuContainerRef = useRef<HTMLDivElement>(null);

  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [menuStyle, setMenuStyle] = useState<React.CSSProperties | undefined>();

  const [submenuForId, setSubmenuForId] = useState<string | null>(null);
  const [submenuStyle, setSubmenuStyle] = useState<
    React.CSSProperties | undefined
  >();
  const [clickedItems, setClickedItems] = useState<Set<string>>(new Set());

  const viewportPadding = 8;
  const verticalOffset = 8;
  const horizontalGap = 12;
  const submenuMinWidth = 160;

  const computeMenuPosition = useCallback(() => {
    if (!triggerRef.current || !menuRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const menuEl = menuRef.current;

    const prevVisibility = menuEl.style.visibility;
    const prevLeft = menuEl.style.left;
    const prevTop = menuEl.style.top;
    const prevPosition = menuEl.style.position;

    menuEl.style.visibility = 'hidden';
    menuEl.style.position = 'fixed';
    menuEl.style.left = '0px';
    menuEl.style.top = '0px';

    const { width: menuWidth, height: menuHeight } =
      menuEl.getBoundingClientRect();

    menuEl.style.visibility = prevVisibility;
    menuEl.style.left = prevLeft;
    menuEl.style.top = prevTop;
    menuEl.style.position = prevPosition;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const preferredTop = placement.startsWith('bottom')
      ? triggerRect.bottom + verticalOffset
      : triggerRect.top - verticalOffset - menuHeight;

    const preferredLeft = placement.endsWith('start')
      ? triggerRect.left
      : triggerRect.right - menuWidth;

    let top = preferredTop;
    let left = preferredLeft;

    if (placement.startsWith('bottom')) {
      if (
        top + menuHeight > vh - viewportPadding &&
        triggerRect.top - verticalOffset - menuHeight >= viewportPadding
      ) {
        top = triggerRect.top - verticalOffset - menuHeight;
      }
    } else {
      if (
        top < viewportPadding &&
        triggerRect.bottom + verticalOffset + menuHeight <= vh - viewportPadding
      ) {
        top = triggerRect.bottom + verticalOffset;
      }
    }

    if (top < viewportPadding) top = viewportPadding;
    if (top + menuHeight > vh - viewportPadding)
      top = Math.max(viewportPadding, vh - viewportPadding - menuHeight);

    if (left < viewportPadding) left = viewportPadding;
    if (left + menuWidth > vw - viewportPadding)
      left = Math.max(viewportPadding, vw - viewportPadding - menuWidth);

    setMenuStyle({ position: 'fixed', top, left, zIndex: 99999 });
  }, [placement]);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setHoveredItemId(null);
    setSubmenuForId(null);
    setClickedItems(new Set());
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    setHoverTimeout(null);
    onOpenChange?.(false);
  }, [hoverTimeout, onOpenChange]);

  useEffect(() => {
    if (!isOpen) return;

    const onResize = () => computeMenuPosition();
    const onScroll = () => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) {
        closeMenu();
      } else {
        computeMenuPosition();
      }
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll, true);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [isOpen, computeMenuPosition]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const clickedInsideMenu = !!(
        menuRef.current && menuRef.current.contains(target)
      );
      const clickedTrigger = !!(
        triggerRef.current && triggerRef.current.contains(target)
      );
      const clickedInsideSubmenu = !!(
        submenuContainerRef.current &&
        submenuContainerRef.current.contains(target)
      );

      if (!clickedInsideMenu && !clickedTrigger && !clickedInsideSubmenu) {
        closeMenu();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openSubmenuForItem = useCallback((itemId: string) => {
    const itemEl = itemRefs.current[itemId];
    if (!itemEl) return;

    const itemRect = itemEl.getBoundingClientRect();

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const tmp = document.createElement('div');
    tmp.style.position = 'fixed';
    tmp.style.visibility = 'hidden';
    tmp.style.left = '0px';
    tmp.style.top = '0px';
    tmp.style.minWidth = `${submenuMinWidth}px`;
    tmp.className = 'min-w-[160px]';
    document.body.appendChild(tmp);
    const { width: sw, height: sh } = tmp.getBoundingClientRect();
    document.body.removeChild(tmp);

    let left = itemRect.right + horizontalGap;
    let top = itemRect.top;

    if (left + sw > vw - viewportPadding) {
      left = itemRect.left - horizontalGap - sw;
      if (left < viewportPadding) {
        left = Math.max(viewportPadding, vw - viewportPadding - sw);
      }
    }

    if (top + sh > vh - viewportPadding) {
      top = Math.max(viewportPadding, vh - viewportPadding - sh);
    }
    if (top < viewportPadding) top = viewportPadding;

    setSubmenuForId(itemId);
    setSubmenuStyle({ position: 'fixed', left, top, zIndex: 99999 });
  }, []);

  const handleItemMouseEnter = (itemId: string, hasChildren: boolean) => {
    if (!hasChildren) return;
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setHoveredItemId(itemId);
    if (clickedItems.size > 0) {
      setClickedItems(new Set());
    }
    if (submenuForId && submenuForId !== itemId) {
      setSubmenuForId(null);
    }
    requestAnimationFrame(() => openSubmenuForItem(itemId));
  };

  const handleItemMouseLeave = (hasChildren: boolean, itemId: string) => {
    if (!hasChildren) return;
    if (clickedItems.has(itemId)) return;

    const timeout = setTimeout(() => {
      setHoveredItemId(null);
      setSubmenuForId(null);
    }, 150);
    setHoverTimeout(timeout);
  };

  const handleItemClick = (
    itemId: string,
    hasChildren: boolean,
    onClick?: () => void
  ) => {
    if (hasChildren) {
      setClickedItems((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(itemId)) {
          newSet.delete(itemId);
          setSubmenuForId(null);
        } else {
          newSet.clear();
          newSet.add(itemId);
          setSubmenuForId(itemId);
          requestAnimationFrame(() => openSubmenuForItem(itemId));
        }
        return newSet;
      });
    } else {
      onClick?.();
      setIsOpen(false);
      setClickedItems(new Set());
    }
  };

  const renderIcon = (
    icon: React.ReactNode | string,
    iconClassName?: string
  ) => {
    if (typeof icon === 'string') {
      return <Icon className={cn('', iconClassName)} icon={icon} />;
    }
    return icon;
  };

  const getVisibleItemsCount = () => {
    return items.filter(
      (item) => !item.isSeparator && !item.className?.includes('hidden')
    ).length;
  };

  const renderItem = (item: DropdownActionItem) => {
    if (item.isSeparator) {
      return (
        <div key={item.id} className="h-px bg-gray-200" role="separator" />
      );
    }
    if (item.customComponent) {
      return (
        <div key={item.id}>
          {typeof item.customComponent === 'function'
            ? item.customComponent(() => setIsOpen(false))
            : item.customComponent}
        </div>
      );
    }

    const hasChildren = !!(item.children && item.children.length > 0);
    const isHovered = hoveredItemId === item.id;
    const isClicked = clickedItems.has(item.id);

    return item.href ? (
      <Link
        key={item.id}
        href={item.href}
        className={cn(
          'flex items-center w-full rounded-lg text-sm font-medium transition',
          'text-basic-black hover:bg-gray-100 focus:bg-gray-100 underline focus:outline-none',
          item.isDisabled && 'opacity-50 cursor-not-allowed',
          item.className
        )}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(false);
        }}
      >
        {item.icon && (
          <span className="flex-shrink-0">
            {renderIcon(item.icon, item.iconClassName)}
          </span>
        )}
        <span
          className={cn(
            'flex-1 min-w-0 overflow-hidden whitespace-nowrap text-left',
            rowClassName
          )}
          style={{ textOverflow: 'ellipsis' }}
        >
          {item.label}
        </span>
      </Link>
    ) : (
      <div
        key={item.id}
        className="relative"
        ref={(el) => {
          itemRefs.current[item.id] = el;
        }}
      >
        <button
          className={cn(
            'flex items-center w-full text-sm font-medium transition rounded-md py-1.5 gap-2 px-1',
            'text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none',
            item.isDisabled && 'opacity-50 cursor-not-allowed',
            item.className,
            item.className?.includes('text-red-600') &&
              'hover:bg-red-50 focus:bg-red-50 focus:outline-none',
            'cursor-pointer'
          )}
          disabled={item.isDisabled}
          onClick={(e) => {
            e.stopPropagation();
            if (!item.isDisabled) {
              handleItemClick(item.id, hasChildren, item.onClick);
            }
          }}
          onMouseEnter={() => handleItemMouseEnter(item.id, hasChildren)}
          onMouseLeave={() => handleItemMouseLeave(hasChildren, item.id)}
        >
          {item.icon && renderIcon(item.icon, item.iconClassName)}
          <span
            className={cn(
              'flex-1 min-w-0 overflow-hidden whitespace-nowrap text-left',
              rowClassName
            )}
            style={{ textOverflow: 'ellipsis' }}
          >
            {item.label}
          </span>
          {hasChildren && (
            <span className="material-symbols-outlined text-sm ml-2">
              chevron_right
            </span>
          )}
        </button>

        {hasChildren &&
          (isHovered || isClicked) &&
          submenuForId === item.id &&
          createPortal(
            <div
              ref={submenuContainerRef}
              className={cn(
                'bg-white border border-basic-white rounded-xl min-w-[160px] shadow-xl',
                'focus:outline-none'
              )}
              style={submenuStyle}
              onClick={(e) => {
                e.stopPropagation();
                if (e.target === e.currentTarget) {
                  setSubmenuForId(null);
                  setClickedItems(new Set());
                }
              }}
              onMouseDown={(e) => e.stopPropagation()}
              onMouseEnter={() => {
                if (hoverTimeout) {
                  clearTimeout(hoverTimeout);
                  setHoverTimeout(null);
                }
              }}
              onMouseLeave={() => {
                if (!clickedItems.has(item.id)) {
                  const timeout = setTimeout(() => {
                    setHoveredItemId(null);
                    setSubmenuForId(null);
                  }, 150);
                  setHoverTimeout(timeout);
                }
              }}
            >
              <div
                className={cn(
                  'flex flex-col p-2',
                  item.children?.filter(
                    (childItem) =>
                      !childItem.isSeparator &&
                      !childItem.className?.includes('hidden')
                  ).length &&
                    item.children.filter(
                      (childItem) =>
                        !childItem.isSeparator &&
                        !childItem.className?.includes('hidden')
                    ).length > 1 &&
                    'gap-1'
                )}
              >
                {item.children?.map((childItem) => {
                  if (childItem.isSeparator) {
                    return (
                      <div
                        key={childItem.id}
                        className="h-px bg-gray-200"
                        role="separator"
                      />
                    );
                  }
                  if (childItem.customComponent) {
                    return (
                      <div key={childItem.id}>
                        {typeof childItem.customComponent === 'function'
                          ? childItem.customComponent(() => setIsOpen(false))
                          : childItem.customComponent}
                      </div>
                    );
                  }

                  return childItem.href ? (
                    <Link
                      key={childItem.id}
                      href={childItem.href}
                      className={cn(
                        'flex items-center w-full rounded-lg text-sm font-medium transition',
                        'text-basic-black hover:bg-gray-100 focus:bg-gray-100 underline focus:outline-none',
                        childItem.isDisabled && 'opacity-50 cursor-not-allowed',
                        childItem.className
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(false);
                        setHoveredItemId(null);
                        setSubmenuForId(null);
                        setClickedItems(new Set());
                        if (hoverTimeout) {
                          clearTimeout(hoverTimeout);
                          setHoverTimeout(null);
                        }
                      }}
                    >
                      {childItem.icon && (
                        <span className="flex-shrink-0">
                          {renderIcon(childItem.icon, childItem.iconClassName)}
                        </span>
                      )}
                      <span
                        className="flex-1 min-w-0 overflow-hidden whitespace-nowrap text-left"
                        style={{ textOverflow: 'ellipsis' }}
                      >
                        {childItem.label}
                      </span>
                    </Link>
                  ) : (
                    <button
                      key={childItem.id}
                      className={cn(
                        'flex items-center gap-2 w-full text-sm font-medium transition rounded-md py-1.5',
                        'text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none',
                        childItem.isDisabled && 'opacity-50 cursor-not-allowed',
                        childItem.className,
                        childItem.className?.includes('text-red-600') &&
                          'hover:bg-red-50 focus:bg-red-50 focus:outline-none',
                        'cursor-pointer'
                      )}
                      disabled={childItem.isDisabled}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!childItem.isDisabled) {
                          childItem.onClick?.();
                          setIsOpen(false);
                          setHoveredItemId(null);
                          setSubmenuForId(null);
                          setClickedItems(new Set());
                          if (hoverTimeout) {
                            clearTimeout(hoverTimeout);
                            setHoverTimeout(null);
                          }
                        }
                      }}
                    >
                      {childItem.icon &&
                        renderIcon(childItem.icon, childItem.iconClassName)}
                      <span
                        className="flex-1 min-w-0 overflow-hidden whitespace-nowrap text-left"
                        style={{ textOverflow: 'ellipsis' }}
                      >
                        {childItem.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>,
            document.body
          )}
      </div>
    );
  };

  return (
    <div
      className={cn('relative inline-block', className)}
      style={{ position: 'relative' }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      {...props}
    >
      <button
        ref={triggerRef}
        className={cn(
          'flex items-center justify-center p-1 rounded-full',
          'text-gray-400  hover:text-basic-gray',
          'focus:outline-none',
          triggerClassName,
          (isOpen || isActive) && activeTriggerClassName
        )}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => {
            const newIsOpen = !prev;
            if (newIsOpen) {
              if (hoverTimeout) {
                clearTimeout(hoverTimeout);
                setHoverTimeout(null);
              }
              setTimeout(() => computeMenuPosition(), 0);
            }
            onOpenChange?.(newIsOpen);
            return newIsOpen;
          });
        }}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        {triggerIcon}
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            className={cn(
              'min-w-[160px] bg-white rounded-xl border border-basic-white shadow-xl',
              'focus:outline-none',
              contentClassName
            )}
            role="menu"
            style={menuStyle}
            onClick={(e) => {
              e.stopPropagation();
              if (e.target === e.currentTarget) {
                closeMenu();
              }
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div
              className={cn(
                'flex flex-col p-2',
                getVisibleItemsCount() > 1 && 'gap-1'
              )}
            >
              {items.map(renderItem)}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
