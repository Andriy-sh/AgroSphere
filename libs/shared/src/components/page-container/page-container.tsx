'use client';

import { usePathname } from 'next/navigation';

interface PageContainerProps {
  children: React.ReactNode;
}

export function PageContainer({ children }: PageContainerProps) {
  const pathname = usePathname();

  const pagesWithoutBorder = ['/settings', '/tasks', '/lab', '/'];

  const shouldShowBorder = pathname
    ? !pagesWithoutBorder.some((page) => pathname.startsWith(page))
    : true;

  const baseStyles = 'h-full bg-basic-white max-h-full rounded-xl';

  const conditionalStyles = shouldShowBorder
    ? `${baseStyles} border border-basic-white bg-basic-white`
    : baseStyles;

  return <div className={conditionalStyles}>{children}</div>;
}
