import React from 'react';
import { PDFIcon } from '../icons';

export const TaskCreatedMessage: React.FC<{
  taskTitle: string;
  location: string;
}> = ({ taskTitle, location }) => (
  <>
    <span className="text-basic-black font-normal text-xs">created task:</span>
    <span className="text-basic-black font-medium underline ml-1">
      {taskTitle}
    </span>{' '}
    – <span className="text-basic-black font-normal">{location}</span>
  </>
);

export const TaskAssignedMessage: React.FC<{
  taskTitle: string;
}> = ({ taskTitle }) => (
  <>
    <span className="text-basic-black font-normal text-xs">assigned task:</span>
    <span className="text-basic-black font-medium underline ml-1">
      {taskTitle}
    </span>
  </>
);

export const TaskStatusChangedMessage: React.FC<{
  statusText: string;
}> = ({ statusText }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Not started':
        return (
          <span className="mr-1 material-symbols-outlined text-basic-yellow text-[20px]">
            hourglass_bottom
          </span>
        );
      case 'In progress':
        return (
          <span className="mr-1 material-symbols-outlined text-basic-blue text-[20px]">
            timelapse
          </span>
        );
      case 'Completed':
        return (
          <span className="mr-1 material-symbols-outlined text-basic-green text-[20px]">
            task_alt
          </span>
        );
      default:
        return null;
    }
  };
  return (
    <>
      <span className="text-basic-black font-normal">marked task as:</span>
      <span className="inline-flex justify-center items-center px-2 py-1 rounded-md text-sm font-normal bg-white text-basic-black border border-basic-white ml-1 gap-2">
        {getStatusIcon(statusText)}
        {statusText}
      </span>
    </>
  );
};

export const DocumentsUploadedMessage: React.FC<{
  documentName: string;
  documentType: string;
}> = ({ documentName, documentType }) => {
  const getDocumentIcon = (type: string) => {
    if (type === 'pdf') {
      return <PDFIcon />;
    }
    return <PDFIcon />;
  };
  return (
    <span className="inline-flex items-center">
      <span className="text-basic-black font-normal text-xs">
        uploaded documents:
      </span>
      <span className="inline-flex justify-center items-center gap-1 px-1 py-1 pr-2 rounded-md text-sm font-normal bg-white text-basic-black border border-basic-white ml-1">
        {getDocumentIcon(documentType)}
        {documentName}
      </span>
    </span>
  );
};

export const CommentLeftMessage: React.FC<{ commentText: string }> = ({
  commentText,
}) => (
  <>
    <span className="text-basic-black font-normal">left a comment:</span>
    <span className="ml-2 p-1 rounded-md border border-basic-white text-basic-black text-sm">
      {commentText}
    </span>
  </>
);
