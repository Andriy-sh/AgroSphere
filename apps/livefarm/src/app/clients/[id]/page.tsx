import { Client } from '@/components/client/client';

export default function ClientPage({ params }: { params: { id: string } }) {
  return <Client clientId={params.id} />;
}
