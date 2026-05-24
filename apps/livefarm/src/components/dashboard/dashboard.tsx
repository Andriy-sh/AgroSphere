'use client';

import React from 'react';
import { redirect } from 'next/navigation';
import { SetupChecklist } from './setup-checklist';
import { TaskInsights } from './task-insights';
import { TodaysWeather } from './todays-weather';
import { ForecastChart } from './forecast-chart';
import { TaskToday } from './task-today';
import { NotificationBar } from './notification-bar';
import { News } from './news';
import { Calendar } from './calendar';
import { Avatar } from '@@agrosphere/shared';
import { useNotificationStore } from '@@agrosphere/shared';

const calculatePercentage = (subtasks: { isCompleted: boolean }[]) => {
  if (!subtasks || subtasks.length === 0) return 0;
  const completedCount = subtasks.filter((sub) => sub.isCompleted).length;
  return Math.round((completedCount / subtasks.length) * 100);
};

const checklistData = [
  {
    id: '1',
    title: 'Basic business info',
    subtasks: [
      {
        id: '1-1',
        title: 'Company name and details',
        isCompleted: true,
        actionText: 'Go',
        link: '/settings/company',
      },
      {
        id: '1-2',
        title: 'Business address and contact',
        isCompleted: true,
        actionText: 'Go',
        link: '/settings/contact',
      },
    ],
  },
  {
    id: '2',
    title: 'Add team members and connections (if needed)',
    subtasks: [
      {
        id: '2-1',
        title: 'Invite other team members',
        isCompleted: true,
        actionText: 'Go',
        link: '/team/invite',
      },
      {
        id: '2-2',
        title: 'Set up connections',
        isCompleted: false,
        actionText: 'Go',
        link: '/connections/setup',
      },
    ],
  },
  {
    id: '3',
    title: 'Lab settings',
    subtasks: [
      {
        id: '3-1',
        title: 'Configure lab parameters',
        isCompleted: true,
        actionText: 'Go',
        link: '/lab/parameters',
      },
      {
        id: '3-2',
        title: 'Set up testing protocols',
        isCompleted: false,
        actionText: 'Go',
        link: '/lab/protocols',
      },
      {
        id: '3-3',
        title: 'Configure lab equipment',
        isCompleted: false,
        actionText: 'Go',
        link: '/lab/equipment',
      },
    ],
  },
  {
    id: '4',
    title: 'Set up work with clients',
    subtasks: [
      {
        id: '4-1',
        title: 'Create client profiles',
        isCompleted: false,
        actionText: 'Go',
        link: '/clients/create',
      },
      {
        id: '4-2',
        title: 'Set up client communication',
        isCompleted: false,
        actionText: 'Go',
        link: '/clients/communication',
      },
    ],
  },
].map((task) => ({
  ...task,
  percentage: calculatePercentage(task.subtasks),
  isCompleted: calculatePercentage(task.subtasks) === 100,
}));

const mockTaskInsightsData = {
  upcomingCount: 20,
  inProgressCount: 40,
  overdueCount: 12,
  completedCount: 16,
  upcomingPercentage: '+20%',
  inProgressPercentage: '+10%',
  overduePercentage: '+20%',
  completedPercentage: '+15%',
};
const events = [
  {
    id: '1',
    title: 'Completed Task',
    start: '2025-08-04',
    color: '#29B54C',
  },
  { id: '2', title: 'Overdue Task', start: '2025-08-05', color: '#FF323F' },
  { id: '3', title: 'In Progress', start: '2025-08-07', color: '#41B0FF' },
  { id: '4', title: 'Upcoming', start: '2025-08-13', color: '#FFC652' },
  { id: '4', title: 'Upcoming', start: '2025-08-13', color: '#41B0FF' },
];

const mockWeatherData = {
  city: 'New York',
  country: 'USA',
  currentTemp: 72,
  description: 'Sunny',
  feelsLike: 70,
  humidity: 50,
  precipitation: 0,
  clouds: 10,
  windSpeed: 10,
  sunrise: '06:00',
  sunset: '18:00',
  windDirection: 180,
  hourlyForecast: [
    {
      id: '1',
      time: '00:00',
      temperature: 18,
      icon: 'clear_night',
      isNow: false,
    },
    {
      id: '2',
      time: '01:00',
      temperature: 17,
      icon: 'clear_night',
      isNow: false,
    },
    {
      id: '3',
      time: '02:00',
      temperature: 16,
      icon: 'clear_night',
      isNow: false,
    },
    {
      id: '4',
      time: '03:00',
      temperature: 15,
      icon: 'clear_night',
      isNow: false,
    },
    {
      id: '5',
      time: '04:00',
      temperature: 14,
      icon: 'clear_night',
      isNow: false,
    },
    {
      id: '6',
      time: '05:00',
      temperature: 13,
      icon: 'clear_night',
      isNow: false,
    },
    { id: '7', time: '06:00', temperature: 14, icon: 'wb_sunny', isNow: false },
    { id: '8', time: '07:00', temperature: 16, icon: 'wb_sunny', isNow: false },
    { id: '9', time: '08:00', temperature: 18, icon: 'wb_sunny', isNow: false },
    {
      id: '10',
      time: '09:00',
      temperature: 20,
      icon: 'wb_sunny',
      isNow: false,
    },
    {
      id: '11',
      time: '10:00',
      temperature: 22,
      icon: 'wb_sunny',
      isNow: false,
    },
    {
      id: '12',
      time: '11:00',
      temperature: 24,
      icon: 'wb_sunny',
      isNow: false,
    },
    { id: '13', time: '12:00', temperature: 26, icon: 'wb_sunny', isNow: true },
    {
      id: '14',
      time: '13:00',
      temperature: 27,
      icon: 'wb_sunny',
      isNow: false,
    },
    {
      id: '15',
      time: '14:00',
      temperature: 28,
      icon: 'wb_sunny',
      isNow: false,
    },
    {
      id: '16',
      time: '15:00',
      temperature: 27,
      icon: 'wb_sunny',
      isNow: false,
    },
    {
      id: '17',
      time: '16:00',
      temperature: 26,
      icon: 'wb_sunny',
      isNow: false,
    },
    {
      id: '18',
      time: '17:00',
      temperature: 25,
      icon: 'wb_sunny',
      isNow: false,
    },
    {
      id: '19',
      time: '18:00',
      temperature: 23,
      icon: 'wb_sunny',
      isNow: false,
    },
    {
      id: '20',
      time: '19:00',
      temperature: 21,
      icon: 'wb_sunny',
      isNow: false,
    },
    {
      id: '21',
      time: '20:00',
      temperature: 19,
      icon: 'clear_night',
      isNow: false,
    },
    {
      id: '22',
      time: '21:00',
      temperature: 18,
      icon: 'clear_night',
      isNow: false,
    },
    {
      id: '23',
      time: '22:00',
      temperature: 17,
      icon: 'clear_night',
      isNow: false,
    },
    {
      id: '24',
      time: '23:00',
      temperature: 16,
      icon: 'clear_night',
      isNow: false,
    },
  ],
};

export default function Dashboard() {
  const [tasks] = React.useState(checklistData);
  const [isChecklistVisible, setIsChecklistVisible] = React.useState(true);
  const { open: openNotifications } = useNotificationStore();

  const handleViewAllTasks = () => {
    redirect('/tasks');
  };

  const handleViewTask = (taskId: string) => {
    redirect(`/tasks/${taskId}`);
  };

  const handleEditTask = (taskId: string) => {
    console.log(`Edit task ${taskId}`);
  };

  const handleDeleteTask = (taskId: string) => {
    console.log(`Delete task ${taskId}`);
  };

  const handleCreateTask = () => {
    redirect('/tasks/create-task');
  };

  const handleArticleClick = (articleId: string) => {
    console.log(`Article ${articleId} clicked`);
  };

  const handleViewAllNotifications = () => {
    openNotifications();
  };

  return (
    <div className="h-full">
      <div className="p-6 bg-white border border-basic-gray-light rounded-xl">
        <div className="flex flex-col gap-2 mb-6">
          <div className="flex items-center gap-2">
            <Avatar
              row={{
                original: {
                  client: {
                    name: 'GreenMark',
                  },
                },
              }}
              rounded="lg"
              avatarSrc="w-9 h-9"
            />
            <span className="text-base font-semibold">GreenMark</span>
          </div>
          <h1 className="text-[28px] font-semibold">
            Good morning, Robert Fox!
          </h1>
        </div>

        <div className="grid grid-cols-2 gap-5 mb-5">
          {isChecklistVisible && (
            <SetupChecklist
              tasks={tasks}
              onClose={() => setIsChecklistVisible(false)}
            />
          )}
          <TaskInsights
            data={mockTaskInsightsData}
            className={!isChecklistVisible ? 'col-span-2' : ''}
            isExpanded={!isChecklistVisible}
          />
        </div>

        <div className="mb-5">
          <TodaysWeather weather={mockWeatherData} />
        </div>

        <div className="grid grid-cols-2 gap-5 mb-5">
          <ForecastChart />
          <TaskToday
            onViewAllTasks={handleViewAllTasks}
            onViewTask={handleViewTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onCreateTask={handleCreateTask}
            onAcceptTask={(taskId) => console.log('Accept task:', taskId)}
            onDeclineTask={(taskId) => console.log('Decline task:', taskId)}
            onUpdateStatus={(taskId, status) =>
              console.log('Update status:', taskId, status)
            }
            onUpdatePriority={(taskId, flag) =>
              console.log('Update priority:', taskId, flag)
            }
            onDuplicateTask={(taskId) => console.log('Duplicate task:', taskId)}
            onViewOnMap={(taskId) => console.log('View on map:', taskId)}
            onViewDetails={(taskId) => console.log('View details:', taskId)}
          />
        </div>

        <div className="grid grid-cols-2 gap-x-5">
          <div className="flex flex-col gap-5">
            <NotificationBar
              onViewAllNotifications={handleViewAllNotifications}
            />
            <News onArticleClick={handleArticleClick} />
          </div>
          <div className="row-span-2">
            <Calendar events={events} />
          </div>
        </div>
      </div>
    </div>
  );
}
