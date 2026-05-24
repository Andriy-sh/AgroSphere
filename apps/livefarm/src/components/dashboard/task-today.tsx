'use client';

import React from 'react';
import { ArrowRight, Plus } from 'lucide-react';
import { SplitCard, TaskStatus } from '@@agrosphere/shared';
import { Flag } from '@@agrosphere/shared';
import { Avatar } from '@@agrosphere/shared';
import { StatusIndicator } from '@@agrosphere/shared';
import { NoResultsFound } from '@@agrosphere/shared';
import { Button } from '@@agrosphere/shared';
import { cn } from '@@agrosphere/shared';
import {
  TaskDropdownActions,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from '@@agrosphere/shared';

interface AssignedUser {
  name: string;
  initials: string;
  avatarSrc?: string;
}

interface ClientUser {
  name: string;
  initials: string;
  avatarSrc?: string;
}

interface Task {
  id: string;
  title: string;
  flag: 'high' | 'normal' | 'none';
  clientUsers: ClientUser[];
  assignedUsers: AssignedUser[];
  dueDate: string;
  status:
    | 'pending'
    | 'in_progress'
    | 'complete'
    | 'cancelled'
    | 'not_started'
    | 'assigned'
    | 'priority-normal'
    | 'received'
    | 'testing'
    | 'unknown'
    | 'overdue';
}

interface TaskTodayProps {
  className?: string;
  tasks?: Task[];
  onViewAllTasks?: () => void;
  onViewTask?: (taskId: string) => void;
  onEditTask?: (taskId: string) => void;
  onDeleteTask?: (taskId: string) => void;
  onCreateTask?: () => void;
  onAcceptTask?: (taskId: string) => void;
  onDeclineTask?: (taskId: string) => void;
  onUpdateStatus?: (
    taskId: string,
    status:
      | 'pending'
      | 'in_progress'
      | 'complete'
      | 'cancelled'
      | 'Not Started'
      | 'not_started'
  ) => void;
  onUpdatePriority?: (taskId: string, flag: 'normal' | 'high' | 'none') => void;
  onDuplicateTask?: (taskId: string) => void;
  onViewOnMap?: (taskId: string) => void;
  onViewDetails?: (taskId: string) => void;
}

const mockTasks: Task[] = [
  {
    id: '120',
    title: 'Soil sampling',
    flag: 'high',
    clientUsers: [
      {
        name: 'Green Valley Farm',
        initials: 'G',
        avatarSrc: undefined,
      },
    ],
    assignedUsers: [
      {
        name: 'John Smith',
        initials: 'J',
        avatarSrc: undefined,
      },
    ],
    dueDate: 'Aug 11',
    status: 'in_progress',
  },
  {
    id: '124',
    title: 'Pesticide spraying',
    flag: 'normal',
    clientUsers: [
      {
        name: 'Sunrise Agriculture',
        initials: 'A',
        avatarSrc: undefined,
      },
    ],
    assignedUsers: [
      {
        name: 'Mike Wilson',
        initials: 'P',
        avatarSrc: undefined,
      },
    ],
    dueDate: 'Aug 11',
    status: 'pending',
  },
  {
    id: '129',
    title: 'Drainage inspection',
    flag: 'high',
    clientUsers: [
      {
        name: 'Riverside Farms',
        initials: 'D',
        avatarSrc: undefined,
      },
    ],
    assignedUsers: [
      {
        name: 'Alex Brown',
        initials: 'P',
        avatarSrc: undefined,
      },
    ],
    dueDate: 'Aug 11',
    status: 'in_progress',
  },
  {
    id: '131',
    title: 'Equipment maintenance',
    flag: 'high',
    clientUsers: [
      {
        name: 'Meadowbrook Ranch',
        initials: 'D',
        avatarSrc: undefined,
      },
    ],
    assignedUsers: [
      {
        name: 'Sarah Johnson',
        initials: 'P',
        avatarSrc: undefined,
      },
    ],
    dueDate: 'June 10',
    status: 'in_progress',
  },
];

export const TaskToday: React.FC<TaskTodayProps> = ({
  className = '',
  tasks = mockTasks,
  onViewAllTasks = () => console.log('View all tasks clicked'),
  onViewTask = (taskId: string) => console.log('View task clicked:', taskId),
  onEditTask = (taskId: string) => console.log('Edit task clicked:', taskId),
  onDeleteTask = (taskId: string) =>
    console.log('Delete task clicked:', taskId),
  onCreateTask = () => console.log('Create task clicked'),
  onAcceptTask = (taskId: string) =>
    console.log('Accept task clicked:', taskId),
  onDeclineTask = (taskId: string) =>
    console.log('Decline task clicked:', taskId),
  onUpdateStatus = (taskId: string, status: string) =>
    console.log('Update status clicked:', taskId, status),
  onUpdatePriority = (taskId: string, flag: string) =>
    console.log('Update priority clicked:', taskId, flag),
  onDuplicateTask = (taskId: string) =>
    console.log('Duplicate task clicked:', taskId),
  onViewOnMap = (taskId: string) => console.log('View on map clicked:', taskId),
  onViewDetails = (taskId: string) =>
    console.log('View details clicked:', taskId),
}) => {
  return (
    <SplitCard
      className={cn('max-h-[370px] text-basic-black', className)}
      bottomClassName="pt-0 p-0 px-5 pb-5"
      topContent={
        <div>
          <h2 className="text-base font-semibold text-basic-black">
            Tasks Today
          </h2>
        </div>
      }
      bottomContent={
        <div className="space-y-0">
          {tasks.length > 0 ? (
            <Table className="table-fixed w-full">
              <TableBody>
                {tasks.map((task, index) => (
                  <TableRow
                    key={task.id}
                    className="border-b border-basic-white"
                  >
                    <TableCell className="w-8 pl-3">
                      <Flag
                        variant={task.flag}
                        size="md"
                        className="flex-shrink-0"
                      />
                    </TableCell>

                    <TableCell className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-basic-gray">
                          #{task.id}
                        </span>
                        <span className="text-sm font-medium text-basic-black truncate">
                          {task.title}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="w-[70px] text-center">
                      {task.clientUsers.map((user, userIndex) => (
                        <Avatar
                          key={`client-${userIndex}`}
                          size="ssm"
                          className="w-7 h-7 flex-shrink-0"
                          rounded="md"
                          avatarSrc={user.avatarSrc}
                          tooltipText={user.name}
                          row={{
                            original: {
                              client: {
                                name: user.name,
                                surname: '',
                                avatarSrc: user.avatarSrc,
                              },
                            },
                          }}
                        />
                      ))}
                    </TableCell>

                    <TableCell className="w-[70px] text-center">
                      {task.assignedUsers.map((user, userIndex) => (
                        <Avatar
                          key={`assigned-${userIndex}`}
                          size="ssm"
                          className="w-7 h-7 flex-shrink-0"
                          rounded="md"
                          avatarSrc={user.avatarSrc}
                          tooltipText={user.name}
                          row={{
                            original: {
                              client: {
                                name: user.name,
                                surname: '',
                                avatarSrc: user.avatarSrc,
                              },
                            },
                          }}
                        />
                      ))}
                    </TableCell>

                    <TableCell className="w-20 text-center">
                      <div className="text-sm text-basic-black">
                        {task.dueDate}
                      </div>
                    </TableCell>

                    <TableCell className="w-12 text-center">
                      <StatusIndicator
                        status={task.status as TaskStatus}
                        className="flex-shrink-0"
                        iconClassName="text-[20px]"
                      />
                    </TableCell>

                    <TableCell className="w-12 text-center pr-3">
                      <TaskDropdownActions
                        taskId={task.id}
                        status={task.status}
                        isAccepted={true}
                        onAcceptTask={onAcceptTask}
                        onDeclineTask={onDeclineTask}
                        onUpdateStatus={onUpdateStatus}
                        onUpdatePriority={onUpdatePriority}
                        onDeleteTask={onDeleteTask}
                        onDuplicateTask={onDuplicateTask}
                        onViewOnMap={onViewOnMap}
                        onViewDetails={onViewDetails}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div>
              <NoResultsFound
                variant="tasks"
                title="Nothing on the list today!"
                description="Let's fill this list — create a new task now"
                hasSearchTerm={false}
                className="py-0"
              />
            </div>
          )}

          <div className="pt-5">
            {tasks.length > 0 ? (
              <button
                onClick={onViewAllTasks}
                className="flex items-center gap-1 text-basic-green hover:text-basic-green/90 transition-colors text-sm font-medium"
              >
                <span>View all tasks</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <div className="flex justify-center">
                <Button
                  onClick={onCreateTask}
                  className="bg-basic-green hover:bg-basic-green/90 text-white px-6 py-2 rounded-lg flex items-center gap-2 shadow-sm"
                >
                  <Plus size={16} />
                  <span>Create task</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      }
    />
  );
};
