'use client';
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../utils/cn';

interface CustomScrollbarProps {
  children: React.ReactNode;
  className?: string;
  scrollbarClassName?: string;
  thumbClassName?: string;
  showOnHover?: boolean;
}

export const CustomScrollbar: React.FC<CustomScrollbarProps> = ({
  children,
  className,
  scrollbarClassName,
  thumbClassName,
  showOnHover = true,
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [clientHeight, setClientHeight] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollbarRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const startScrollTop = useRef(0);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const updateScrollInfo = () => {
      setScrollTop(container.scrollTop);
      setScrollHeight(container.scrollHeight);
      setClientHeight(container.clientHeight);
    };

    updateScrollInfo();
    container.addEventListener('scroll', updateScrollInfo);
    window.addEventListener('resize', updateScrollInfo);

    return () => {
      container.removeEventListener('scroll', updateScrollInfo);
      window.removeEventListener('resize', updateScrollInfo);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollbarRef.current) return;

    isDragging.current = true;
    startY.current = e.clientY;
    startScrollTop.current = scrollTop;

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current || !scrollContainerRef.current) return;

    const deltaY = e.clientY - startY.current;
    const scrollRatio = deltaY / (clientHeight - 40);
    const newScrollTop =
      startScrollTop.current + scrollRatio * (scrollHeight - clientHeight);

    scrollContainerRef.current.scrollTop = Math.max(
      0,
      Math.min(newScrollTop, scrollHeight - clientHeight)
    );
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const scrollToPosition = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const scrollRatio = clickY / rect.height;
    const newScrollTop = scrollRatio * (scrollHeight - clientHeight);

    scrollContainerRef.current.scrollTop = newScrollTop;
  };

  const scrollbarHeight = Math.max(
    40,
    (clientHeight / scrollHeight) * clientHeight
  );
  const scrollbarTop =
    scrollHeight > clientHeight
      ? (scrollTop / (scrollHeight - clientHeight)) *
        (clientHeight - scrollbarHeight)
      : 0;

  const showScrollbar = scrollHeight > clientHeight;
  const shouldShowScrollbar = showScrollbar && (!showOnHover || isHovered);

  return (
    <div
      className={cn('relative', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        ref={scrollContainerRef}
        className="h-full overflow-y-auto scrollbar-hide"
      >
        {children}
      </div>

      {showScrollbar && (
        <div
          className={cn(
            'absolute top-0 right-0 w-2 h-full bg-gray-100 rounded-full',
            shouldShowScrollbar ? 'opacity-100' : 'opacity-0',
            scrollbarClassName
          )}
          onMouseDown={scrollToPosition}
        >
          <div
            ref={scrollbarRef}
            className={cn(
              'w-2 bg-gray-300 rounded-full cursor-pointer hover:bg-gray-400',
              isDragging.current && 'bg-gray-500',
              thumbClassName
            )}
            style={{
              height: scrollbarHeight,
              transform: `translateY(${scrollbarTop}px)`,
            }}
            onMouseDown={handleMouseDown}
          />
        </div>
      )}
    </div>
  );
};
