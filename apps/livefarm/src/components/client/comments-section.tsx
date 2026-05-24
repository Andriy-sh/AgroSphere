'use client';
import React, { useState } from 'react';
import {
  Avatar,
  Button,
  ClientComment,
  Icon,
  NoResultsFound,
} from '@@agrosphere/shared';
import { CommentItem } from './comment-item';

interface CommentsSectionProps {
  comments: ClientComment[];
}

export function CommentsSection({ comments }: CommentsSectionProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [localComments, setLocalComments] = useState<ClientComment[]>(comments);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      const newComment: ClientComment = {
        user: 'User',
        text: commentText,
        date: new Date().toLocaleDateString(),
        avatarSrc: '',
      };

      setLocalComments((prev) => [...prev, newComment]);
      setCommentText('');
      setShowAddForm(false);
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setCommentText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (commentText.trim()) {
        handleSubmit(e as React.FormEvent);
      }
    }
  };

  const currentComments = localComments.length > 0 ? localComments : comments;
  const currentIsEmpty = currentComments.length === 0;

  return (
    <div className="flex-1 min-h-0 bg-white rounded-xl border border-basic-white h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-basic-white">
        <h3 className="text-base font-semibold">Comments</h3>
        <Icon onClick={() => setShowAddForm(true)} icon="add" />
      </div>

      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        {currentIsEmpty && !showAddForm ? (
          <div className="flex-1 flex items-center flex-col justify-center p-5">
            <NoResultsFound
              variant="custom"
              title="No comments yet!"
              description="Use comments to keep track of important notes, decisions, or reminders related specifically to this client."
              className=" flex items-center justify-center"
            />
            <Button
              variant="complete"
              size="sm"
              className="p-2 mt-4"
              onClick={() => setShowAddForm(true)}
            >
              <Icon icon="add" />
              Add comment
            </Button>
          </div>
        ) : (
          <div className="flex-1 min-h-0 overflow-auto p-5">
            {currentComments.map((comment, i) => (
              <div key={`${comment.user}-${comment.date}-${i}`}>
                <CommentItem comment={comment} />
                {i !== currentComments.length - 1 && (
                  <div className="w-full h-px bg-basic-white my-3" />
                )}
              </div>
            ))}
          </div>
        )}

        {showAddForm && !currentIsEmpty && (
          <div className="flex-shrink-0 border-t border-basic-white mt-4 pt-4 p-5">
            <div className="flex items-start gap-3 w-full">
              <Avatar
                className="rounded-2xl object-cover"
                row={{
                  original: {
                    client: { name: 'User', surname: '', avatarSrc: '' },
                  },
                }}
                size="md"
                tooltipText="User"
              />
              <form
                className="flex-1 flex flex-col gap-6 min-w-0"
                onSubmit={handleSubmit}
              >
                <div className="border-2 border-[#29B54C] rounded-2xl box-border flex flex-col gap-6 p-6 w-full min-w-0">
                  <textarea
                    className="w-full min-w-0 max-w-full border-none outline-none resize-none bg-transparent font-normal text-basic-gray placeholder-[#8A9299] min-h-[40px] max-h-[180px] box-border"
                    rows={2}
                    placeholder="Type a message"
                    autoFocus
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <div className="flex items-end justify-between w-full">
                    <div className="flex items-center gap-4">
                      <Icon icon="add_photo_alternate" />
                      <div className="w-px h-8 bg-basic-white" />
                      <Icon icon="attach_file" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="cancel"
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="complete"
                        size="sm"
                        disabled={!commentText.trim()}
                      >
                        Comment
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {showAddForm && currentIsEmpty && (
        <div className="absolute left-0 bottom-0 w-full bg-white border-t border-[#E5E7EB]">
          <div className="flex items-start gap-3 w-full p-6">
            <Avatar
              className="rounded-2xl object-cover"
              row={{
                original: {
                  client: { name: 'User', surname: '', avatarSrc: '' },
                },
              }}
              size="md"
              tooltipText="User"
            />
            <form
              className="flex-1 flex flex-col gap-6 min-w-0"
              onSubmit={handleSubmit}
            >
              <div className="border-2 border-[#29B54C] rounded-2xl box-border flex flex-col gap-6 p-6 w-full min-w-0">
                <textarea
                  className="w-full min-w-0 max-w-full border-none outline-none resize-none bg-transparent font-normal text-[#8A9299] placeholder-[#8A9299] min-h-[40px] max-h-[180px] box-border"
                  rows={2}
                  placeholder="Type a message"
                  autoFocus
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <div className="flex items-end justify-between w-full">
                  <div className="flex items-center gap-4">
                    <button type="button">
                      <span className="material-symbols-outlined">
                        add_photo_alternate
                      </span>
                    </button>
                    <div className="w-px h-8 bg-[#F3F4F6]" />
                    <button type="button">
                      <span className="material-symbols-outlined">
                        attach_file
                      </span>
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="cancel"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="complete"
                      size="sm"
                      disabled={!commentText.trim()}
                    >
                      Comment
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
