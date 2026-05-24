'use client';
import { useCallback, useRef, useEffect } from 'react';
import { useSidebarStore } from '../stores/useSidebarStore';

const MIN_WIDTH = 76;
const MAX_WIDTH = 256;

export function useSidebar() {
  const { width, isOpen, setWidth } = useSidebarStore();
  const isResizing = useRef(false);

  const onMouseDown = useCallback(() => {
    isResizing.current = true;
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
  }, []);

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing.current) return;
      let newWidth = e.clientX;
      newWidth = Math.max(MIN_WIDTH, Math.min(newWidth, MAX_WIDTH));
      setWidth(newWidth);
    },
    [setWidth]
  );

  const onMouseUp = useCallback(() => {
    isResizing.current = false;
    document.body.style.cursor = 'default';
    document.body.style.userSelect = 'auto';
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  return {
    width,
    isOpen,
    onMouseDown,
  };
}
