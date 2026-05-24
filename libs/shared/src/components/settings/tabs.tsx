'use client';

import * as React from 'react';
import { cn } from '../../utils/cn';
import { Button } from '../button/button';
import { Icon } from '../icon';

interface SettingsTab {
  id: string;
  label: string;
  icon: string;
  group?: string;
}

interface SettingsTabsProps {
  tabs: SettingsTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export const SettingsTabs: React.FC<SettingsTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className,
}) => {
  const groupedTabs = tabs.reduce((acc, tab) => {
    const group = tab.group || 'default';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(tab);
    return acc;
  }, {} as Record<string, SettingsTab[]>);

  return (
    <div className={cn('flex flex-col h-full', className)}>
      <div className="px-5 pt-5">
        <h1 className="text-xl font-bold text-basic-black">Settings</h1>
      </div>

      <div className="py-5">
        <div className="h-px bg-basic-white" />
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto">
        {Object.entries(groupedTabs).map(
          ([groupName, groupTabs], groupIndex) => (
            <div key={groupName}>
              {groupIndex > 0 && (
                <div className="py-5">
                  <div className="h-px bg-basic-white" />
                </div>
              )}

              {groupName === 'Organisation settings' && (
                <div className="px-5 py-2">
                  <h2 className="text-xs font-normal text-basic-black tracking-wide">
                    {groupName}
                  </h2>
                </div>
              )}

              <div className="gap-3 relative">
                {groupTabs.map((tab) => (
                  <div key={tab.id} className="relative">
                    <Button
                      onClick={() => onTabChange(tab.id)}
                      variant="ghost"
                      size="default"
                      className={cn(
                        'w-full justify-start px-5 py-2 relative z-10 transition-all duration-300 ease-in-out transform',
                        activeTab === tab.id
                          ? 'text-basic-green scale-[1.02]'
                          : 'text-basic-gray hover:text-basic-black hover:scale-[1.01]'
                      )}
                    >
                      <span
                        className={cn(
                          'material-symbols-outlined text-xl transition-all duration-300 ease-in-out',
                          activeTab === tab.id ? 'scale-110' : 'scale-100'
                        )}
                      >
                        {tab.icon}
                      </span>
                      <span className="transition-all duration-300 ease-in-out">
                        {tab.label}
                      </span>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>

      <div className="space-y-1 mb-5">
        <Button
          variant="ghost"
          size="default"
          className="w-full justify-start text-basic-gray hover:text-basic-black transition-all duration-300 ease-in-out hover:scale-[1.01]"
        >
          <Icon icon='person_add' className="transition-transform duration-300 ease-in-out hover:scale-110"/>
          <span className="transition-all duration-300 ease-in-out">
            Invite to company
          </span>
        </Button>
        <Button
          variant="ghost"
          size="default"
          className="w-full justify-start text-basic-gray hover:text-basic-black transition-all duration-300 ease-in-out hover:scale-[1.01]"
        >
          <Icon icon='logout' className="transition-transform duration-300 ease-in-out hover:scale-110"/>
          <span className="transition-all duration-300 ease-in-out">
            Sign out
          </span>
        </Button>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
