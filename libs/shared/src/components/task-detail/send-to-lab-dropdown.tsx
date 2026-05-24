'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPopper, Instance, Options } from '@popperjs/core';
import { Button } from '../button/button';
import { SampleDataUpload } from '../sample-data-upload/sample-data-upload';
import { Icon } from '../icon';

interface SubmenuItem {
  icon: string;
  label: string;
  action?: () => void;
  description: string;
  isGenerating?: boolean;
  progress?: number;
  disabled?: boolean;
  shouldKeepOpen?: boolean;
}

interface MenuItem {
  icon: string;
  label: string;
  action?: () => void;
  hasSubmenu: boolean;
  submenuItems?: SubmenuItem[];
}

interface SendToLabDropdownProps {
  isEditingMode?: boolean;
  onSendToLab?: () => void;
  onCancelLabOrder?: () => void;
  onCreateCSV?: () => void;
  onDownloadCSV?: () => void;
  onImport?: () => void;
  onCreateTaskReport?: () => void;
  onSendTaskReport?: () => void;
  onDownloadTaskReport?: () => void;
  isGeneratingTaskReport?: boolean;
  taskReportProgress?: number;
  isTaskReportGenerated?: boolean;
  onUploadSampleData?: (data: unknown[]) => void;
}

export const SendToLabDropdown: React.FC<SendToLabDropdownProps> = ({
  isEditingMode = false,
  onSendToLab,
  onCancelLabOrder,
  onCreateCSV,
  onDownloadCSV,
  onImport,
  onCreateTaskReport,
  onSendTaskReport,
  onDownloadTaskReport,
  isGeneratingTaskReport = false,
  taskReportProgress = 0,
  isTaskReportGenerated = false,
  onUploadSampleData,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [tooltipInfo, setTooltipInfo] = useState<{
    show: boolean;
    x: number;
    y: number;
    text: string;
    description: string;
  }>({ show: false, x: 0, y: 0, text: '', description: '' });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const popperInstanceRef = useRef<Instance | null>(null);
  const submenuRefs = useRef<(HTMLDivElement | null)[]>([]);
  const submenuPopperInstancesRef = useRef<(Instance | null)[]>([]);

  const popperOptions: Partial<Options> = useMemo(
    () => ({
      placement: 'bottom-start',
      onFirstUpdate: () => {
        if (dropdownMenuRef.current) {
          dropdownMenuRef.current.style.opacity = '1';
          dropdownMenuRef.current.style.pointerEvents = 'auto';
        }
      },
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 8],
          },
        },
        {
          name: 'preventOverflow',
          options: {
            padding: 8,
          },
        },
        {
          name: 'flip',
          options: {
            fallbackPlacements: ['bottom-end', 'top-start', 'top-end'],
          },
        },
      ],
    }),
    []
  );

  const submenuPopperOptions: Partial<Options> = useMemo(
    () => ({
      placement: 'right-start',
      onFirstUpdate: () => {
        const currentHoveredItem = hoveredItem;
        if (
          currentHoveredItem !== null &&
          submenuRefs.current[currentHoveredItem]
        ) {
          const submenu = submenuRefs.current[
            currentHoveredItem
          ]?.querySelector('[data-submenu]') as HTMLElement;
          if (submenu) {
            submenu.style.opacity = '1';
            submenu.style.pointerEvents = 'auto';
          }
        }
      },
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 10],
          },
        },
        {
          name: 'preventOverflow',
          options: {
            padding: 8,
          },
        },
        {
          name: 'flip',
          options: {
            fallbackPlacements: ['left-start', 'right-end', 'left-end'],
          },
        },
      ],
    }),
    [hoveredItem]
  );
  const [internalIsGenerating, setInternalIsGenerating] = useState(false);
  const [internalProgress, setInternalProgress] = useState(0);
  const [internalIsGenerated, setInternalIsGenerated] = useState(false);
  const [isSampleDataModalOpen, setIsSampleDataModalOpen] = useState(false);
  const generationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const currentSubmenuInstances = submenuPopperInstancesRef.current;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setHoveredItem(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      if (generationIntervalRef.current) {
        clearInterval(generationIntervalRef.current);
      }
      if (popperInstanceRef.current) {
        popperInstanceRef.current.destroy();
      }
      currentSubmenuInstances.forEach((instance) => {
        if (instance) {
          instance.destroy();
        }
      });
    };
  }, []);

  useEffect(() => {
    if (isOpen && dropdownRef.current && dropdownMenuRef.current) {
      if (popperInstanceRef.current) {
        popperInstanceRef.current.destroy();
      }
      popperInstanceRef.current = createPopper(
        dropdownRef.current,
        dropdownMenuRef.current,
        popperOptions
      );
    } else if (!isOpen && popperInstanceRef.current) {
      popperInstanceRef.current.destroy();
      popperInstanceRef.current = null;
    }

    return () => {
      if (popperInstanceRef.current) {
        popperInstanceRef.current.destroy();
        popperInstanceRef.current = null;
      }
    };
  }, [isOpen, popperOptions]);

  useEffect(() => {
    if (hoveredItem !== null && submenuRefs.current[hoveredItem]) {
      const menuItem = submenuRefs.current[hoveredItem];
      const submenu = menuItem?.querySelector('[data-submenu]') as HTMLElement;

      if (menuItem && submenu) {
        if (submenuPopperInstancesRef.current[hoveredItem]) {
          submenuPopperInstancesRef.current[hoveredItem]?.destroy();
        }

        submenuPopperInstancesRef.current[hoveredItem] = createPopper(
          menuItem,
          submenu,
          submenuPopperOptions
        );
      }
    } else {
      const currentInstances = submenuPopperInstancesRef.current;
      currentInstances.forEach((instance, index) => {
        if (instance) {
          instance.destroy();
          currentInstances[index] = null;
        }
      });
    }
  }, [hoveredItem, submenuPopperOptions]);

  useEffect(() => {
    if (!isOpen && dropdownMenuRef.current) {
      dropdownMenuRef.current.style.opacity = '0';
      dropdownMenuRef.current.style.pointerEvents = 'none';
    }
  }, [isOpen]);

  useEffect(() => {
    if (hoveredItem === null) {
      submenuRefs.current.forEach((ref) => {
        if (ref) {
          const submenu = ref.querySelector('[data-submenu]') as HTMLElement;
          if (submenu) {
            submenu.style.opacity = '0';
            submenu.style.pointerEvents = 'none';
          }
        }
      });
    }
  }, [hoveredItem]);

  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (
    action: (() => void) | undefined,
    hasSubmenu: boolean,
    shouldKeepOpen = false
  ) => {
    if (hasSubmenu) {
      return;
    }

    if (!shouldKeepOpen) {
      setIsOpen(false);
      setHoveredItem(null);
    }

    if (action) {
      action();
    }
  };

  const handleItemHover = (index: number) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    setHoveredItem(index);
  };

  const handleInfoHover = (
    event: React.MouseEvent,
    text: string,
    description: string
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipInfo({
      show: true,
      x: rect.right + 20,
      y: rect.top,
      text,
      description,
    });
  };

  const handleInfoLeave = () => {
    setTooltipInfo((prev) => ({ ...prev, show: false }));
  };

  const handleItemLeave = () => {
    if (isGeneratingTaskReport || internalIsGenerating || internalIsGenerated) {
      return;
    }

    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredItem(null);
    }, 300);
  };

  const handleRegenerateTaskReport = () => {
    setInternalIsGenerated(false);
    setInternalProgress(0);
    setInternalIsGenerating(true);
    startGeneration();
  };

  const handleInternalCreateTaskReport = () => {
    setInternalIsGenerating(true);
    setInternalProgress(0);
    startGeneration();
  };

  const handleSampleDataUpload = (data: unknown[]) => {
    if (onUploadSampleData) {
      onUploadSampleData(data);
    }
    setIsSampleDataModalOpen(false);
  };

  const handleCloseSampleDataModal = () => {
    setIsSampleDataModalOpen(false);
  };

  const startGeneration = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        setInternalProgress(100);
        setInternalIsGenerating(false);
        setInternalIsGenerated(true);
        clearInterval(interval);
        generationIntervalRef.current = null;
      } else {
        setInternalProgress(Math.round(progress));
      }
    }, 200);

    generationIntervalRef.current = interval;
  };

  const taskReportSubmenuItems = [
    {
      icon:
        isGeneratingTaskReport || internalIsGenerating
          ? 'progress'
          : internalIsGenerated
          ? 'source_notes'
          : 'add_notes',
      label:
        isGeneratingTaskReport || internalIsGenerating
          ? `Generating... ${
              isGeneratingTaskReport ? taskReportProgress : internalProgress
            }%`
          : internalIsGenerated
          ? 'Regenerate'
          : 'Create task report',
      action:
        isGeneratingTaskReport || internalIsGenerating
          ? undefined
          : internalIsGenerated
          ? handleRegenerateTaskReport
          : handleInternalCreateTaskReport,
      description:
        isGeneratingTaskReport || internalIsGenerating
          ? 'Task report is being generated'
          : internalIsGenerated
          ? 'Regenerate the task report with updated data'
          : 'Generate a new task report with current data and analysis',
      isGenerating: isGeneratingTaskReport || internalIsGenerating,
      progress: isGeneratingTaskReport ? taskReportProgress : internalProgress,
      shouldKeepOpen: true,
    },
    {
      icon: 'send',
      label: 'Send task report',
      action:
        isTaskReportGenerated ||
        internalIsGenerated ||
        (!internalIsGenerating && internalProgress === 100)
          ? onSendTaskReport
          : undefined,
      description:
        isTaskReportGenerated ||
        internalIsGenerated ||
        (!internalIsGenerating && internalProgress === 100)
          ? 'Send the task report to stakeholders via email or other channels'
          : 'Available after report generation is complete',
      disabled: !(
        isTaskReportGenerated ||
        internalIsGenerated ||
        (!internalIsGenerating && internalProgress === 100)
      ),
    },
    {
      icon: 'export_notes',
      label:
        isTaskReportGenerated ||
        internalIsGenerated ||
        (!internalIsGenerating && internalProgress === 100)
          ? 'Download task report'
          : 'Download unavailable',
      action:
        isTaskReportGenerated ||
        internalIsGenerated ||
        (!internalIsGenerating && internalProgress === 100)
          ? onDownloadTaskReport
          : undefined,
      description:
        isTaskReportGenerated ||
        internalIsGenerated ||
        (!internalIsGenerating && internalProgress === 100)
          ? 'Download the generated task report'
          : 'Available after report generation is complete',
      disabled: !(
        isTaskReportGenerated ||
        internalIsGenerated ||
        (!internalIsGenerating && internalProgress === 100)
      ),
    },
  ];

  const fullSoilReportsSubmenuItems = [
    {
      icon: 'download',
      label: 'Download report',
      action: onDownloadCSV,
      description: 'Download the full soil analysis report',
    },
    {
      icon: 'send',
      label: 'Send report',
      action: onSendTaskReport,
      description: 'Send the soil report to stakeholders',
    },
  ];

  const csvSubmenuItems = [
    {
      icon: 'download',
      label: 'Download CSV',
      action: onDownloadCSV,
      description: 'Download data in CSV format',
    },
    {
      icon: 'upload',
      label: 'Upload CSV',
      action: () => setIsSampleDataModalOpen(true),
      description: 'Import sample data from CSV file',
    },
  ];

  const menuItems: MenuItem[] = [
    {
      icon: 'send',
      label: 'Send to lab',
      action: onSendToLab,
      hasSubmenu: false,
    },
    {
      icon: 'delete',
      label: 'Cancel order',
      action: onCancelLabOrder,
      hasSubmenu: false,
    },
    {
      icon: 'article',
      label: 'Task reports',
      action: undefined,
      hasSubmenu: true,
      submenuItems: taskReportSubmenuItems,
    },
    {
      icon: 'energy_program_time_used',
      label: 'Full soil reports',
      action: onCancelLabOrder,
      hasSubmenu: true,
      submenuItems: fullSoilReportsSubmenuItems,
    },
    {
      icon: 'description',
      label: 'CSV',
      action: onCreateCSV,
      hasSubmenu: true,
      submenuItems: csvSubmenuItems,
    },
    {
      icon: 'upload',
      label: 'Import',
      action: onImport,
      hasSubmenu: false,
    },
  ];

  return (
    <div
      className="relative flex items-center justify-center"
      ref={dropdownRef}
    >
      <Icon onClick={handleDropdownClick} icon="more_vert" />

      {isOpen && (
        <div
          ref={dropdownMenuRef}
          className="p-1 rounded-lg  bg-white shadow-lg border border-basic-white z-50 min-w-48"
          style={{ opacity: 0, pointerEvents: 'none' }}
        >
          <div className="flex flex-col gap-1">
            {menuItems.map((item, index) => (
              <div
                key={index}
                ref={(el) => {
                  submenuRefs.current[index] = el;
                }}
                className="relative"
                onMouseEnter={() => handleItemHover(index)}
                onMouseLeave={handleItemLeave}
              >
                <button
                  onClick={() =>
                    handleOptionClick(item.action, item.hasSubmenu)
                  }
                  className={`w-full flex items-center justify-between rounded-lg gap-3 px-2.5 py-1.5 text-left text-sm text-basic-black hover:bg-basic-white transition-colors duration-150 ${
                    item.label === 'Delete'
                      ? 'text-red-600 hover:text-red-700 hover:bg-red-50'
                      : ''
                  }`}
                >
                  <div className=" flex items-center gap-3">
                    <Icon icon={item.icon} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  {item.hasSubmenu && (
                    <Icon icon="chevron_right" className="text-basic-gray" />
                  )}
                </button>

                {item.hasSubmenu && hoveredItem === index && (
                  <div
                    data-submenu
                    className="p-1 rounded-lg bg-white shadow-lg border border-basic-white z-50 min-w-48"
                    style={{ opacity: 0, pointerEvents: 'none' }}
                  >
                    <div className="flex flex-col gap-1">
                      {item.submenuItems?.map((subItem, subIndex) => (
                        <button
                          key={subIndex}
                          onClick={() =>
                            handleOptionClick(
                              subItem.action,
                              false,
                              subItem.shouldKeepOpen
                            )
                          }
                          disabled={subItem.disabled}
                          className={`w-full flex items-center justify-between rounded-lg gap-3 px-2.5 py-1.5 text-left text-sm transition-colors duration-150 whitespace-nowrap ${
                            subItem.disabled
                              ? 'text-basic-gray cursor-not-allowed'
                              : 'text-basic-black hover:bg-basic-white'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {subItem.isGenerating ? (
                              <div className="relative w-5 h-5">
                                <svg
                                  className="w-5 h-5 transform -rotate-90"
                                  viewBox="0 0 36 36"
                                >
                                  <path
                                    className="text-gray-300"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    fill="none"
                                    d="M18 2.0845
                                      a 15.9155 15.9155 0 0 1 0 31.831
                                      a 15.9155 15.9155 0 0 1 0 -31.831"
                                  />
                                  <path
                                    className="text-green-500"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    fill="none"
                                    strokeDasharray={`${
                                      subItem.progress || 0
                                    }, 100`}
                                    d="M18 2.0845
                                      a 15.9155 15.9155 0 0 1 0 31.831
                                      a 15.9155 15.9155 0 0 1 0 -31.831"
                                  />
                                </svg>
                              </div>
                            ) : (
                              <Icon icon={subItem.icon} />
                            )}
                            <span className="font-medium">{subItem.label}</span>
                          </div>
                          <Icon
                            onClick={(e) => e.stopPropagation()}
                            onMouseEnter={(e) =>
                              handleInfoHover(
                                e,
                                subItem.label,
                                subItem.description
                              )
                            }
                            className="text-basic-gray hover:text-basic-green transition-colors cursor-pointer flex items-center"
                            onMouseLeave={handleInfoLeave}
                            icon="info"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {tooltipInfo.show && (
        <div
          className="fixed bg-white text-basic-black px-4 py-3 rounded-2xl border border-basic-white max-w-xs z-[9999] shadow-lg"
          style={{
            left: tooltipInfo.x,
            top: tooltipInfo.y,
            transform: 'translateY(-50%)',
          }}
        >
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Icon
                icon="info"
                className="text-basic-black flex items-center justify-center"
              />
              <div className="font-semibold">{tooltipInfo.text}</div>
            </div>
            <div className="font-normal text-sm text-basic-black">
              {tooltipInfo.description}
            </div>
          </div>
        </div>
      )}

      <SampleDataUpload
        isOpen={isSampleDataModalOpen}
        onClose={handleCloseSampleDataModal}
        onUpload={handleSampleDataUpload}
      />
    </div>
  );
};
