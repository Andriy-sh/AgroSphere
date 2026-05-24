'use client';
import { useState, useCallback } from 'react';
import { TaskDetails, TaskType } from '../api/services/tasks/task-types';

export interface TaskAction {
  type: 'accept' | 'decline';
  taskId: string;
  previousStatus: string;
}

export function useTaskActions() {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [lastAction, setLastAction] = useState<TaskAction | null>(null);

  const handleAcceptTask = useCallback(
    (id: string) => {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;

      const lastActionData: TaskAction = {
        type: 'accept',
        taskId: id,
        previousStatus: task.status,
      };

      setLastAction(lastActionData);

      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, status: 'not_started' } : task
        )
      );

      return lastActionData;
    },
    [tasks]
  );

  const handleDeclineTask = useCallback(
    (id: string) => {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;

      const lastActionData: TaskAction = {
        type: 'decline',
        taskId: id,
        previousStatus: task.status,
      };

      setLastAction(lastActionData);

      setTasks((prev) =>
        prev.map((task) =>
          task.id === id
            ? {
                ...task,
                task_has_not_started_test: false,
                status: 'cancelled',
              }
            : task
        )
      );

      return lastActionData;
    },
    [tasks]
  );

  const handleUndoAction = useCallback(() => {
    if (!lastAction) return;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === lastAction.taskId
          ? { ...task, status: lastAction.previousStatus as TaskType['status'] }
          : task
      )
    );

    setLastAction(null);
  }, [lastAction]);

  const handleUndoActionWithData = useCallback((actionData: TaskAction) => {
    if (!actionData) return;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === actionData.taskId
          ? { ...task, status: actionData.previousStatus as TaskType['status'] }
          : task
      )
    );

    setLastAction(null);
  }, []);

  const handleUpdateStatus = useCallback(
    (
      id: string,
      status:
        | 'pending'
        | 'in_progress'
        | 'complete'
        | 'cancelled'
        | 'Not Started'
        | 'not_started'
    ) => {
      setTasks((prev: TaskType[]) =>
        prev.map((task): TaskType => {
          if (task.id === id) {
            return { ...task, status } as TaskType;
          }
          return task;
        })
      );
    },
    []
  );

  const handleUpdatePriority = useCallback(
    (id: string, flag: 'normal' | 'high' | 'none') => {
      setTasks((prev) =>
        prev.map((task) => {
          if (task.id === id) {
            if (flag === 'high') {
              return {
                ...task,
                task_has_unmatched_samples: true,
                task_has_tests_without_lab_result: true,
                task_has_not_started_test: false,
              };
            } else if (flag === 'none') {
              return {
                ...task,
                task_has_unmatched_samples: false,
                task_has_tests_without_lab_result: false,
                task_has_not_started_test: true,
              };
            } else {
              return {
                ...task,
                task_has_unmatched_samples: false,
                task_has_tests_without_lab_result: false,
                task_has_not_started_test: false,
              };
            }
          }
          return task;
        })
      );
    },
    []
  );

  const handleDeleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  const handleUpdateTask = useCallback(
    (id: string, updates: Partial<TaskType>) => {
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
      );
    },
    []
  );

  const handleDuplicateTask = useCallback(
    (id: string) => {
      const originalTask = tasks.find((t) => t.id === id);
      if (!originalTask) return;

      const newId = (tasks.length + 1).toString();

      const duplicatedTask: TaskType = {
        ...originalTask,
        id: newId,
        task_number: `S-${newId}`,
        status: 'pending',
        complete_by: '',
      };

      setTasks((prev) => [...prev, duplicatedTask]);
      return duplicatedTask;
    },
    [tasks]
  );

  const setInitialTasks = useCallback((initialTasks: TaskType[]) => {
    setTasks(initialTasks);
  }, []);

  return {
    tasks,
    lastAction,
    handleAcceptTask,
    handleDeclineTask,
    handleUndoAction,
    handleUndoActionWithData,
    handleUpdateStatus,
    handleUpdatePriority,
    handleDeleteTask,
    handleUpdateTask,
    handleDuplicateTask,
    setInitialTasks,
  };
}
