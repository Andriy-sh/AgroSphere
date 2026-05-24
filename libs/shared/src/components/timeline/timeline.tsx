'use client';
import  { useState } from 'react';
import {
  Gantt,
  Task,
  ViewMode,
} from '@wamra/gantt-task-react';
import '@wamra/gantt-task-react/dist/style.css';
import { mockTasks } from '../../mock/mock-tasks-details';
import './timeline.css';

function getInitials(name: string) {
  if (!name) return '';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

function mapTaskDetailsToGanttTask(task: any): Task {
  return {
    id: String(task.id),
    type: 'task',
    name: ` #${task.id} ${task.task_type || 'Task'}`,
    comparisonLevel: 1,
    dependencies: [],
    displayOrder: 0,
    hideChildren: false,
    isDisabled: false,
    isRelationDisabled: false,
    start: new Date(task.date),
    end: new Date(task.complete_by || task.date),
    progress: 0,
    assignees: [getInitials(task.soil_sampler || task.farmer_name)],
    styles: {
      barBackgroundColor: '#fff',
      barBackgroundSelectedColor: '#EEF0F6',
    },
  };
}

const tasksRaw: Task[] = mockTasks.map(mapTaskDetailsToGanttTask);
const customLabelById = new Map<
  string,
  { id: string; type: string; flagVariant: 'normal' | 'urgent' | 'none' }
>();
tasksRaw.forEach((task, i) => {
  let flagVariant: 'normal' | 'urgent' | 'none' = 'normal';
  if (
    mockTasks[i].task_has_unmatched_samples ||
    mockTasks[i].task_has_tests_without_lab_result
  ) {
    flagVariant = 'urgent';
  }
  customLabelById.set(task.id, {
    id: task.id,
    type: task.name.replace(/^#\d+\s*/, ''),
    flagVariant,
  });
});

export function Timeline({
  initialViewMode = ViewMode.Day,
  initialDate = new Date(),
}) {
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);
  const [viewDate] = useState<Date>(initialDate);

  const modes = [
    { label: 'Hour', value: ViewMode.Hour },
    { label: 'Day', value: ViewMode.Day },
    { label: 'Week', value: ViewMode.Week },
    { label: 'Month', value: ViewMode.Month },
    { label: 'Quarter', value: ViewMode.QuarterYear },
    { label: 'Year', value: ViewMode.Year },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-10 bg-white flex items-center justify-between mb-2 py-2 px-4">
        <div className="flex gap-2 bg-[#EEF0F6] p-1 rounded-lg">
          {modes.map((mode) => (
            <button
              key={mode.value}
              className={`px-3 py-1 rounded ${
                viewMode === mode.value
                  ? 'bg-[#FFFFFF] text-black'
                  : 'text-[#818D99]'
              }`}
              onClick={() => setViewMode(mode.value)}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <Gantt
          tasks={tasksRaw}
          canMoveTasks={false}
          columns={[]}
          viewMode={viewMode}
          viewDate={viewDate}
          onDateChange={() => false}
          colors={{
            todayColor: '#EEF0F6',
          }}
          enableTableListContextMenu={1}
        />
      </div>
    </div>
  );
}
