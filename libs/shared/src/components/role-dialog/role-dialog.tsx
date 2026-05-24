'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '../button/button';
import { Input } from '../input/input';
import { Avatar } from '../avatar/avatar';
import { Dialog } from '../dialog/dialog';

export interface RoleDialogUser {
  id: string;
  name?: string;
  initials: string;
  avatarSrc?: string;
}

export interface RoleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  role?: {
    id: string;
    title: string;
    description: string;
    assignedUsers: RoleDialogUser[];
  };
  availableUsers: RoleDialogUser[];
  onSave: (roleData: {
    title: string;
    description: string;
    assignedUsers: RoleDialogUser[];
  }) => void;
}

export const RoleDialog: React.FC<RoleDialogProps> = ({
  isOpen,
  onClose,
  mode,
  role,
  availableUsers,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedUsers, setAssignedUsers] = useState<RoleDialogUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<RoleDialogUser[]>([]);

  useEffect(() => {
    if (role && mode === 'edit') {
      setTitle(role.title);
      setDescription(role.description);
      setAssignedUsers(role.assignedUsers);
    } else {
      setTitle('');
      setDescription('');
      setAssignedUsers([]);
    }
    setSearchTerm('');
    setSearchResults([]);
  }, [role, mode, isOpen]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const filtered = availableUsers.filter(
      (user) =>
        (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.initials.toLowerCase().includes(searchTerm.toLowerCase())) &&
        !assignedUsers.find((assigned) => assigned.id === user.id)
    );
    setSearchResults(filtered);
  }, [searchTerm, availableUsers, assignedUsers]);

  const handleAddUser = (user: RoleDialogUser) => {
    setAssignedUsers((prev) => [...prev, user]);
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleRemoveUser = (userId: string) => {
    setAssignedUsers((prev) => prev.filter((user) => user.id !== userId));
  };

  const handleSave = () => {
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      description: description.trim(),
      assignedUsers,
    });

    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchResults.length > 0) {
      handleAddUser(searchResults[0]);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-2xl"
      title={
        <div className="flex items-center gap-2 pb-5">
          <div className="w-8 h-8 text-basic-green rounded-lg flex items-center justify-center ">
            <span className="material-symbols-outlined text-basic-green text-xl">
              {mode === 'create' ? 'person_add' : 'person'}
            </span>
          </div>
          <span className="text-xl  font-semibold text-basic-black">
            {mode === 'create' ? 'Add new role' : 'Edit user role'}
          </span>
        </div>
      }
    >
      <div className="space-y-4  text-xs font-normal text-basic-black">
        <div className="space-y-2">
          <label className="">Role</label>
          <Input className="w-full border border-basic-white  rounded-lg py-[5px]">
            <Input.Content
              type="text"
              placeholder="Enter role name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-sm font-medium "
            />
          </Input>
        </div>

        <div className="space-y-2">
          <label className="">Description</label>
          <textarea
            placeholder="Add a description or specific information for this role..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full h-24 px-3 py-2 border text-sm font-medium border-basic-white rounded-lg resize-none focus:border-basic-green"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="">Assign this role</label>
            {assignedUsers.length > 0 && (
              <span className="text-xs text-basic-gray">
                {assignedUsers.length} user
                {assignedUsers.length !== 1 ? 's' : ''} assigned
              </span>
            )}
          </div>

          <div className="relative">
            <Input className="w-full border border-basic-white rounded-lg py-[5px]">
              <Input.Content
                type="text"
                placeholder="Search existing users and press Enter to add them"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-6 flex justify-center items-center  pr-4 w-full text-sm font-medium  "
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <span className="material-symbols-outlined text-basic-gray text-base">
                  search
                </span>
              </div>
            </Input>

            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border p-2  border-basic-white rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                {searchResults.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleAddUser(user)}
                    className="w-full flex items-center gap-2 p-1.5 hover:bg-slate-50 text-left"
                  >
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
                      size="sm"
                      rounded="sm"
                      className="w-5 h-5"
                    />
                    <span className="text-sm text-basic-black">
                      {user.name || user.initials}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {assignedUsers.length > 0 && (
            <div className="max-h-32 overflow-y-autorounded-lg p-2">
              <div className="flex flex-wrap gap-2">
                {assignedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-2 bg-basic-white text-xs text-basic-black rounded-sm p-1 flex-shrink-0"
                  >
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
                      size="sm"
                      rounded="sm"

                      className="w-5 h-5"
                    />
                    <span className="text-xs text-basic-black font-medium">
                      {user.name || user.initials}
                    </span>

                    <span
                      onClick={() => handleRemoveUser(user.id)}
                      className="material-symbols-outlined text-basic-gray text-sm cursor-pointer"
                    >
                      close
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="pt-6">
        <Button
          onClick={handleSave}
          variant="complete"
          className="w-full"
          disabled={!title.trim()}
        >
          {mode === 'create' ? 'Add' : 'Save'}
        </Button>
      </div>
    </Dialog>
  );
};
