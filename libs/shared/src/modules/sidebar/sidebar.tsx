'use client';
import React, { useState, useRef, useEffect } from 'react';
import { LogOut, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { Avatar } from '../../components/avatar/avatar';

export function Sidebar() {
  const [width, setWidth] = useState(256);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef(false);

  const minWidth = 64;
  const maxWidth = 256;

  const isOpen = width > minWidth + 10;

  const onMouseDown = (e: React.MouseEvent) => {
    isResizing.current = true;
    e.preventDefault();
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isResizing.current) return;

    let newWidth = e.clientX;
    if (newWidth < minWidth) newWidth = minWidth;
    if (newWidth > maxWidth) newWidth = maxWidth;

    setWidth(newWidth);
  };

  const onMouseUp = () => {
    if (isResizing.current) {
      isResizing.current = false;
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return (
    <div
      ref={sidebarRef}
      style={{ width }}
      className={`h-screen bg-black sticky top-0 text-white flex flex-col justify-between  `}
    >
      <div
        className={`p-2 flex flex-col gap-4 relative ${
          !isOpen ? 'items-center' : ''
        }`}
      >
        <div className="flex text-center items-center relative">
          <div className="flex items-center gap-2">
            <div className="bg-green-600 p-2 rounded-xl">
              <div className="w-4 h-4 bg-white rounded-full" />
            </div>
            {isOpen && <h1 className="text-lg font-bold">AgroSphere</h1>}
          </div>

          {isOpen && (
            <button
              onClick={() => setWidth(minWidth)}
              className="absolute right-0 -top-1 p-1 hover:bg-zinc-800 rounded"
            >
              <PanelRightClose size={24} />
            </button>
          )}
        </div>

        {!isOpen && (
          <button
            onClick={() => setWidth(maxWidth)}
            className="flex bg-zinc-900 hover:bg-zinc-800 text-white p-2 rounded-md mx-auto"
          >
            <PanelRightOpen size={44} />
          </button>
        )}
      </div>

      <div className="p-2 flex flex-col gap-2 text-sm text-basic-gray">
        <div
          className={`flex items-center gap-3 px-4 py-2 hover:bg-zinc-800 rounded-md cursor-pointer justify-between border-t border-zinc-800 pt-4`}
        >
          <div className="flex items-center gap-2 max-w-full">
            <Avatar
              row={{
                original: {
                  client: {
                    name: 'Robert',
                    surname: 'Fox',
                    avatarSrc: 'https://i.pravatar.cc/40?img=3',
                  },
                },
              }}
              size="sm"
              rounded="md"
            />
            {isOpen && (
              <span className="text-sm font-medium overflow-hidden whitespace-nowrap text-ellipsis max-w-[150px]">
                Robert Fox
              </span>
            )}
          </div>
          {isOpen && <LogOut size={16} className="text-gray-400" />}
        </div>
      </div>

      <div
        onMouseDown={onMouseDown}
        style={{ cursor: 'ew-resize' }}
        className="absolute top-0 right-0 h-full w-1 bg-zinc-700 hover:bg-zinc-500 select-none"
      />
    </div>
  );
}
