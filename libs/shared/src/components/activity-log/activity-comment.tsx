'use client';
import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { Avatar } from '../avatar/avatar';
import { Button } from '../button/button';
import { MoreVertical, Check, X } from 'lucide-react';
import { EmojiPickerComponent } from '../emoji-picker/emoji-picker';
import {
  DropdownActionsNoLib,
  DropdownActionItem,
} from '../dropdownitems/dropdownitems';
import { DeleteCommentsDialog } from '../confirmation-dialog';

export interface ActivityComment {
  id: string;
  user: {
    name: string;
    avatarSrc?: string;
    avatarInitials?: string;
  };
  timestamp: Date;
  commentText: string;
  reactions?: {
    thumbsUp: number;
    heart: number;
  };
  selectedEmoji?: string;
  emojiReactions?: {
    [emoji: string]: number;
  };
  userEmojiReactions?: {
    [emoji: string]: boolean;
  };
}

interface ActivityCommentProps {
  comment: ActivityComment;
  isCurrentUser?: boolean;
  isLast?: boolean;
  showConnectingLine?: boolean;
  onUpdateComment?: (commentId: string, newText: string) => void;
  onDeleteComment?: (commentId: string) => void;
  onAddReaction?: (
    commentId: string,
    reactionType: 'thumbsUp' | 'heart'
  ) => void;
  onStartEdit?: (commentId: string, commentText: string) => void;
  onEmojiSelect?: (commentId: string, emoji: string) => void;
}

export const ActivityCommentItem: React.FC<ActivityCommentProps> = ({
  comment,
  isCurrentUser = false,
  isLast = false,
  showConnectingLine = true,
  onUpdateComment,
  onDeleteComment,
  onAddReaction,
  onStartEdit,
  onEmojiSelect,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const dropdownItems: DropdownActionItem[] = [
    {
      id: 'edit',
      label: 'Edit',
      icon: <span className="material-symbols-outlined text-lg">edit</span>,
      onClick: () => {
        if (onStartEdit) {
          onStartEdit(comment.id, comment.commentText);
        }
      },
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: <span className="material-symbols-outlined text-lg">delete</span>,
      className: 'text-red-600',
      onClick: () => {
        setIsDeleteDialogOpen(true);
      },
    },
  ];

  const handleReaction = (reactionType: 'thumbsUp' | 'heart') => {
    if (onAddReaction) {
      onAddReaction(comment.id, reactionType);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    if (onEmojiSelect) {
      onEmojiSelect(comment.id, emoji);
    }
  };

  const handleEmojiClick = (emoji: string) => {
    if (onEmojiSelect) {
      onEmojiSelect(comment.id, emoji);
    }
  };

  const handleConfirmDelete = () => {
    if (onDeleteComment) {
      onDeleteComment(comment.id);
    }
    if (onStartEdit) {
      onStartEdit('', '');
    }
  };

  return (
    <div className="relative flex items-start text-start w-full">
      {showConnectingLine && (
        <div
          className="absolute left-[16px] top-6 bottom-0 w-px bg-gray-200 z-0"
          style={{ height: isLast ? '0' : '100%' }}
        />
      )}
      <div className="relative z-20 bg-white rounded-full">
        <Avatar
          size="md"
          className="rounded-lg"
          avatarSrc={comment.user.avatarSrc}
          tooltipText={comment.user.name}
          row={{
            original: {
              client: {
                name: comment.user.name,
                surname: comment.user.name,
                avatarSrc: comment.user.avatarSrc,
              },
            },
          }}
        />
      </div>
      <div className="flex-1 flex flex-col ml-6 pb-4 w-full text-basic-black text-sm">
        <div className="rounded-xl border border-basic-white">
          <div className="flex items-start justify-between p-3 rounded-t-xl bg-basic-white">
            <div className="flex items-center gap-2">
              <span className="font-medium">{comment.user.name}</span>
              <span className="text-sm  font-normal">
                left a comment at {format(comment.timestamp, 'HH:mm')}
              </span>
            </div>
            {isCurrentUser && (
              <DropdownActionsNoLib
                items={dropdownItems}
                triggerClassName="h-6 w-6 p-0"
              />
            )}
          </div>

          <p className="leading-relaxed p-3">{comment.commentText}</p>
          <div className="flex items-center gap-4 p-3">
            {comment.emojiReactions &&
              Object.keys(comment.emojiReactions)
                .filter(
                  (emoji) =>
                    comment.emojiReactions && comment.emojiReactions[emoji] > 0
                )
                .map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleEmojiClick(emoji)}
                    className={`flex items-center gap-2 border px-1 h-6 transition-colors rounded-md cursor-pointer ${
                      comment.userEmojiReactions?.[emoji]
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-basic-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      <span className="text-base">{emoji}</span>
                    </div>
                    {comment.emojiReactions &&
                      comment.emojiReactions[emoji] > 0 && (
                        <span
                          className={`text-sm ${
                            comment.userEmojiReactions?.[emoji]
                              ? 'text-blue-600'
                              : 'text-gray-600'
                          }`}
                        >
                          {comment.emojiReactions[emoji]}
                        </span>
                      )}
                  </button>
                ))}
            <EmojiPickerComponent onEmojiSelect={handleEmojiSelect} />
          </div>
        </div>
        {isLast && <div className="pb-4" />}
      </div>

      <DeleteCommentsDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
