import React from 'react';

interface TeamRolesNavigationProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCreateRole: () => void;
}

export const TeamRolesNavigation: React.FC<TeamRolesNavigationProps> = ({
  searchTerm,
  onSearchChange,
  onCreateRole,
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm mb-4">
      <div className="flex items-center gap-4 flex-1">
        <h2 className="text-xl font-semibold text-gray-900">User roles</h2>
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              search
            </span>
            <input
              type="text"
              placeholder="Search roles..."
              value={searchTerm}
              onChange={onSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
      <button
        onClick={onCreateRole}
        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
      >
        <span className="material-symbols-outlined text-lg">add</span>
        Create role
      </button>
    </div>
  );
};
