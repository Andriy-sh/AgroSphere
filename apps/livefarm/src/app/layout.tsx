import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './global.css';
import { LayoutWrapper } from './LayoutWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LiveFarm - Farm Management Platform',
  description:
    'Comprehensive farm management platform for modern agriculture. Manage tasks, teams, clients, and farm operations efficiently.',
  keywords:
    'farm management, agriculture, task management, team collaboration, farm operations',
  authors: [{ name: 'LiveFarm Team' }],
  creator: 'LiveFarm',
  publisher: 'LiveFarm',
  robots: 'index, follow',
  openGraph: {
    title: 'LiveFarm - Farm Management Platform',
    description:
      'Comprehensive farm management platform for modern agriculture.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LiveFarm - Farm Management Platform',
    description:
      'Comprehensive farm management platform for modern agriculture.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#00AF4D',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full max-h-full">
      <body className={`h-full max-h-full ${inter.className}`}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
