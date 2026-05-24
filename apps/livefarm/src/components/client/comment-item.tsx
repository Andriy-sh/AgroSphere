'use client';
import React from 'react';
import { Avatar, ClientComment } from '@@agrosphere/shared';

interface CommentItemProps {
  comment: ClientComment;
}

export function CommentItem({ comment }: CommentItemProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-sm">
        <Avatar
          className=" text-basic-green font-bold mr-1  rounded-lg"
          row={{
            original: {
              client: {
                name: comment.user,
                surname: '',
                avatarSrc: comment.avatarSrc,
              },
            },
          }}
          size="md"
          avatarSrc="w-9 h-9"
          tooltipText={comment.user}
        />
        <span className="font-semibold text-black text-sm">{comment.user}</span>
        <span className="w-px h-4 bg-basic-white" />
        <span className="flex items-center gap-2 text-basic-gray font-normal text-xs  tracking-normal">
          <span className="material-symbols-outlined text-base">calendar_today</span>
          {comment.date}
        </span>
      </div>
      <div className="text-black font-normal leading-snug mt-2">
        {comment.text}
      </div>
    </div>
  );
}
