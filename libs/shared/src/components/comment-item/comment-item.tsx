'use client';
import React, { useState } from 'react';
import { Avatar } from '../avatar/avatar';
import { format } from 'date-fns';
import { Edit, Trash2 } from 'lucide-react';
import {
  DropdownActionsNoLib,
  DropdownActionItem,
} from '../dropdownitems/dropdownitems';
import { Dialog } from '../dialog/dialog';

interface CommentItemProps {
  user: {
    name: string;
    avatarSrc?: string;
    avatarInitials?: string;
  };
  date: Date;
  commentText: string;
  isCurrentUser?: boolean;
  onUpdateComment?: (newText: string) => void;
  onDeleteComment?: () => void;
  className?: string;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  user,
  date,
  commentText,
  isCurrentUser = false,
  onUpdateComment,
  onDeleteComment,
  className,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editCommentText, setEditCommentText] = useState(commentText);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    if (onUpdateComment && editCommentText.trim() !== commentText) {
      onUpdateComment(editCommentText.trim());
    }
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setEditCommentText(commentText);
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (onDeleteComment) {
      onDeleteComment();
    }
    setIsDeleteDialogOpen(false);
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
  };

  const getDropdownItems = (): DropdownActionItem[] => [
    {
      id: 'edit',
      label: 'Edit',
      icon: <Edit size={16} />,
      onClick: handleEditClick,
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: <Trash2 size={16} />,
      onClick: handleDeleteClick,
    },
  ];

  return (
    <>
      <div className={`flex items-start gap-3 p-5 relative ${className}`}>
        <div className="absolute bottom-0 left-16 right-0 h-px bg-basic-white last:hidden"></div>
        <Avatar
          size="md"
          className="rounded-lg !h-9 !w-9"
          avatarSrc={user.avatarSrc}
          tooltipText={user.name}
          row={{
            original: {
              client: {
                name: user.name,
                surname: user.name,
                avatarSrc: user.avatarSrc,
              },
            },
          }}
        />
        <div className="flex-1">
          <div className="flex justify-between items-start mb-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-basic-black">{user.name}</span>
              <div className="w-px h-4 bg-gray-300"></div>
              <span className="material-symbols-outlined text-basic-gray text-lg">
                calendar_today
              </span>
              <span className="text-sm text-gray-500">
                {format(date, 'dd/MM/yyyy')}
              </span>
            </div>
            {isCurrentUser && (
              <DropdownActionsNoLib
                items={getDropdownItems()}
                triggerClassName="hover:bg-gray-100"
              />
            )}
          </div>
          {isEditing ? (
            <div className="mt-2 border border-basic-green rounded-md p-4">
              <textarea
                className="w-full rounded-md focus:outline-none focus:ring-0 resize-y min-h-[60px]"
                value={editCommentText}
                onChange={(e) => setEditCommentText(e.target.value)}
              ></textarea>

              <div className="flex justify-between items-center mt-2">
                <div className="flex gap-2 text-gray-800">
                  <button
                    className="  rounded-md"
                    type="button"
                    title="Attach file"
                  >
                    <span className="material-symbols-outlined">
                      add_photo_alternate
                    </span>
                  </button>
                  <div className="w-px h-6 bg-basic-white mx-0.5"></div>
                  <button
                    className=" rounded-md"
                    type="button"
                    title="Voice message"
                  >
                    <span className="material-symbols-outlined">
                      attach_file
                    </span>
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-200"
                    type="button"
                    onClick={handleCancelClick}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-black text-white px-4 py-2 rounded-md font-medium hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleSaveClick}
                    disabled={!editCommentText.trim()}
                    type="button"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-700 leading-relaxed">{commentText}</p>
          )}
        </div>
      </div>

      <Dialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCancelDelete}
        title=""
        showCloseButton={false}
      >
        <div className="flex flex-col items-center text-center ">
          <div className="flex items-center justify-center w-12 h-12 rounded-md bg-red-50 mb-3">
            <Trash2 size={18} className="text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Delete comment!
          </h2>
          <p className="text-gray-600 mb-6 text-sm">
            Are you sure you want to delete this comment? This action is
            irreversible.
          </p>
          <div className="flex w-full gap-4 text-sm">
            <button
              onClick={handleCancelDelete}
              className="flex-1 px-7 py-3  rounded-lg bg-gray-100 text-gray-500 font-semibold  hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              className="flex-1 px-7 py-3 rounded-lg bg-red-500 text-white font-semibold  hover:bg-red-600 transition"
            >
              Delete
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
};
