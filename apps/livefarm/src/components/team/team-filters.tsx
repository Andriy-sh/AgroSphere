'use client';

import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Button, MultiSelect } from '@@agrosphere/shared';
import { TeamUser } from '@@agrosphere/shared';

interface TeamFiltersProps {
  users: TeamUser[];
  selectedRoles: string[];
  selectedStatuses: string[];
  onRoleChange: (roles: string[]) => void;
  onStatusChange: (statuses: string[]) => void;
  onClearFilters: () => void;
}

export function TeamFilters({
  users,
  selectedRoles,
  selectedStatuses,
  onRoleChange,
  onStatusChange,
  onClearFilters,
}: TeamFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const roles = Array.from(new Set(users.map((user) => user.userRole)));
  const statuses = Array.from(new Set(users.map((user) => user.status)));

  const roleOptions = roles.map((role) => ({
    value: role,
    label: role,
  }));

  const statusOptions = statuses.map((status) => ({
    value: status,
    label: status,
  }));

  const hasActiveFilters =
    selectedRoles.length > 0 || selectedStatuses.length > 0;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 "
          >
            <Filter className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 inline-flex items-center justify-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                {selectedRoles.length + selectedStatuses.length}
              </span>
            )}
          </Button>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={onClearFilters}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
              Clear filters
            </Button>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User Role
              </label>
              <MultiSelect
                options={roleOptions}
                values={selectedRoles}
                onChange={onRoleChange}
                placeholder="Select roles..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <MultiSelect
                options={statusOptions}
                values={selectedStatuses}
                onChange={onStatusChange}
                placeholder="Select statuses..."
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
