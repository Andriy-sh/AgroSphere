'use client';

import React, { useState, useMemo } from 'react';
import { TaskComments } from '../task-comments/task-comments';
import { ActivityComment } from '../activity-log/activity-comment';

interface TaskCommentsWrapperProps {
  initialComments: ActivityComment[];
  currentUser: {
    name: string;
    avatarSrc?: string;
    avatarInitials?: string;
  };
  onCommentSubmit?: (comment: ActivityComment) => void;
  onCommentUpdate?: (commentId: string, newText: string) => void;
  onCommentDelete?: (commentId: string) => void;
}

export function TaskCommentsWrapper({
  initialComments,
  currentUser,
  onCommentSubmit,
  onCommentUpdate,
  onCommentDelete,
}: TaskCommentsWrapperProps) {
  const [comments, setComments] = useState<ActivityComment[]>(initialComments);

  const handleCommentSubmit = (commentText: string) => {
    const newComment: ActivityComment = {
      id: Date.now().toString(),
      user: currentUser,
      timestamp: new Date(),
      commentText: commentText,
      reactions: {
        thumbsUp: 0,
        heart: 0,
      },
    };

    setComments([...comments, newComment]);
    onCommentSubmit?.(newComment);
  };

  const handleCommentUpdate = (commentId: string, newText: string) => {
    const updatedComments = comments.map((comment) =>
      comment.id === commentId ? { ...comment, commentText: newText } : comment
    );

    setComments(updatedComments);
    onCommentUpdate?.(commentId, newText);
  };

  const handleCommentDelete = (commentId: string) => {
    const filteredComments = comments.filter(
      (comment) => comment.id !== commentId
    );
    setComments(filteredComments);
    onCommentDelete?.(commentId);
  };

  const convertedComments = useMemo(() => {
    return comments.map((comment) => ({
      id: comment.id,
      user: comment.user,
      date: comment.timestamp,
      commentText: comment.commentText,
    }));
  }, [comments]);

  const StableTaskComments = useMemo(() => {
    return (
      <TaskComments
        commentsData={convertedComments}
        currentUser={currentUser}
        onCommentSubmit={handleCommentSubmit}
        onCommentUpdate={handleCommentUpdate}
        onCommentDelete={handleCommentDelete}
      />
    );
  }, [convertedComments, currentUser]);

  return StableTaskComments;
}
