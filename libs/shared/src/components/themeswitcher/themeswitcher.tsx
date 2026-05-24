'use client';

import { useState, useEffect, useCallback } from 'react';
import { Toggle } from '../toggle/toggle';

export type Theme = 'light' | 'dark' | 'system';

type ThemeSwitcherProps = {
  darkModeClass?: string;
  initialTheme?: Theme;
  className?: string;
};

export function ThemeSwitcher({
  darkModeClass = 'dark',
  initialTheme = 'system',
  className,
  ...props
}: ThemeSwitcherProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme');
      if (
        storedTheme === 'light' ||
        storedTheme === 'dark' ||
        storedTheme === 'system'
      ) {
        return storedTheme;
      }
    }
    return initialTheme;
  });

  const getSystemTheme = useCallback((): 'light' | 'dark' => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    return 'light';
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const effectiveTheme = theme === 'system' ? getSystemTheme() : theme;

    if (effectiveTheme === 'dark') {
      root.classList.add(darkModeClass);
    } else {
      root.classList.remove(darkModeClass);
    }

    localStorage.setItem('theme', theme);
  }, [theme, darkModeClass, getSystemTheme]);

  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        const root = document.documentElement;
        if (mediaQuery.matches) {
          root.classList.add(darkModeClass);
        } else {
          root.classList.remove(darkModeClass);
        }
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    return undefined;
  }, [theme, darkModeClass]);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) =>
      prevTheme === 'light' || prevTheme === 'system' ? 'dark' : 'light'
    );
  }, []);

  const isDarkModeActive =
    theme === 'dark' || (theme === 'system' && getSystemTheme() === 'dark');

  return (
    <div className={className} {...props}>
      <Toggle
        checked={isDarkModeActive}
        onCheckedChange={toggleTheme}
        size="md"
        aria-label="Toggle dark mode"
        className={isDarkModeActive ? 'bg-basic-green' : 'bg-[#888BA152]'}
      />
    </div>
  );
}
