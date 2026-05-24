'use client';
import React, { useState } from 'react';
import { ClientSelectProps } from '../types';
import { StyledCheckbox } from './styled-checkbox';

export const ClientSelect: React.FC<ClientSelectProps> = ({
  clients,
  selectedFarms,
  onFieldsChange,
}) => {
  const [expandedFarm, setExpandedFarm] = useState<string | null>(null);

  const getAllDescendantValues = (field: {
    value: string;
    label: string;
    children?: any[];
  }): string[] => {
    if (!field.children) return [];
    return field.children.reduce(
      (acc: string[], child: any) => [
        ...acc,
        child.value,
        ...getAllDescendantValues(child),
      ],
      []
    );
  };

  const handleFieldToggle = (
    farmId: string,
    fieldValue: string,
    parentValue?: string
  ) => {
    const prev = selectedFarms[farmId] || [];
    let next: string[];
    const farm = clients.find((f) => f.name === farmId);
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
    onFieldsChange(farmId, next);
  };

  return (
    <div className="rounded-xl border p-2">
      {clients.map((farm) => {
        const isExpanded = expandedFarm === farm.name;
        return (
          <div
            key={farm.name}
            className="flex items-center gap-2 py-2 border-b last:border-b-0"
          >
            <button
              className="mr-2"
              onClick={() => setExpandedFarm(isExpanded ? null : farm.name)}
              type="button"
            >
              <span className="material-symbols-outlined w-6 h-6">
                {isExpanded ? 'expand_more' : 'chevron_right'}
              </span>
            </button>
            <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-green-500 text-white mr-2">
              <span className="material-symbols-outlined text-base w-6 h-6">
                check
              </span>
            </span>
            <span className="font-semibold text-lg">{farm.name}</span>
            {farm.area !== undefined && (
              <span className="text-gray-400 ml-2">{farm.area} ha</span>
            )}
            <span className="flex-1" />
            <span className="text-gray-700 font-medium mr-4">
              {selectedFarms[farm.name]?.filter((v) =>
                farm.fields.some((f) => f.value === v)
              ).length || 0}{' '}
              of {farm.fields.length}
            </span>
            <button
              className="bg-gray-100 hover:bg-gray-200 rounded-lg p-2"
              onClick={() => setExpandedFarm(isExpanded ? null : farm.name)}
              type="button"
            >
              <span className="material-symbols-outlined text-xl w-6 h-6">
                location_searching
              </span>
            </button>
          </div>
        );
      })}
      {expandedFarm && (
        <div className="pl-10 py-2">
          {clients
            .find((f) => f.name === expandedFarm)
            ?.fields.map((field) => (
              <div key={field.value} className="mb-1 pb-1">
                <div className="flex items-center gap-2 py-1">
                  <StyledCheckbox
                    checked={
                      selectedFarms[expandedFarm]?.includes(field.value) ||
                      false
                    }
                    onCheckedChange={() =>
                      handleFieldToggle(expandedFarm, field.value, field.value)
                    }
                  />
                  <span>{field.label}</span>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
