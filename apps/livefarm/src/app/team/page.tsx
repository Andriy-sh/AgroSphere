import { Suspense } from 'react';
import { Metadata } from 'next';
import TeamPage from '@/components/team/team';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Team Management - LiveFarm',
  description:
    'Manage your team members, roles, and connections in the LiveFarm platform.',
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TeamPage />
    </Suspense>
  );
}
