'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { UserSelect } from '../../user-select/user-select';
import { InlineOrganizationSelect } from './inline-organization-select';
import { FileUploadDialog } from './file-upload-dialog';
import { Button } from '../../button/button';
import {
  CreateTaskFormValues,
  LabOption,
  SelectOption,
  OrganizationOption,
} from '../types';
import { DateSelector } from './date-selector';
import { getFileIcon } from '../../../utils/file-utils';
import { CustomSelect } from '../../select/select';
import { Label } from '../../label/label';

interface DetailsSectionProps {
  values: CreateTaskFormValues;
  onChange: (field: keyof CreateTaskFormValues, value: string) => void;
  labs: LabOption[];
  priorities: SelectOption[];
  organizations: OrganizationOption[];
  isTaskTypeSelected: boolean;
  isClientSelected: boolean;
  hasSelectedFarms: boolean;
  isDisabled?: boolean;
  localFiles: File[];
  onFilesChange?: (files: File[]) => void;
  selectedLab?: string;
  selectedStartAfter?: string;
  selectedCompleteBy?: string;
  selectedOrganization?: { id: string | number };
  selectedUser?: { id: string | number };
  selectedPriority?: string;
}

export const DetailsSection: React.FC<DetailsSectionProps> = ({
  values,
  onChange,
  labs,
  priorities,
  organizations,
  isTaskTypeSelected,
  isClientSelected,
  hasSelectedFarms,
  isDisabled,
  localFiles,
  onFilesChange,
  selectedLab,
  selectedStartAfter,
  selectedCompleteBy,
  selectedOrganization,
  selectedUser,
  selectedPriority,
}) => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const isFormActive = !isDisabled && isClientSelected && hasSelectedFarms;

  useEffect(() => {
    if (!values.startAfter && !selectedStartAfter && isFormActive) {
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString();
      onChange('startAfter', formattedDate);
    }
  }, [values.startAfter, selectedStartAfter, isFormActive, onChange, values]);

  const parseDate = (dateString: string): Date | null => {
    try {
      let date: Date;

      if (dateString.includes('-') && dateString.split('-')[0].length === 4) {
        date = new Date(dateString);
      } else if (
        dateString.includes('-') &&
        dateString.split('-').length === 3
      ) {
        const parts = dateString.split('-');
        if (parts[2].length <= 4 && !parts[2].includes('T')) {
          const [day, month, year] = parts;
          date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        } else {
          date = new Date(dateString);
        }
      } else if (dateString.includes('/')) {
        const [day, month, year] = dateString.split('/');
        date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      } else {
        date = new Date(dateString);
      }

      return isNaN(date.getTime()) ? null : date;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const startAfterValue = values.startAfter || selectedStartAfter;
    const completeByValue = values.completeBy || selectedCompleteBy;

    if (startAfterValue && completeByValue) {
      const startDate = parseDate(startAfterValue);
      const completeDate = parseDate(completeByValue);

      if (startDate && completeDate) {
        if (completeDate < startDate) {
          onChange('completeBy', '');
        }
      }
    }
  }, [
    values.startAfter,
    selectedStartAfter,
    values.completeBy,
    selectedCompleteBy,
  ]);

  const minCompleteByDate = useMemo(() => {
    const startAfterValue = values.startAfter || selectedStartAfter;

    if (!startAfterValue) {
      return undefined;
    }

    const startDate = parseDate(startAfterValue);
    return startDate || undefined;
  }, [values.startAfter, selectedStartAfter]);

  useEffect(() => {
    if (values.assignedTo && values.assignedUser) {
      const selectedOrg = organizations.find(
        (org) => org.value === values.assignedTo
      );
      const userExists = selectedOrg?.users?.some(
        (user) => user.value === values.assignedUser
      );

      if (!userExists) {
        onChange('assignedUser', '');
      }
    }
  }, [values.assignedTo, organizations, values.assignedUser]);

  useEffect(() => {
    const startAfterValue = values.startAfter || selectedStartAfter;
    const completeByValue = values.completeBy || selectedCompleteBy;

    if (startAfterValue && completeByValue) {
      const startDate = parseDate(startAfterValue);
      const completeDate = parseDate(completeByValue);

      if (startDate && completeDate) {
        if (completeDate < startDate) {
          onChange('completeBy', '');
        }
      }
    }
  }, [
    values.startAfter,
    selectedStartAfter,
    values.completeBy,
    selectedCompleteBy,
  ]);

  const handleAttachFiles = () => setDialogOpen(true);

  const handleFilesUploaded = (uploadedFiles: File[]) => {
    if (onFilesChange) {
      onFilesChange([...localFiles, ...uploadedFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    if (onFilesChange) {
      const updatedFiles = localFiles.filter((_, i) => i !== index);
      onFilesChange(updatedFiles);
    }
  };

  return (
    <div
      className={`${isDisabled ? 'bg-transparent' : 'bg-white'}`}
      style={{
        opacity: isFormActive ? 1 : 0.5,
        pointerEvents: isFormActive ? 'auto' : 'none',
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <span
          className={`rounded-lg w-8 h-8 flex items-center justify-center font-bold text-lg ${
            isFormActive
              ? 'bg-basic-green text-white'
              : 'bg-gray-300 text-gray-500'
          }`}
        >
          2
        </span>
        <span
          className={`font-semibold text-lg ${
            isFormActive ? 'text-black' : 'text-basic-gray'
          }`}
        >
          Details
        </span>
      </div>
      <div className="mb-4 w-full">
        <Label
          className={`block font-normal text-sm mb-1 ${
            isDisabled ? 'text-basic-gray' : 'text-gray-700'
          }`}
          required
        >
          Lab
        </Label>
        <CustomSelect
          options={labs}
          value={values.lab || selectedLab || ''}
          onValueChange={(value) => onChange('lab', value)}
          disabled={!isFormActive}
          placeholder="Select lab"
          className="w-full"
          triggerClassName="h-9 w-full bg-[#EEF0F629]"
        />
      </div>
      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <Label
            className={`block font-normal text-sm mb-1 ${
              isDisabled ? 'text-basic-gray' : 'text-gray-700'
            }`}
            required
          >
            Start after
          </Label>
          <DateSelector
            value={values.startAfter || selectedStartAfter || ''}
            onChange={(value) => onChange('startAfter', value)}
            disabled={!isFormActive}
            className="w-full "
            triggerClassName="bg-[#EEF0F629] focus:border-basic-green focus:outline-none"
          />
        </div>
        <div className="flex-1">
          <Label
            className={`block font-normal text-sm mb-1 ${
              isDisabled ? 'text-basic-gray' : 'text-gray-700'
            }`}
          >
            Complete by
          </Label>
          <DateSelector
            value={values.completeBy || selectedCompleteBy || ''}
            onChange={(value) => onChange('completeBy', value)}
            disabled={!isFormActive}
            className="w-full"
            triggerClassName="bg-[#EEF0F629] focus:border-basic-green focus:outline-none"
            placeholder="Select completion date"
            showCurrentDateAsDefault={false}
            minDate={minCompleteByDate}
          />
        </div>
      </div>
      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <Label
            className={`block font-normal text-sm mb-1 ${
              isDisabled ? 'text-basic-gray' : 'text-gray-700'
            }`}
            required
          >
            Assigned to
          </Label>
          <InlineOrganizationSelect
            organizations={organizations}
            value={
              values.assignedTo || selectedOrganization?.id?.toString() || ''
            }
            onChange={(value: string) => {
              onChange('assignedTo', value);
              onChange('assignedUser', '');
            }}
            disabled={!isFormActive}
            triggerClassName="h-9 py-0 px-0 py-0 bg-[#EEF0F629]"
          />
        </div>
        {(values.assignedTo || selectedOrganization?.id) && (
          <div className="flex-1">
            <Label
              className={`block font-normal text-sm mb-1 ${
                isDisabled ? 'text-basic-gray' : 'text-gray-700'
              }`}
              required
            >
              Assigned user
            </Label>
            <UserSelect
              options={
                organizations.find(
                  (org) =>
                    org.value ===
                    (values.assignedTo ||
                      selectedOrganization?.id?.toString())
                )?.users || []
              }
              value={
                values.assignedUser || selectedUser?.id?.toString() || ''
              }
              onChange={(value) => onChange('assignedUser', value)}
              placeholder="Select user"
              className="w-full h-9 text-sm"
              avatarClassName="!w-6 !h-6 text-sm rounded-sm"
              triggerClassName="h-9 py-0 px-0 bg-[#EEF0F629]"
              disabled={!isFormActive}
              width="dynamic"
            />
          </div>
        )}
      </div>
      <div className="mb-4">
        <Label
          className={`block font-normal text-sm mb-1 ${
            isDisabled ? 'text-basic-gray' : 'text-gray-700'
          }`}
          required
        >
          Priority
        </Label>
        <CustomSelect
          options={priorities}
          value={values.priority || selectedPriority || ''}
          onValueChange={(value) => onChange('priority', value)}
          disabled={!isFormActive}
          placeholder="Select priority"
          className="w-full"
          triggerClassName="h-9 w-full bg-[#EEF0F629]"
        />
      </div>
      <div className="mb-4">
        <Label
          className={`block font-normal text-sm mb-1 ${
            isDisabled ? 'text-basic-gray' : 'text-gray-700'
          }`}
        >
          Description
        </Label>
        <textarea
          className={`w-full rounded-lg border p-3 min-h-[80px] text-gray-700 ${
            isDisabled
              ? 'border-basic-white bg-transparent opacity-50'
              : 'border-basic-white bg-[#EEF0F629]'
          }`}
          placeholder="Add a description or specific instructions for this task..."
          value={values.description}
          onChange={(e) => onChange('description', e.target.value)}
          disabled={!isFormActive}
        />
      </div>
      <div className="mb-4 flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleAttachFiles}
          disabled={!isFormActive}
          className="text-basic-green font-medium px-0"
        >
          <span className="material-symbols-outlined text-basic-green border border-basic-white p-2 rounded-lg">
            attach_file
          </span>
          Attach files
        </Button>
      </div>
      <FileUploadDialog
        isOpen={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        onFilesUploaded={handleFilesUploaded}
        localFiles={localFiles}
        onFilesChange={onFilesChange}
      />
      {localFiles.length > 0 && (
        <div className="mb-4">
          <ul className="list-disc space-y-2">
            {localFiles.map((file, idx) => (
              <li key={file.name + idx} className="flex items-center gap-2 ">
                <span
                  className={`text-sm truncate border border-basic-white rounded-lg p-2 flex-1 flex items-center ${
                    isDisabled ? 'text-basic-gray' : 'text-basic-black'
                  }`}
                >
                  {getFileIcon(file.name)}
                  {file.name}
                </span>
                <Button
                  variant="ghost"
                  onClick={() => handleRemoveFile(idx)}
                  className="p-2 rounded bg-basic-white focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 border border-basic-white"
                  title="Delete"
                  type="button"
                >
                  <span className="material-symbols-outlined text-basic-black text-sm">
                    delete
                  </span>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
