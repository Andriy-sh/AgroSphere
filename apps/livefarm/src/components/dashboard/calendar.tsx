'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { EventContentArg } from '@fullcalendar/core';
import { SplitCard } from '@@agrosphere/shared';
import { CustomSelect } from '@@agrosphere/shared';
import './calendar.css';

interface CalendarProps {
  events: {
    id: string;
    title: string;
    start: string;
    color: string;
  }[];
}

export function Calendar({ events }: CalendarProps) {
  const renderEventContent = (eventInfo: EventContentArg) => {
    return (
      <div
        className="h-1.5 w-full rounded gap-1"
        style={{ backgroundColor: eventInfo.event.backgroundColor }}
      ></div>
    );
  };

  const calendarOptions = [
    { value: 'month', label: 'Month' },
    { value: 'week', label: 'Week' },
    { value: 'day', label: 'Day' },
  ];

  const LegendItem = ({ color, label }: { color: string; label: string }) => (
    <div className="flex items-center gap-2">
      <div className={`rounded-full w-3 h-3 space-y-1 ${color}`} />
      <span className="text-sm text-gray-700">{label}</span>
    </div>
  );

  return (
    <SplitCard
      className="h-full text-basic-black"
      topClassName="flex flex-col gap-4"
      topContent={
        <>
          <div className="flex justify-between items-center relative z-50">
            <h2 className="text-base font-semibold">Calendar</h2>
            <div className="relative z-[9999]">
              <CustomSelect
                options={calendarOptions}
                defaultValue="month"
                placeholder="Select calendar type"
                triggerClassName="text-sm h-7 w-[150px] p-0 px-2"
                value="month"
                popupClassName="w-[150px] z-[9999]"
                iconClassName="text-sm"
              />
            </div>
          </div>

          <div className="flex items-center pt-5 gap-6">
            <LegendItem color="bg-basic-yellow" label="Upcoming" />
            <LegendItem color="bg-basic-blue" label="In progress" />
            <LegendItem color="bg-basic-red" label="Overdue" />
            <LegendItem color="bg-basic-green" label="Completed" />
          </div>
        </>
      }
      bottomContent={
        <div className="pt-10 h-full z-0">
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            headerToolbar={false}
            events={events}
            eventContent={renderEventContent}
            eventDisplay="list-item"
            height="auto"
            dayHeaderClassNames="!h-[44px] text-center py-3 "
            dayCellContent={(arg) => {
              return <span className="px-2 h-full">{arg.dayNumberText}</span>;
            }}
            dayHeaderContent={(arg) => {
              return (
                <span className="text-sm font-medium text-basic-gray">
                  {arg.text}
                </span>
              );
            }}
          />
        </div>
      }
    />
  );
}
