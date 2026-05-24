import React from 'react';
import { Role, Avatar, Button, Toggle, Icon } from '@@agrosphere/shared';
import { Plus } from 'lucide-react';

interface Permission {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

interface TeamRoleDetailProps {
  role: Role;
  permissions: Permission[];
  onBack: () => void;
  // onEditRole: () => void;
  onAddUser: () => void;
  onTogglePermission: (permissionId: string) => void;
}

export const TeamRoleDetail: React.FC<TeamRoleDetailProps> = ({
  role,
  permissions,
  onBack,
  // onEditRole,
  onAddUser,
  onTogglePermission,
}) => {
  return (
    <div className="flex flex-col h-full  ">
      <div className="flex items-center gap-2 mb-6">
        <Button
          onClick={onBack}
          variant="ghost"
          size="icon"
          className="p-2"
          aria-label="Go back"
        >
          <span className="material-symbols-outlined text-gray-600">
            arrow_back
          </span>
        </Button>
        <h1 className="text-xl font-semibold text-basic-black">{role.title}</h1>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg mb-2 shadow-sm border border-basic-white">
          <div className="p-5 border-b border-basic-white">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-basic-black">
                {role.title}
              </h2>

              {/* <Icon
                icon="edit"
                onClick={onEditRole}
                className="material-symbols-outlined text-basic-black text-lg"
              /> */}
            </div>
          </div>

          <div className="p-5 border-b border-basic-white">
            <p className="text-sm text-basic-black leading-relaxed">
              {role.description}
            </p>
          </div>

          <div className="p-5">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-gray-500 text-lg">
                  person
                </span>
                <span className="text-sm text-gray-600">
                  Assigned this role:
                </span>
              </div>

              <Button
                onClick={onAddUser}
                size="sm"
                variant="ghost"
                className="flex items-center gap-2 "
              >
                <Plus className="w-2 h-2 text-basic-white bg-basic-green rounded-full" />
                Add user
              </Button>
            </div>

            <div className="space-y-0">
              {role.assignedUsers.map((user, index) => (
                <div key={user.id}>
                  <div className="flex items-center justify-between rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar
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
                      <span className="text-sm font-medium text-basic-black">
                        {user.name}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 bg-basic-white px-2 py-1 rounded">
                      {role.title}
                    </span>
                  </div>
                  {index < role.assignedUsers.length - 1 && (
                    <div className="h-px bg-basic-white my-3" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg mb-2 shadow-sm border border-basic-white">
          <div className="p-5 border-b border-basic-white">
            <h2 className="text-lg font-semibold text-basic-black">
              Role permissions
            </h2>
          </div>

          <div className="p-5">
            <div className="space-y-0">
              {permissions.map((permission, index) => (
                <div key={permission.id}>
                  <div className="flex items-center gap-4">
                    <Toggle
                      checked={permission.enabled}
                      onCheckedChange={() => onTogglePermission(permission.id)}
                      size="md"
                    />
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-basic-black mb-1">
                        {permission.title}
                      </h3>
                      <p className="text-xs text-gray-600">
                        {permission.description}
                      </p>
                    </div>
                  </div>
                  {index < permissions.length - 1 && (
                    <div className="h-px bg-basic-white my-3" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
