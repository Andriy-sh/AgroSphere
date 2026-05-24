'use client';

import React, { useState, useEffect } from 'react';
import { Paperclip, Mic } from 'lucide-react';
import { Avatar } from '../avatar/avatar';
import { Button } from '../button/button';

type User = {
  name: string;
  avatarSrc?: string;
  avatarInitials?: string;
};

interface CommentFormProps {
  currentUser: User;
  onSubmit: (commentText: string) => void;
  placeholder?: string;
  className?: string;
  isEditing?: boolean;
  editingCommentText?: string;
  onCancelEdit?: () => void;
}

export const CommentForm: React.FC<CommentFormProps> = ({
  currentUser,
  onSubmit,
  placeholder = 'Type a message',
  className = '',
  isEditing = false,
  editingCommentText = '',
  onCancelEdit,
}) => {
  const [commentText, setCommentText] = useState('');
  const [originalText, setOriginalText] = useState('');

  useEffect(() => {
    if (isEditing && editingCommentText) {
      setCommentText(editingCommentText);
      setOriginalText(editingCommentText);
    } else if (!isEditing) {
      setCommentText('');
      setOriginalText('');
    }
  }, [isEditing, editingCommentText]);

  const handleSubmit = () => {
    if (commentText.trim()) {
      onSubmit(commentText.trim());
      if (!isEditing) {
        setCommentText('');
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleCancel = () => {
    if (isEditing && onCancelEdit) {
      setCommentText(originalText);
      onCancelEdit();
    } else {
      setCommentText('');
    }
  };

  return (
    <div className={`${className}`}>
      {isEditing && (
        <div className="relative flex  gap-3 mb-2 justify-start items-start">
          <Avatar
            size="lg"
            rounded="md"
            tooltipText="Current User"
            row={{
              original: {
                client: {
                  name: currentUser.name,
                  surname: '',
                  avatarSrc: currentUser.avatarSrc,
                },
              },
            }}
          />
          <div className="flex gap-2 border border-basic-white rounded-xl border-l-2 p-2 flex-1">
            <div className="flex flex-col gap-2 text-sm text-basic-black">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base">
                  edit
                </span>
                <span className="font-medium">Edit comment:</span>
              </div>
              <span className="text-gray-600 truncate max-w-xs">
                {editingCommentText.length > 50
                  ? editingCommentText.substring(0, 50) + '...'
                  : editingCommentText}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="absolute top-4 right-4 p-1"
            title="Cancel editing"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </Button>
        </div>
      )}

      <div className="flex items-start gap-3">
        <div className={isEditing ? 'invisible' : 'visible'}>
          <Avatar
            size="lg"
            rounded="md"
            tooltipText="Current User"
            row={{
              original: {
                client: {
                  name: currentUser.name,
                  surname: '',
                  avatarSrc: currentUser.avatarSrc,
                },
              },
            }}
          />
        </div>
        <div className="flex-1 p-4 border border-basic-white focus-within:border-basic-green focus:outline-none focus-within:border-1 transition-all duration-300 rounded-2xl bg-white">
          <textarea
            className="w-full rounded-md focus:outline-none focus:ring-0 resize-y min-h-[52px]"
            placeholder={isEditing ? 'Edit your comment...' : placeholder}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyPress={handleKeyPress}
          />

          <div className="flex justify-between items-center mt-2">
            <div className="flex gap-2 text-gray-800">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-md px-0"
                title="Add photo"
              >
                <span className="material-symbols-outlined">
                  add_photo_alternate
                </span>
              </Button>
              <div className="w-px h-8 bg-basic-white"></div>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-md px-0"
                title="Attach file"
              >
                <span className="material-symbols-outlined">attach_file</span>
              </Button>
            </div>
            <div className="flex gap-2">
              {isEditing && (
                <Button
                  variant="cancel"
                  size="default"
                  onClick={handleCancel}
                  type="button"
                >
                  Cancel
                </Button>
              )}
              <Button
                variant="update"
                size="default"
                onClick={handleSubmit}
                disabled={!commentText.trim()}
                type="button"
              >
                {isEditing ? 'Update' : 'Comment'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
