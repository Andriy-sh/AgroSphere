import React from 'react';
import { CommentItem } from '../comment-item/comment-item';
import { CommentForm } from '../comment-form/comment-form';
import { CommentUser, Comment } from '../../mock/mock-comments';

type Props = {
  commentsData?: Comment[];
  currentUser?: CommentUser;
  onCommentSubmit?: (commentText: string) => void;
  onCommentUpdate?: (commentId: string, newText: string) => void;
  onCommentDelete?: (commentId: string) => void;
};

export const TaskComments: React.FC<Props> = ({
  commentsData = [],
  currentUser,
  onCommentSubmit,
  onCommentUpdate,
  onCommentDelete,
}) => {
  const handleCommentSubmit = (commentText: string) => {
    if (onCommentSubmit) {
      onCommentSubmit(commentText);
    }
  };

  const handleCommentUpdate = (commentId: string, newText: string) => {
    if (onCommentUpdate) {
      onCommentUpdate(commentId, newText);
    }
  };

  const handleCommentDelete = (commentId: string) => {
    if (onCommentDelete) {
      onCommentDelete(commentId);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-screen">
      <div className="flex-1 overflow-y-auto px-2 ">
        {commentsData.map((comment) => {
          const isCurrentUser = comment.user.name === currentUser?.name;
          return (
            <CommentItem
              key={comment.id}
              user={comment.user}
              date={comment.date}
              commentText={comment.commentText}
              isCurrentUser={isCurrentUser}
              onUpdateComment={(newText) =>
                handleCommentUpdate(comment.id, newText)
              }
              onDeleteComment={() => handleCommentDelete(comment.id)}
            />
          );
        })}
      </div>
      <div className="sticky bottom-0 left-0 w-full ">
        <CommentForm
          currentUser={currentUser ?? { name: 'Unknown User' }}
          onSubmit={handleCommentSubmit}
        />
      </div>
    </div>
  );
};
