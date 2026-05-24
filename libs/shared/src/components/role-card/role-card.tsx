import * as React from 'react';
import { cn } from '../../utils/cn';
import { Avatar } from '../avatar/avatar';
// import { Icon } from '../icon';

export interface RoleCardProps {
  title: string;
  description: string;
  assignedUsers: Array<{
    id: string;
    initials: string;
    name?: string;
    avatarSrc?: string;
  }>;
  onEdit?: (e?: React.MouseEvent) => void;
  onAddUser?: (e?: React.MouseEvent) => void;
  className?: string;
  maxVisibleUsers?: number;
}

export const RoleCard: React.FC<RoleCardProps> = ({
  title,
  description,
  assignedUsers,
  // onEdit,
  onAddUser,
  className,
  maxVisibleUsers = 4,
}) => {
  const truncatedDescription =
    description.length > 120
      ? `${description.substring(0, 120)}...`
      : description;

  return (
    <div
      className={cn(
        'bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col',
        className
      )}
    >
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-basic-black">{title}</h3>
          {/* {onEdit && (
            <Icon
              onClick={onEdit}
              icon="edit"
              className="material-symbols-outlined text-gray-600 text-lg"
            />
          )} */}
        </div>
      </div>

      <div className="p-5 flex flex-col gap-5 flex-1">
        <p className="text-sm text-basic-black leading-relaxed overflow-hidden">
          {truncatedDescription}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-gray-500 text-lg">
              person
            </span>
            <span className="text-sm text-gray-600">Assigned this role:</span>
          </div>

          <div className="flex items-center gap-2">
            {assignedUsers.slice(0, maxVisibleUsers).map((user) => (
              <Avatar
                key={user.id}
                row={{
                  original: {
                    client: {
                      name: user.name?.split(' ')[0] || user.initials,
                      surname: user.name?.split(' ')[1] || '',
                      avatarSrc: user.avatarSrc,
                    },
                  },
                }}
                avatarSrc={user.avatarSrc}
                size="md"
                rounded="lg"
                className="w-8 h-8"
              />
            ))}

            {assignedUsers.length > maxVisibleUsers && (
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-xs font-medium text-gray-600">
                +{assignedUsers.length - maxVisibleUsers}
              </div>
            )}

            {onAddUser && (
              <button
                onClick={onAddUser}
                className="w-8 h-8 bg-white border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                aria-label="Add user to role"
              >
                <span className="material-symbols-outlined text-green-600 text-lg">
                  add
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
