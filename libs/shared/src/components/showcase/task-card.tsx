'use client';

import React from 'react';

export interface TaskCardProps {
  number: string;
  numberColor: string;
  flagColor: string;
  title: string;
  badges?: string[];
  avatar?: string;
  date: string;
  icons?: string[];
  iconColor?: string;
  description: string;
  inactive?: boolean;
  borderBottom?: boolean;
}

const dividerStyle = {
  width: 2,
  height: 20,
  background: '#F1F3F9',
  borderRadius: 1,
  margin: '0 8px',
};

export const TaskCard: React.FC<TaskCardProps> = ({
  number,
  numberColor = '#818D99',
  flagColor,
  title,
  badges,
  avatar,
  date,
  icons,
  iconColor,
  description,
  inactive,
  borderBottom,
}) => (
  <div
    className={`flex flex-col ${
      borderBottom ? 'border-b gap-3 border-gray-200 ' : ''
    }`}
    style={{ opacity: inactive ? 0.7 : 1 }}
  >
    <div className="flex items-center mb-1.5">
      <span
        className="material-symbols-outlined mr-2 text-[#DBDEE8]"
        style={{ fontSize: 18 }}
      >
        drag_handle
      </span>
      <span
        className="material-symbols-outlined mr-2"
        style={{ fontSize: 18, color: flagColor }}
      >
        flag_2
      </span>
      <span className="font-medium text-sm mr-2" style={{ color: numberColor }}>
        {number}
      </span>
      <span className="font-medium text-sm mr-2 text-[#101010]">{title}</span>
      <span className="ml-auto text-gray-400 text-xs font-medium flex items-center">
        {badges?.map((b, i) => (
          <React.Fragment key={i}>
            <span
              className="bg-[#e6f4ea] text-[#1fc47c] rounded px-2 py-0.5 font-normal text-sm inline-flex items-center justify-center"
              style={{ height: 28, width: 28 }}
            >
              {b}
            </span>
            {i < badges.length - 1 && <span style={dividerStyle}></span>}
            {i === badges.length - 1 && (avatar || date || icons?.length) ? (
              <span style={dividerStyle}></span>
            ) : null}
          </React.Fragment>
        ))}
        {avatar && (
          <>
            <img src={avatar} alt="" className="w-7 h-7 rounded mr-0" />
            {(date || icons?.length) && <span style={dividerStyle}></span>}
          </>
        )}
        <span className="mr-0 inline-flex items-center text-xs font-medium px-0.5">
          <span
            className="material-symbols-outlined mr-0.5"
            style={{ fontSize: 18 }}
          >
            calendar_clock
          </span>
          {date}
        </span>
        {icons?.length ? <span style={dividerStyle}></span> : null}
        {icons?.map((icon, i) => (
          <React.Fragment key={i}>
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 18, color: iconColor }}
            >
              {icon}
            </span>
            {i === icons.length - 1 && <span style={dividerStyle}></span>}
          </React.Fragment>
        ))}
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
          more_vert
        </span>
      </span>
    </div>
    <div className="text-gray-400 text-xs font-normal ml-12">{description}</div>
  </div>
);
