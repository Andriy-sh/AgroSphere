'use client';
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Collapsible } from '../collapsible/collapsible';
import { Avatar } from '../avatar/avatar';
import { ActivityCommentItem, ActivityComment } from './activity-comment';
import { CustomScrollbar } from '../custom-scrollbar/custom-scrollbar';
import {
  TaskCreatedMessage,
  TaskAssignedMessage,
  TaskStatusChangedMessage,
  DocumentsUploadedMessage,
  CommentLeftMessage,
} from './activity-message-content';
export type User = {
  name: string;
  avatarSrc?: string;
  avatarInitials?: string;
};

export type Activity = {
  id: string;
  user: User;
  timestamp: Date;
  isRead?: boolean;
  isCompleted?: boolean;
  type:
    | 'task_created'
    | 'task_assigned'
    | 'task_status_changed'
    | 'documents_uploaded'
    | 'comment_left'
    | 'comment';
  taskCreatedData?: {
    taskTitle: string;
    location: string;
  };
  taskAssignedData?: {
    taskTitle: string;
  };
  taskStatusChangedData?: {
    statusText: string;
  };
  documentsUploadedData?: {
    documentName: string;
    documentType: string;
  };
  commentLeftData?: {
    commentText: string;
  };
  commentData?: ActivityComment;
};

export type ActivityGroupData = {
  title: string;
  activities: Activity[];
};

interface ActivityLogProps {
  activityGroups: ActivityGroupData[];
  showConnectingLine?: boolean;
  showSeparator?: boolean;
  showUnreadIndicator?: boolean;
  showCompletionStatus?: boolean;
  currentUser?: User;
  onUpdateComment?: (commentId: string, newText: string) => void;
  onDeleteComment?: (commentId: string) => void;
  onAddReaction?: (
    commentId: string,
    reactionType: 'thumbsUp' | 'heart'
  ) => void;
  onAddNewComment?: (commentText: string) => void;
  onStartEdit?: (commentId: string, commentText: string) => void;
  onCancelEdit?: () => void;
  editingComment?: { id: string; text: string } | null;
  onEmojiSelect?: (commentId: string, emoji: string) => void;
}

export const ActivityItem: React.FC<{
  activity: Activity;
  isLast: boolean;
  showConnectingLine?: boolean;
  showSeparator?: boolean;
  showUnreadIndicator?: boolean;
  showCompletionStatus?: boolean;
  currentUser?: User;
  onUpdateComment?: (commentId: string, newText: string) => void;
  onDeleteComment?: (commentId: string) => void;
  onAddReaction?: (
    commentId: string,
    reactionType: 'thumbsUp' | 'heart'
  ) => void;
  onStartEdit?: (commentId: string, commentText: string) => void;
  onEmojiSelect?: (commentId: string, emoji: string) => void;
}> = ({
  activity,
  isLast,
  showConnectingLine = true,
  showSeparator = false,
  showUnreadIndicator = false,
  showCompletionStatus = false,
  currentUser,
  onUpdateComment,
  onDeleteComment,
  onAddReaction,
  onStartEdit,
  onEmojiSelect,
}) => {
  if (activity.type === 'comment' && activity.commentData) {
    return (
      <ActivityCommentItem
        comment={activity.commentData}
        isCurrentUser={currentUser?.name === activity.commentData.user.name}
        isLast={isLast}
        showConnectingLine={showConnectingLine}
        onUpdateComment={onUpdateComment}
        onDeleteComment={onDeleteComment}
        onAddReaction={onAddReaction}
        onStartEdit={onStartEdit}
        onEmojiSelect={onEmojiSelect}
      />
    );
  }

  return (
    <div className="relative flex items-start text-start w-full">
      {showConnectingLine && (
        <div
          className="absolute left-[16px] top-6 bottom-0 w-px bg-basic-white z-0"
          style={{ height: isLast ? '0' : '100%' }}
        />
      )}
      <div className="relative z-20 bg-white rounded-full">
        <Avatar
          size="lg"
          className="rounded-lg"
          avatarSrc={activity.user.avatarSrc}
          tooltipText={activity.user.name}
          row={{
            original: {
              client: {
                name: activity.user.name,
                surname: activity.user.name,
                avatarSrc: activity.user.avatarSrc,
              },
            },
          }}
        />
      </div>
      <div className="flex-1 flex flex-col ml-6 pb-4 w-full">
        <div className="flex items-start justify-between">
          <p className="text-basic-black leading-tight text-sm flex-1 flex items-center gap-1">
            <span className="font-medium">{activity.user.name}</span>{' '}
            {activity.type === 'task_created' && activity.taskCreatedData && (
              <TaskCreatedMessage
                taskTitle={activity.taskCreatedData.taskTitle}
                location={activity.taskCreatedData.location}
              />
            )}
            {activity.type === 'task_assigned' && activity.taskAssignedData && (
              <TaskAssignedMessage
                taskTitle={activity.taskAssignedData.taskTitle}
              />
            )}
            {activity.type === 'task_status_changed' &&
              activity.taskStatusChangedData && (
                <TaskStatusChangedMessage
                  statusText={activity.taskStatusChangedData.statusText}
                />
              )}
            {activity.type === 'documents_uploaded' &&
              activity.documentsUploadedData && (
                <DocumentsUploadedMessage
                  documentName={activity.documentsUploadedData.documentName}
                  documentType={activity.documentsUploadedData.documentType}
                />
              )}
            {activity.type === 'comment_left' && activity.commentLeftData && (
              <CommentLeftMessage
                commentText={activity.commentLeftData.commentText}
              />
            )}
          </p>
          {showUnreadIndicator && !activity.isRead && (
            <div className="w-1.5 h-1.5 bg-basic-red rounded-full ml-2 mt-1 flex-shrink-0" />
          )}
        </div>
        <div className="text-basic-gray font-normal mt-0.5 text-xs">
          {format(activity.timestamp, 'MMM d yyyy • h:mm a')}
        </div>

        {showSeparator && !isLast && (
          <div className="mt-4">
            <div className="border-t border-gray-200" />
          </div>
        )}
      </div>
    </div>
  );
};

export const ActivityLog: React.FC<ActivityLogProps> = ({
  activityGroups,
  showConnectingLine = true,
  showSeparator = false,
  showUnreadIndicator = false,
  showCompletionStatus = false,
  currentUser,
  onUpdateComment,
  onDeleteComment,
  onAddReaction,
  onAddNewComment,
  onStartEdit,
  onCancelEdit,
  editingComment,
  onEmojiSelect,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingCommentText, setEditingCommentText] = useState('');

  useEffect(() => {
    if (editingComment) {
      setIsEditing(true);
      setEditingCommentText(editingComment.text);
    } else {
      setIsEditing(false);
      setEditingCommentText('');
    }
  }, [editingComment]);

  const handleStartEdit = (commentId: string, commentText: string) => {
    if (!commentId) {
      setIsEditing(false);
      setEditingCommentText('');
      if (onCancelEdit) {
        onCancelEdit();
      }
      return;
    }

    setIsEditing(true);
    setEditingCommentText(commentText);
    if (onStartEdit) {
      onStartEdit(commentId, commentText);
    }
  };

  return (
    <div className="rounded-lg h-full overflow-hidden w-full flex flex-col">
      <CustomScrollbar className="flex-1 min-h-0">
        <div className="pb-40">
          {activityGroups.map((group, groupIdx) => (
            <div key={group.title} className="mb-6 last:mb-0 w-full">
              <Collapsible
                title={group.title}
                className="bg-none rounded-lg w-full"
                defaultOpen={groupIdx === 0}
              >
                <div className="relative w-full">
                  {group.activities.map((activity, idx) => (
                    <ActivityItem
                      key={activity.id}
                      activity={activity}
                      isLast={idx === group.activities.length - 1}
                      showConnectingLine={showConnectingLine}
                      showSeparator={showSeparator}
                      showUnreadIndicator={showUnreadIndicator}
                      showCompletionStatus={showCompletionStatus}
                      currentUser={currentUser}
                      onUpdateComment={onUpdateComment}
                      onDeleteComment={onDeleteComment}
                      onAddReaction={onAddReaction}
                      onStartEdit={handleStartEdit}
                      onEmojiSelect={onEmojiSelect}
                    />
                  ))}
                </div>
              </Collapsible>
            </div>
          ))}
        </div>
      </CustomScrollbar>
    </div>
  );
};
