export type CommentUser = {
  name: string;
  avatarSrc?: string;
  avatarInitials?: string;
};

export type Comment = {
  id: string;
  user: CommentUser;
  date: Date;
  commentText: string;
};

export const mockComments: Comment[] = [
  {
    id: '1',
    user: {
      name: 'Annette Black',
      avatarInitials: 'AB',
    },
    date: new Date('2025-05-10'),
    commentText:
      'Collected samples early due to upcoming rain. Zones A and B were slightly wet.',
  },
  {
    id: '2',
    user: {
      name: 'Robert Fox',
      avatarSrc:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    },
    date: new Date('2025-05-12'),
    commentText:
      'Sample IDs double-checked. Labels attached correctly before shipping.',
  },
  {
    id: '3',
    user: {
      name: 'Annette Black',
      avatarInitials: 'AB',
    },
    date: new Date('2025-05-12'),
    commentText:
      "Any update on the results? Please let me know if there's a delay.",
  },
  {
    id: '4',
    user: {
      name: 'Annette Black',
      avatarInitials: 'AB',
    },
    date: new Date('2025-05-13'),
    commentText:
      'Shipment received. Processing will begin today. ETA for results: 16 June.',
  },
];

export const mockCurrentUser: CommentUser = {
  name: 'John Smith',
  avatarInitials: 'JS',
};
