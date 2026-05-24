'use client';
import React, { useState, useEffect } from 'react';
import { Farm } from '../types';
import { StyledCheckbox } from './styled-checkbox';
import { TreeCheckbox } from './tree-checkbox';

interface FarmsSectionProps {
  farms: Farm[];
  selectedFarms: Record<string, string[]>;
  onFarmsChange: (farmId: string, selectedFields: string[]) => void;
  isTaskTypeSelected: boolean;
  isDisabled?: boolean;
  onZoomToFarm?: (farmId: string) => void;
  resetExpanded?: boolean;
}

export const FarmsSection: React.FC<FarmsSectionProps> = ({
  farms,
  selectedFarms,
  onFarmsChange,
  isTaskTypeSelected,
  isDisabled,
  onZoomToFarm,
  resetExpanded,
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>(
    {}
  );
  const [expandedFarm, setExpandedFarm] = useState<string | null>(null);

  useEffect(() => {
    if (resetExpanded) {
      setExpandedNodes({});
      setExpandedFarm(null);
    }
  }, [resetExpanded]);

  const getAllDescendantValues = (field: {
    value: string;
    label: string;
    children?: any[];
  }): string[] => {
    if (!field.children) return [];
    const result = field.children.reduce(
      (acc: string[], child: any) => [
        ...acc,
        child.value,
        ...getAllDescendantValues(child),
      ],
      []
    );
    return result;
  };

  const handleFieldToggle = (
    farmId: string,
    fieldValue: string,
    parentValue?: string
  ) => {
    const prev = selectedFarms[farmId] || [];
    let next: string[];
    const farm = farms.find((f) => f.id === farmId);
    const field = farm?.fields.find((f) => f.value === fieldValue);
    const allDescendants = field ? getAllDescendantValues(field) : [];

    if (field && field.children && field.children.length > 0) {
      if (prev.includes(fieldValue)) {
        next = prev.filter(
          (v) => v !== fieldValue && !allDescendants.includes(v)
        );
      } else {
        next = [
          ...prev,
          fieldValue,
          ...allDescendants.filter((v) => !prev.includes(v)),
        ];
      }
    } else if (prev.includes(fieldValue)) {
      next = prev.filter((v) => v !== fieldValue);
      if (parentValue) {
        const parent = farm?.fields.find((f) => f.value === parentValue);
        if (
          parent?.children?.every((child: any) => !next.includes(child.value))
        ) {
          next = next.filter((v) => v !== parentValue);
        }
      }
    } else {
      next = [...prev, fieldValue];
      if (parentValue && !next.includes(parentValue)) {
        next.push(parentValue);
      }
    }
    onFarmsChange(farmId, next);
  };

  const getAllFieldValues = (farm: Farm): string[] => {
    const flatten = (fields: any[]): string[] =>
      fields.flatMap((field) => [
        field.value,
        ...(field.children ? flatten(field.children) : []),
      ]);
    const result = flatten(farm.fields);
    return result;
  };

  const handleFarmToggle = (farmId: string) => {
    const farm = farms.find((f) => f.id === farmId);
    if (!farm) {
      return;
    }

    const currentSelected = selectedFarms[farmId] || [];
    const allFieldValues = getAllFieldValues(farm);
    const isFarmSelected = currentSelected.length > 0;

    if (isFarmSelected) {
      onFarmsChange(farmId, []);
    } else {
      onFarmsChange(farmId, allFieldValues);
    }
  };

  const handleExpand = (value: string) => {
    setExpandedNodes((prev) => ({ ...prev, [value]: !prev[value] }));
  };

  return (
    <div className="mb-4">
      <label
        className={`block font-normal text-sm mb-1 ${
          isDisabled ? 'text-basic-gray' : 'text-gray-700'
        }`}
      >
        Farms <span className="text-red-500">*</span>
      </label>
      <div className={`rounded-lg p-2 ${isDisabled && 'bg-transparent'}`}>
        <div>
          {farms.length === 0 ? (
            <div className="text-gray-500 text-sm p-4 text-center">
              There are no available farms for the selected client.
            </div>
          ) : (
            farms.map((farm) => (
              <div
                key={farm.name}
                className="mb-2 border-b border-gray-200 last:border-b-0 pb-2"
              >
                <div className="flex items-center gap-2 p-2">
                  <button
                    className={`w-6 h-6 ${
                      isDisabled
                        ? 'cursor-default'
                        : 'cursor-pointer hover:bg-gray-100 rounded'
                    }`}
                    onClick={() =>
                      setExpandedFarm(
                        expandedFarm === farm.name ? null : farm.name
                      )
                    }
                    type="button"
                    disabled={!isTaskTypeSelected || isDisabled}
                  >
                    <span
                      className={`material-symbols-outlined transition-transform duration-200 ease-in-out ${
                        expandedFarm === farm.name ? 'rotate-90' : ''
                      } ${isDisabled ? 'text-gray-300' : 'text-gray-600'}`}
                    >
                      arrow_right
                    </span>
                  </button>
                  <StyledCheckbox
                    checked={
                      farm.id
                        ? (selectedFarms[farm.id]?.length || 0) > 0
                        : false
                    }
                    onCheckedChange={(checked) => {
                      if (farm.id) {
                        handleFarmToggle(farm.id);
                      }
                    }}
                    disabled={!isTaskTypeSelected || isDisabled}
                  />
                  <span
                    className={`font-medium text-sm ${
                      isDisabled ? 'text-gray-400' : 'text-black'
                    }`}
                  >
                    {farm.name}
                  </span>
                  <span
                    className={`ml-2 font-medium text-sm ${
                      isDisabled ? 'text-gray-300' : 'text-gray-400'
                    }`}
                  >
                    {farm.area} ha
                  </span>
                  <span className="flex-1" />
                  <span
                    className={`font-medium text-xs mr-4 ${
                      isDisabled ? 'text-gray-300' : 'text-basic-black'
                    }`}
                  >
                    {farm.id
                      ? selectedFarms[farm.id]?.filter((v: string) =>
                          farm.fields.some((f) => f.value === v)
                        ).length || 0
                      : 0}{' '}
                    of {farm.fields.length}
                  </span>
                  <button
                    className={`rounded-lg p-2 bg-gray-100 hover:bg-gray-200 cursor-pointer`}
                    disabled={!isTaskTypeSelected}
                    onClick={() => {
                      if (onZoomToFarm && farm.id) {
                        onZoomToFarm(farm.id);
                      }
                    }}
                    type="button"
                  >
                    <span
                      className={`material-symbols-outlined text-xl w-6 h-6  text-gray-600`}
                    >
                      location_searching
                    </span>
                  </button>
                </div>
                {expandedFarm === farm.name && (
                  <div className="pl-10">
                    {farm.fields.map((field) => (
                      <div key={field.value} className="mb-1 pb-1">
                        <TreeCheckbox
                          node={field}
                          checked={
                            farm.id
                              ? selectedFarms[farm.id]?.includes(field.value) ||
                                false
                              : false
                          }
                          onToggle={(value, parentValue) =>
                            farm.id
                              ? handleFieldToggle(farm.id, value, parentValue)
                              : undefined
                          }
                          expanded={!!expandedNodes[field.value]}
                          onExpand={handleExpand}
                          selectedFarms={selectedFarms}
                          parentId={farm.id || ''}
                          parentValue={field.value}
                          disabled={!isTaskTypeSelected || isDisabled}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
