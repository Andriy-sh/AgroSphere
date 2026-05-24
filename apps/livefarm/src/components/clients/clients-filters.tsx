'use client';

export interface ClientFilters {
  assignee?: string;
  tags?: string[];
}
import {  Icon, Label, MultiSelect, UserSelect } from '@@agrosphere/shared';

interface ClientsFiltersProps {
  showFilters: boolean;
  filters: ClientFilters;
  onFiltersChange: (filters: ClientFilters) => void;
  onClearFilters: () => void;
  loading?: boolean;
}

const MOCK_ASSIGNEE_OPTIONS = [
  { value: '', label: '-- Select assignee --' },
  { value: 'john-doe', label: 'John Doe', initials: 'JD', avatar: '' },
  { value: 'jane-smith', label: 'Jane Smith', initials: 'JS', avatar: '' },
  { value: 'mike-wilson', label: 'Mike Wilson', initials: 'MW', avatar: '' },
];

const MOCK_TAG_OPTIONS = [
  { value: '', label: '-- Select tags --' },
  { value: 'dairy', label: 'Dairy' },
  { value: 'beef', label: 'Beef' },
  { value: 'organic', label: 'Organic' },
  { value: 'conventional', label: 'Conventional' },
];

export function ClientsFilters({
  showFilters,
  filters,
  onFiltersChange,
  onClearFilters,
  loading = false,
}: ClientsFiltersProps) {
  if (!showFilters) return null;

  const handleAssigneeChange = (value: string) => {
    onFiltersChange({ ...filters, assignee: value });
  };

  const handleTagsChange = (values: string[]) => {
    onFiltersChange({ ...filters, tags: values });
  };

  return (
    <div className="flex gap-4 bg-white items-end">
      <div className="flex flex-col w-1/2">
        <Label className=" mb-1">Assigned consultant</Label>
        <UserSelect
          options={MOCK_ASSIGNEE_OPTIONS}
          value={filters.assignee || ''}
          onChange={handleAssigneeChange}
          placeholder="Select assignee"
          className="w-full text-sm"
          triggerClassName="w-full"
          avatarClassName="!w-5 !h-5 !text-xs text-basic-black"
          disabled={loading}
        />
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <Label className="mb-1">Tags</Label>
        <MultiSelect
          options={MOCK_TAG_OPTIONS}
          values={filters.tags || []}
          onChange={handleTagsChange}
          placeholder="Select tags"
          className="w-full text-basic-black text-sm"
        />
      </div>
      <button
        className="h-9 w-9 flex items-center justify-center rounded-lg bg-basic-white hover:bg-gray-100 transition"
        onClick={onClearFilters}
        disabled={loading}
      >
        <Icon icon="rotate_left"/>
      </button>
    </div>
  );
}
