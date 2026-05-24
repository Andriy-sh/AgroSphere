import { Task } from '@/components/task/task';

export default async function TaskPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <Task taskId={id} />;
}
