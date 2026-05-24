'use client';
import React, { useEffect, useRef, useState } from 'react';

interface AdaptiveTagsProps {
  tags: string[];
}

export const AdaptiveTags: React.FC<AdaptiveTagsProps> = ({ tags }) => {
  const [visibleCount, setVisibleCount] = useState(tags.length);
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const widthsRef = useRef<number[]>([]);

  useEffect(() => {
    const calc = async () => {
      const widths = await Promise.all(
        tags.map((tag) => {
          return new Promise<number>((resolve) => {
            const span = document.createElement('span');
            span.className =
              'px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full whitespace-nowrap';
            span.style.position = 'absolute';
            span.style.visibility = 'hidden';
            span.textContent = tag;
            document.body.append(span);
            const w = span.offsetWidth + 4;
            document.body.removeChild(span);
            resolve(w);
          });
        })
      );
      widthsRef.current = widths;
      updateVisible();
    };
    calc();

    const resizeObserver = new ResizeObserver(() => {
      updateVisible();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener('resize', updateVisible);

    return () => {
      window.removeEventListener('resize', updateVisible);
      resizeObserver.disconnect();
    };
  }, [tags]);

  useEffect(() => {
    if (widthsRef.current.length > 0) {
      updateVisible();
    }
  }, [visibleCount, isExpanded]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  const updateVisible = () => {
    requestAnimationFrame(() => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const maxW = rect.width;
      const widths = widthsRef.current;

      if (widths.length === 0) return;

      let total = 0,
        count = 0;
      let needOverflow = false;

      for (const w of widths) {
        if (total + w > maxW) {
          needOverflow = true;
          break;
        }
        total += w;
        count++;
      }

      if (!needOverflow) {
        setVisibleCount(tags.length);
        return;
      }

      if (tags.length === 1) {
        const singleTagWidth = widths[0];
        if (singleTagWidth <= maxW - 60) {
          setVisibleCount(1);
        } else {
          setVisibleCount(0);
        }
        return;
      }

      total = 0;
      count = 0;
      const available = maxW - 60;
      for (const w of widths) {
        if (total + w > available) break;
        total += w;
        count++;
      }

      setVisibleCount(count);
    });
  };

  const hiddenTags = tags.slice(visibleCount);
  const hasHidden = hiddenTags.length > 0;

  return (
    <div className="relative w-full">
      <div
        ref={containerRef}
        className="flex items-center gap-1 flex-wrap min-w-0 w-full"
      >
        {tags.map((tag, i) => (
          <span
            key={i}
            className={`px-2 py-1 bg-basic-white text-basic-black text-xs font-normal rounded-sm whitespace-nowrap ${
              i >= visibleCount ? 'hidden' : ''
            }`}
          >
            {tag}
          </span>
        ))}
        {hasHidden && (
          <span className="px-2 py-1 bg-basic-white text-basic-black text-xs font-normal rounded-sm">
            +{hiddenTags.length}
          </span>
        )}
        {hasHidden && (
          <div className="relative" ref={dropdownRef}>
            <span
              className="material-symbols-outlined text-basic-gray text-lg border border-basic-white rounded-sm px-1 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? 'Hide all zones' : 'Show all zones'}
            >
              my_location
            </span>
            {isExpanded && (
              <div className="absolute top-full right-0 mt-2 bg-white border border-basic-gray shadow-xl p-4 z-[9999] rounded-sm w-64 max-h-64">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-semibold text-basic-black">
                    Hidden zones
                  </div>
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="p-1 rounded-sm text-basic-gray hover:bg-basic-gray-light hover:text-basic-black transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg px-1">
                      close
                    </span>
                  </button>
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto overflow-x-hidden custom-scrollbar">
                  {hiddenTags.map((tag, i) => (
                    <div
                      key={i}
                      className="px-3 py-2 bg-basic-white text-basic-gray text-sm font-normal rounded-sm hover:bg-gray-200 transition-colors cursor-default truncate"
                      title={tag}
                    >
                      {tag}
                    </div>
                  ))}
                </div>
                <div className=" pt-3 border-t border-basic-border-gray">
                  <div className="text-xs text-basic-gray">
                    {hiddenTags.length} hidden zone
                    {hiddenTags.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
