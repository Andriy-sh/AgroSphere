import { CreateTask } from '@/components/createTask/createTask';
import { Suspense } from 'react';

export default function CreateTaskPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-full">
          <div>Loading...</div>
        </div>
      }
    >
      <CreateTask />
    </Suspense>
  );
}
