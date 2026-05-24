'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search } from 'lucide-react';
import { CellContext, ColumnDef, HeaderContext } from '@tanstack/react-table';
import {
  Pagination,
  DropdownActionsNoLib,
  NoResultsFound,
  useDynamicPageSize,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@@agrosphere/shared';
import { Tooltip } from '@base-ui-components/react/tooltip';
import {
  TaskEditSample,
  TaskSampleData,
} from '@/components/task/task-edit-sample';
import { LabDeleteSample } from '@/components/task/lab-delete-sample';
import {
  Sample,
  getSamplesByTaskId,
  FarmMarker,
  MapZone,
} from '@@agrosphere/shared';
import { ParcelDropdown } from './task-parcel-dropdown';

interface TaskSampleTableProps {
  samples?: Sample[];
  onEditSample?: (sampleId: string) => void;
  onDeleteSample?: (sampleId: string) => void;
  onUpdateSample?: (sampleId: string, updatedData: TaskSampleData) => void;
  onSampleClick?: (sample: Sample) => void;
  selectedSample?: Sample | null;
  maxItems?: number;
  pageSize?: number;
  taskId?: string;
  geoCoords?: { latitude: string; longitude: string } | null;
  enableDynamicPageSize?: boolean;
  isTaskCompleted?: boolean;
  farms?: FarmMarker[];
  zones?: MapZone[];
}

export const TaskSampleTable: React.FC<TaskSampleTableProps> = ({
  samples: externalSamples,
  onEditSample,
  onDeleteSample,
  onUpdateSample,
  onSampleClick,
  selectedSample,
  maxItems = 8,
  pageSize = 7,
  taskId,
  geoCoords,
  enableDynamicPageSize = true,
  isTaskCompleted = false,
  farms,
  zones,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<keyof Sample | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | 'none'>(
    'none'
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSample, setEditingSample] = useState<TaskSampleData | null>(
    null
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [sampleToDelete, setSampleToDelete] = useState<{
    sampleId: string;
    labOrderId: string;
  } | null>(null);

  const tableContainerRef = useRef<HTMLDivElement>(null);

  // const dropdownItemStyles =
  //   'px-1.5 py-1.5 rounded-lg text-sm hover:bg-gray-50 cursor-pointer flex items-center justify-between';

  // const parcelDropdownItems = [
  //   {
  //     id: 'unassigned',
  //     label: (
  //       <div className="flex items-center justify-between w-full">
  //         <span className="text-sm">Unassigned</span>
  //         <Tooltip.Root delay={100}>
  //           <Tooltip.Trigger>
  //             <span
  //               className="material-symbols-outlined text-basic-gray text-lg hover:text-basic-green transition-colors cursor-pointer"
  //               onClick={(e) => e.stopPropagation()}
  //             >
  //               info
  //             </span>
  //           </Tooltip.Trigger>
  //           <Tooltip.Portal>
  //             <Tooltip.Positioner
  //               className="z-[99999]"
  //               sideOffset={20}
  //               side="right"
  //             >
  //               <Tooltip.Popup className="bg-white text-basic-black px-4 py-3 rounded-2xl border border-basic-white max-w-xs z-[99999]">
  //                 <div className="flex flex-col">
  //                   <div className="flex items-center gap-2">
  //                     <span className="material-symbols-outlined text-basic-black flex items-center justify-center text-lg">
  //                       info
  //                     </span>
  //                     <div className="font-semibold">Unassigned</div>
  //                   </div>
  //                   <div className="font-normal text-sm text-basic-black">
  //                     Show samples that are not assigned to any parcel
  //                   </div>
  //                 </div>
  //               </Tooltip.Popup>
  //             </Tooltip.Positioner>
  //           </Tooltip.Portal>
  //         </Tooltip.Root>
  //       </div>
  //     ),
  //     onClick: () => {
  //       return;
  //     },
  //     className: dropdownItemStyles,
  //   },
  //   {
  //     id: 'all',
  //     label: (
  //       <div className="flex items-center justify-between w-full">
  //         <span className="text-sm">All</span>
  //         <Tooltip.Root delay={100}>
  //           <Tooltip.Trigger>
  //             <span
  //               className="material-symbols-outlined text-basic-gray text-lg hover:text-basic-green transition-colors cursor-pointer"
  //               onClick={(e) => e.stopPropagation()}
  //             >
  //               info
  //             </span>
  //           </Tooltip.Trigger>
  //           <Tooltip.Portal>
  //             <Tooltip.Positioner
  //               className="z-[11]"
  //               sideOffset={20}
  //               side="right"
  //             >
  //               <Tooltip.Popup className="bg-white text-basic-black px-4 py-3 rounded-2xl border border-basic-white max-w-xs z-[99999]">
  //                 <div className="flex flex-col">
  //                   <div className="flex items-center gap-2">
  //                     <span className="material-symbols-outlined text-basic-black flex items-center justify-center text-lg">
  //                       info
  //                     </span>
  //                     <div className="font-semibold">All</div>
  //                   </div>
  //                   <div className="font-normal text-sm text-basic-black">
  //                     Show all samples regardless of parcel assignment
  //                   </div>
  //                 </div>
  //               </Tooltip.Popup>
  //             </Tooltip.Positioner>
  //           </Tooltip.Portal>
  //         </Tooltip.Root>
  //       </div>
  //     ),
  //     onClick: () => {
  //       return;
  //     },
  //     className: dropdownItemStyles,
  //   },
  // ];

  const dynamicPageSize = useDynamicPageSize(tableContainerRef, {
    estimatedRowHeight: 60,
    headerHeight: 40,
    paginationHeight: 60,
    minPageSize: 1,
    padding: isTaskCompleted ? 60 : 0,
  });

  const currentPageSize: number = enableDynamicPageSize
    ? dynamicPageSize.pageSize || pageSize
    : pageSize;

  const defaultSamples = useMemo(() => {
    if (taskId) {
      return getSamplesByTaskId(taskId);
    }
    return [];
  }, [taskId]);

  const samples = externalSamples || defaultSamples;

  const filteredSamples = samples.filter(
    (sample) =>
      sample.sampleId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sample.testType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sample.farm.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sample.parcelId &&
        sample.parcelId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (sample.zoneId &&
        sample.zoneId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      sample.lpisId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedSamples = useMemo(() => {
    if (!sortField || sortDirection === 'none') {
      return filteredSamples;
    }

    return [...filteredSamples].sort((a, b) => {
      const aValue = a[sortField] || '';
      const bValue = b[sortField] || '';

      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredSamples, sortField, sortDirection]);

  const getConflicts = useMemo(() => {
    const parcelConflicts = new Map<string, string[]>();
    const zoneConflicts = new Map<string, string[]>();

    samples.forEach((sample) => {
      if (sample.parcelId) {
        if (!parcelConflicts.has(sample.parcelId)) {
          parcelConflicts.set(sample.parcelId, []);
        }
        const parcelSamples = parcelConflicts.get(sample.parcelId);
        if (parcelSamples) {
          parcelSamples.push(sample.sampleId);
        }
      }

      if (sample.zoneId && sample.parcelId) {
        const zoneKey = `${sample.parcelId}-${sample.zoneId}`;
        if (!zoneConflicts.has(zoneKey)) {
          zoneConflicts.set(zoneKey, []);
        }
        const zoneSamples = zoneConflicts.get(zoneKey);
        if (zoneSamples) {
          zoneSamples.push(sample.sampleId);
        }
      }
    });

    const parcelFullyAssigned = new Map<string, boolean>();

    const uniqueParcels = new Set<string>();
    samples.forEach((sample) => {
      if (sample.parcelId) {
        uniqueParcels.add(sample.parcelId);
      }
    });

    uniqueParcels.forEach((parcelId) => {
      const parcelSamples = samples.filter((s) => s.parcelId === parcelId);
      const assignedZones = new Set(
        parcelSamples.map((s) => s.zoneId).filter(Boolean)
      );

      const allZonesForParcel =
        zones?.filter((zone) => zone.parcelName === parcelId) || [];
      const allZoneNames = new Set(allZonesForParcel.map((zone) => zone.name));

      const allZonesAssigned =
        allZoneNames.size > 0 &&
        Array.from(allZoneNames).every((zoneName) =>
          assignedZones.has(zoneName)
        );

      parcelFullyAssigned.set(parcelId, allZonesAssigned);
    });

    return {
      parcelConflicts: Array.from(parcelConflicts.entries())
        .filter(([parcelId, sampleIds]) => {
          return sampleIds.length > 1 && parcelFullyAssigned.get(parcelId);
        })
        .reduce((acc, [parcelId, sampleIds]) => {
          sampleIds.forEach((sampleId) => {
            acc[sampleId] = {
              type: 'parcel',
              conflictId: parcelId,
              count: sampleIds.length,
            };
          });
          return acc;
        }, {} as Record<string, { type: 'parcel' | 'zone'; conflictId: string; count: number }>),
      zoneConflicts: Array.from(zoneConflicts.entries())
        .filter(([_, sampleIds]) => sampleIds.length > 1)
        .reduce((acc, [zoneKey, sampleIds]) => {
          sampleIds.forEach((sampleId) => {
            acc[sampleId] = {
              type: 'zone',
              conflictId: zoneKey,
              count: sampleIds.length,
            };
          });
          return acc;
        }, {} as Record<string, { type: 'parcel' | 'zone'; conflictId: string; count: number }>),
    };
  }, [samples, zones]);

  const totalPages = Math.ceil(sortedSamples.length / currentPageSize);
  const startIndex = (currentPage - 1) * currentPageSize;
  const endIndex = startIndex + currentPageSize;
  const paginatedSamples = sortedSamples.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortField, sortDirection]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [currentPageSize]);

  const handleEditSample = (sampleId: string) => {
    const sample = samples.find((s) => s.sampleId === sampleId);
    if (sample) {
      const sampleData: TaskSampleData = {
        sampleId: sample.sampleId,
        testType: sample.testType,
        farm: sample.farm || '',
        parcel: sample.parcel || '',
        zone: sample.zone || '',
        lpisId: sample.lpisId,
        latitude: sample.latitude || '',
        longitude: sample.longitude || '',
      };
      setEditingSample(sampleData);
      setIsEditDialogOpen(true);
    }

    if (onEditSample) {
      onEditSample(sampleId);
    }
  };

  const handleDeleteSample = (sampleId: string) => {
    const sample = samples.find((s) => s.sampleId === sampleId);
    if (sample) {
      const labOrderId = sample.labOrderId || 'LO-4821';
      setSampleToDelete({ sampleId, labOrderId });
      setIsDeleteDialogOpen(true);
    }
  };

  const handleConfirmDeleteSample = () => {
    if (sampleToDelete && onDeleteSample) {
      onDeleteSample(sampleToDelete.sampleId);
      setIsDeleteDialogOpen(false);
      setSampleToDelete(null);
    }
  };

  const handleSaveSample = (updatedData: TaskSampleData) => {
    const originalSample = samples.find(
      (s) => s.sampleId === editingSample?.sampleId
    );
    const originalSampleId = originalSample?.sampleId;

    if (onUpdateSample && originalSampleId) {
      onUpdateSample(originalSampleId, updatedData);
    }
    if (onEditSample) {
      onEditSample(updatedData.sampleId);
    }
  };

  const getNextSortDirection = (field: keyof Sample) => {
    if (sortField === field) {
      if (sortDirection === 'none') return 'asc';
      if (sortDirection === 'asc') return 'desc';
      return 'none';
    }
    return 'asc';
  };

  const handleSort = (field: keyof Sample) => {
    const newDirection = getNextSortDirection(field);
    setSortDirection(newDirection);
    setSortField(newDirection === 'none' ? null : field);
  };

  const getSortIcon = (field: keyof Sample) => {
    if (sortField !== field) return 'unfold_more';
    if (sortDirection === 'asc') return 'expand_less';
    if (sortDirection === 'desc') return 'expand_more';
    return 'unfold_more';
  };

  const columns: ColumnDef<Sample>[] = [
    {
      accessorKey: 'sampleId',
      header: () => (
        <div
          className="flex items-center gap-1 cursor-pointer text-sm truncate"
          onClick={() => handleSort('sampleId')}
        >
          <span className="truncate">Sample ID</span>
          <span className="material-symbols-outlined text-sm flex-shrink-0">
            {getSortIcon('sampleId')}
          </span>
        </div>
      ),
      cell: ({ row }) => (
        <div
          className="text-sm truncate py-2 cursor-pointer hover:bg-gray-50 rounded px-1"
          onClick={() => onSampleClick?.(row.original)}
        >
          <span className="text-sm truncate">{row.original.sampleId}</span>
        </div>
      ),
      meta: { className: 'min-w-32 text-left truncate' },
    },
    {
      accessorKey: 'testType',
      header: () => (
        <div
          className="flex items-center gap-1 cursor-pointer text-sm truncate"
          onClick={() => handleSort('testType')}
        >
          <span className="truncate">Test type</span>
          <span className="material-symbols-outlined text-sm flex-shrink-0">
            {getSortIcon('testType')}
          </span>
        </div>
      ),
      cell: ({ row }) => (
        <div
          className="text-sm truncate py-2 cursor-pointer hover:bg-gray-50 rounded px-1"
          onClick={() => onSampleClick?.(row.original)}
        >
          <span className="text-sm truncate">{row.original.testType}</span>
        </div>
      ),
      meta: { className: 'min-w-40 text-left truncate' },
    },
    {
      accessorKey: 'farm',
      header: () => (
        <div
          className="flex items-center gap-1 cursor-pointer text-sm truncate"
          onClick={() => handleSort('farm')}
        >
          <span className="truncate">Farm</span>
          <span className="material-symbols-outlined text-sm flex-shrink-0">
            {getSortIcon('farm')}
          </span>
        </div>
      ),
      cell: ({ row }) => (
        <div
          className="text-sm truncate py-2 cursor-pointer hover:bg-gray-50 rounded px-1"
          onClick={() => onSampleClick?.(row.original)}
        >
          <span className="text-sm truncate">{row.original.farm || '---'}</span>
        </div>
      ),
      meta: { className: 'min-w-32 text-left truncate' },
    },
    {
      accessorKey: 'parcelId',
      header: () => (
        <div
          className="flex items-center gap-1 cursor-pointer text-sm truncate"
          onClick={() => handleSort('parcelId')}
        >
          <span className="truncate">Parcel ID</span>
          <span className="material-symbols-outlined text-sm flex-shrink-0">
            {getSortIcon('parcelId')}
          </span>
        </div>
      ),
      cell: ({ row }) => {
        const sample = row.original;
        const parcelConflict = getConflicts.parcelConflicts[sample.sampleId];
        const hasConflict = parcelConflict;

        return (
          <div
            className="text-sm truncate py-2 cursor-pointer hover:bg-gray-50 rounded px-1 flex items-center gap-2"
            onClick={() => onSampleClick?.(sample)}
          >
            <span className="text-sm truncate">{sample.parcelId || '---'}</span>

            {hasConflict && (
              <Tooltip.Provider delay={100}>
                <Tooltip.Root>
                  <Tooltip.Trigger>
                    <span className="material-symbols-outlined text-sm text-red-600 flex-shrink-0 cursor-pointer">
                      warning
                    </span>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Positioner
                      className="z-[99999]"
                      sideOffset={20}
                      side="top"
                    >
                      <Tooltip.Popup className="bg-white text-basic-black px-4 py-3 rounded-2xl border border-basic-white max-w-xs z-[99999]">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-basic-black flex items-center justify-center text-lg">
                              warning
                            </span>
                            <div className="font-semibold text-basic-black">
                              All zones assigned
                            </div>
                          </div>
                          <div className="font-normal text-sm text-basic-black">
                            All zones from this parcel have been assigned to
                            samples.
                          </div>
                        </div>
                      </Tooltip.Popup>
                    </Tooltip.Positioner>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
            )}
          </div>
        );
      },
      meta: { className: 'min-w-28 text-left truncate' },
    },
    {
      accessorKey: 'zoneId',
      header: () => (
        <div
          className="flex items-center gap-1 cursor-pointer text-sm truncate"
          onClick={() => handleSort('zoneId')}
        >
          <span className="truncate">Zone ID</span>
          <span className="material-symbols-outlined text-sm flex-shrink-0">
            {getSortIcon('zoneId')}
          </span>
        </div>
      ),
      cell: ({ row }) => {
        const sample = row.original;
        const zoneConflict = getConflicts.zoneConflicts[sample.sampleId];
        const hasConflict = zoneConflict;

        return (
          <div
            className="text-sm truncate py-2 cursor-pointer hover:bg-gray-50 rounded px-1 flex items-center gap-2"
            onClick={() => onSampleClick?.(sample)}
          >
            <span className="text-sm truncate">{sample.zoneId || '---'}</span>
            {hasConflict && (
              <Tooltip.Provider delay={100}>
                <Tooltip.Root>
                  <Tooltip.Trigger>
                    <span className="material-symbols-outlined text-sm text-red-600 flex-shrink-0 cursor-pointer">
                      warning
                    </span>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Positioner
                      className="z-[99999]"
                      sideOffset={20}
                      side="top"
                    >
                      <Tooltip.Popup className="bg-white text-basic-black px-4 py-3 rounded-2xl border border-basic-white max-w-xs z-[99999]">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-basic-black flex items-center justify-center text-lg">
                              warning
                            </span>
                            <div className="font-semibold text-basic-black">
                              Zone already assigned
                            </div>
                          </div>
                          <div className="font-normal text-sm text-basic-black">
                            A sample has already been assigned to this zone.
                          </div>
                        </div>
                      </Tooltip.Popup>
                    </Tooltip.Positioner>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
            )}
          </div>
        );
      },
      meta: { className: 'min-w-24 text-left truncate' },
    },
    {
      accessorKey: 'lpisId',
      header: () => (
        <div
          className="flex items-center gap-1 cursor-pointer text-sm truncate text-basic-gray"
          onClick={() => handleSort('lpisId')}
        >
          <span className="truncate">LPIS ID</span>
          <span className="material-symbols-outlined text-sm flex-shrink-0">
            {getSortIcon('lpisId')}
          </span>
        </div>
      ),
      cell: ({ row }) => (
        <div
          className="text-sm truncate py-2 cursor-pointer hover:bg-gray-50 rounded px-1"
          onClick={() => onSampleClick?.(row.original)}
        >
          <span className="text-sm truncate">{row.original.lpisId}</span>
        </div>
      ),
      meta: { className: 'min-w-32 text-left truncate text-basic-black' },
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const dropdownItems = [
          {
            id: 'edit',
            label: <span className="text-sm">Edit</span>,
            icon: 'edit',
            onClick: () => handleEditSample(row.original.sampleId),
          },
          {
            id: 'delete',
            label: <span className="text-sm">Delete</span>,
            icon: 'delete',
            onClick: () => handleDeleteSample(row.original.sampleId),
            className: 'text-red-600',
          },
        ];

        return (
          <div className="flex justify-center py-2">
            <DropdownActionsNoLib
              items={dropdownItems}
              placement="bottom-end"
            />
          </div>
        );
      },
      meta: { className: 'w-12' },
    },
  ];

  return (
    <div className="flex flex-col h-full" ref={tableContainerRef}>
      <div className="flex-shrink-0 mb-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform  -translate-y-1/2 text-basic-gray  w-4 h-4" />
            <input
              type="text"
              placeholder="Search by ID, type, farm, parcel ID, zone ID, LIPS ID..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchQuery(e.target.value)
              }
              className="w-full pl-10 pr-4 py-[5px] border border-basic-white rounded-lg focus:outline-none focus:border-basic-green placeholder:text-sm placeholder:text-basic-gray"
            />
          </div>

          <div className="flex-shrink-0">
            <ParcelDropdown />
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        {samples.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <NoResultsFound
              variant="lab"
              title="No samples available!"
              description="There are no samples for this task yet. Samples will appear here once they are added."
              hasSearchTerm={false}
            />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-visible min-w-0 w-full max-w-full">
              <div className="w-full min-w-0 max-w-full">
                {filteredSamples.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center">
                    <NoResultsFound
                      variant="lab"
                      title="No samples found!"
                      description="Try adjusting your search criteria or check for typos – there might be a small mistake."
                      hasSearchTerm={true}
                    />
                  </div>
                ) : (
                  <Table className="table-fixed rounded-xl overflow-visible relative">
                    <TableHeader className="text-basic-gray bg-basic-white">
                      {columns.map((column, index) => {
                        const meta = column.meta as { className?: string };
                        return (
                          <TableHead
                            key={
                              column.id ||
                              (column as { accessorKey?: string }).accessorKey
                            }
                            className={`text-sm font-normal overflow-hidden h-9 truncate first:pl-3 ${
                              meta?.className || ''
                            } ${index === 0 ? 'rounded-l-xl' : ''} ${
                              index === columns.length - 1 ? 'rounded-r-xl' : ''
                            }`}
                          >
                            {typeof column.header === 'function'
                              ? column.header(
                                  {} as HeaderContext<Sample, unknown>
                                )
                              : column.header}
                          </TableHead>
                        );
                      })}
                    </TableHeader>
                    <TableBody className="relative">
                      {paginatedSamples.length === 0 ? (
                        <TableRow className="h-[60px] bg-white">
                          <TableCell
                            colSpan={columns.length}
                            className="h-[60px] text-center text-basic-gray"
                          >
                            No data available
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedSamples.map((sample, rowIndex) => (
                          <TableRow
                            key={`${sample.sampleId}-${rowIndex}`}
                            className={`h-[60px] border-b border-basic-white last:border-b-0 transition-colors relative first:pl-3 ${
                              selectedSample?.sampleId === sample.sampleId
                                ? 'bg-gray-50'
                                : 'bg-white hover:bg-gray-50'
                            }`}
                          >
                            {columns.map((column) => {
                              const meta = column.meta as {
                                className?: string;
                              };
                              return (
                                <TableCell
                                  key={
                                    column.id ||
                                    (column as { accessorKey?: string })
                                      .accessorKey
                                  }
                                  className={`h-[60px] overflow-visible transition-colors first:pl-3 ${
                                    meta?.className || ''
                                  }`}
                                >
                                  {typeof column.cell === 'function'
                                    ? column.cell({
                                        row: { original: sample },
                                      } as CellContext<Sample, unknown>)
                                    : column.cell}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
              </div>
            </div>

            {sortedSamples.length > 0 && (
              <div className="bg-white">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  maxVisiblePages={7}
                />
              </div>
            )}
          </>
        )}
      </div>

      {editingSample && (
        <TaskEditSample
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setEditingSample(null);
          }}
          onSave={(updatedData) => {
            handleSaveSample(updatedData);
            setIsEditDialogOpen(false);
            setEditingSample(null);
          }}
          sampleData={editingSample}
          geoCoords={geoCoords}
          taskId={taskId}
          farms={farms}
          zones={zones}
          existingSamples={samples}
        />
      )}

      {sampleToDelete && (
        <LabDeleteSample
          isOpen={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setSampleToDelete(null);
          }}
          onConfirm={handleConfirmDeleteSample}
          sampleId={sampleToDelete.sampleId}
          labOrderId={sampleToDelete.labOrderId}
        />
      )}
    </div>
  );
};
