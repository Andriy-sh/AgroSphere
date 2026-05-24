'use client';
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { CollapsibleWithPercentage, Icon } from '@@agrosphere/shared';
import { SplitCard } from '@@agrosphere/shared';
import { Button } from '@@agrosphere/shared';
import { cn } from '@@agrosphere/shared';
import Link from 'next/link';

export interface SetupSubtask {
  id: string;
  title: string;
  isCompleted: boolean;
  actionText?: string;
  link?: string;
}

export interface SetupTask {
  id: string;
  title: string;
  percentage: number;
  isCompleted: boolean;
  subtasks?: SetupSubtask[];
}

export interface SetupChecklistProps {
  tasks: SetupTask[];
  onClose?: () => void;
  className?: string;
}

export function SetupChecklist({
  tasks,
  onClose,
  className,
}: SetupChecklistProps) {
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const allCompleted = tasks.every((task) => task.isCompleted);

    if (allCompleted) {
      setIsVisible(false);
      onClose?.();
    } else {
      const firstIncompleteTask = tasks.find((task) => !task.isCompleted);
      if (firstIncompleteTask) {
        setExpandedTasks(new Set([firstIncompleteTask.id]));
      }
    }
  }, [tasks, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  const getStatusIcon = (isCompleted: boolean) => {
    if (isCompleted) {
      return (
        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-basic-green">
          <Icon icon="check" size="sm" className="text-white" />
        </div>
      );
    }
    return <div className="w-5 h-5 rounded-full border-4 border-[#DBDEE8]" />;
  };

  if (!isVisible) {
    return null;
  }

  return (
    <SplitCard
      className={cn('w-full max-h-[370px] text-basic-black', className)}
      bottomClassName="flex-1 min-h-0 flex-shrink"
      topContent={
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold ">Setup checklist</h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-5 h-5 text-basic-gray" />
          </button>
        </div>
      }
      bottomContent={
        <div>
          {tasks.map((task, index) => {
            const isExpanded = expandedTasks.has(task.id);

            return (
              <div
                key={task.id}
                className={cn(
                  'border-b border-basic-white last:border-b-0',
                  index === 0 ? 'pt-0' : 'pt-4',
                  'pb-4 last:pb-0'
                )}
              >
                <CollapsibleWithPercentage
                  title={task.title}
                  percentage={task.percentage}
                  defaultOpen={isExpanded}
                  onOpenChange={(open: boolean) => {
                    if (open) {
                      setExpandedTasks((prev) => new Set(prev).add(task.id));
                    } else {
                      setExpandedTasks((prev) => {
                        const newSet = new Set(prev);
                        newSet.delete(task.id);
                        return newSet;
                      });
                    }
                  }}
                  className="bg-transparent"
                  statusIcon={getStatusIcon(task.isCompleted)}
                >
                  <div className="pl-7 pb-4 pt-5 last:pb-0">
                    <div className="space-y-2 text-basic-black">
                      {task.subtasks?.map((sub, index) => (
                        <div
                          key={sub.id}
                          className={cn(
                            'flex items-center justify-between',
                            sub.isCompleted && 'line-through text-basic-gray'
                          )}
                        >
                          <div className="flex items-center gap-1 flex-1">
                            <span className="text-sm font-medium">
                              {(index + 1).toString().padStart(2, '0')}.
                            </span>
                            <span className="text-sm">{sub.title}</span>
                          </div>
                          {sub.link && !sub.isCompleted && (
                            <Button
                              variant="link"
                              size="sm"
                              asChild
                              className="text-sm text-basic-green"
                            >
                              <Link
                                href={sub.link}
                                className="flex items-center gap-1 p-0 m-0"
                                style={{ padding: 0, margin: 0 }}
                              >
                                <span style={{ padding: 0, margin: 0 }}>
                                  {sub.actionText || 'Go'}
                                </span>
                                <Icon icon="chevron_right" />
                              </Link>
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CollapsibleWithPercentage>
              </div>
            );
          })}
        </div>
      }
    />
  );
}
