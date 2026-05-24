import React from 'react';
import { Avatar } from '../../avatar/avatar';
import { Icon } from '../../icon';

interface TaskAssignmentProps {
  assignedTo?: {
    name: string;
    surname: string;
    imgUrl: string;
  };
  isAccepted?: boolean;
  onAssign?: () => void;
}

export const TaskAssignment: React.FC<TaskAssignmentProps> = ({
  assignedTo,
  isAccepted = false,
  onAssign,
}) => {
  if (!assignedTo || !assignedTo.name) {
    if (isAccepted) {
      return (
        <div className="flex justify-start">
          <button
            className="flex items-center justify-center m-2 w-8 h-8 rounded-md border border-basic-white"
            onClick={onAssign}
          >
            <Icon icon="add" className='text-basic-green' size="lg" />
          </button>
        </div>
      );
    } else { 
      return (
        <div className="flex justify-start">
          <span className="text-gray-400 font-medium ml-4">---</span>
        </div>
      );
    }
  }

  return (
    <div className="flex justify-start">
      <Avatar
        row={{
          original: {
            client: {
              name: assignedTo.name,
              surname: assignedTo.surname,
              avatarSrc: assignedTo.imgUrl,
            },
          },
        }}
        className="m-1"
      />
    </div>
  );
};
