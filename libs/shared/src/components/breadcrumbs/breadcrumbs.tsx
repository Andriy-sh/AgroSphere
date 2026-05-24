import React from 'react';
import { cn } from '../../utils/cn';
import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  className?: string;
  linkClassName?: string;
  activeClassName?: string;
  separatorClassName?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  separator = '/',
  className,
  linkClassName,
  activeClassName,
  separatorClassName,
}) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="breadcrumb"
      className={cn('text-gray-500 text-sm', className)}
    >
      <ol className="flex items-center">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className={cn(
                    'hover:text-basic-green transition-colors duration-200',
                    linkClassName
                  )}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    isLast ? 'text-gray-700 font-medium' : '',
                    activeClassName
                  )}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}

              {!isLast && (
                <span className={cn('mx-2 text-gray-400', separatorClassName)}>
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
