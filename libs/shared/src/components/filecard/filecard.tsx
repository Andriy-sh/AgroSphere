import React from 'react';
import {
  Download,
  FileText,
  Image,
  FileArchive,
  FileCode,
  File,
} from 'lucide-react';
import { cn } from '../../utils/cn'; 

type FileType = 'pdf' | 'docx' | 'image' | 'zip' | 'code' | 'text' | 'other';

interface FileCardProps {
  filename: string;
  downloadUrl?: string;
  filetype?: FileType;
  showDownload?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
  onDownload?: () => void;
  extraActions?: React.ReactNode;
  className?: string;
  fileIconClassName?: string;
  filenameClassName?: string;
  downloadIconClassName?: string;
}

const getFileIconAndColor = (type: FileType): React.ReactNode => {
  switch (type) {
    case 'pdf':
      return <FileText className="w-5 h-5 text-blue-600" />;
    case 'text':
      return <FileText className="w-5 h-5 text-blue-600" />;
    case 'docx':
      return <FileText className="w-5 h-5 text-blue-600" />;
    case 'image':
      return <Image className="w-5 h-5 text-purple-600" />;
    case 'zip':
      return <FileArchive className="w-5 h-5 text-orange-600" />;
    case 'code':
      return <FileCode className="w-5 h-5 text-green-600" />;
    case 'other':
    default:
      return <File className="w-5 h-5 text-gray-500" />;
  }
};

export const FileCard: React.FC<FileCardProps> = ({
  filename,
  downloadUrl,
  filetype = 'other',
  showDownload = true,
  icon,
  onClick,
  onDownload,
  extraActions,
  className,
  fileIconClassName,
  filenameClassName,
  downloadIconClassName,
}) => {
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDownload) {
      onDownload();
    } else if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const fileIcon = icon || getFileIconAndColor(filetype);

  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-center justify-between',
        'inline-flex', 
        'min-w-0', 
        ' border border-gray-200 rounded-md',
        'text-sm font-sans text-gray-800',
        onClick ? 'cursor-pointer hover:bg-gray-200' : '',
        className
      )}
    >
      <div className="flex items-center space-x-2 flex-grow min-w-0">
        <span className={cn('flex-shrink-0', fileIconClassName)}>
          {fileIcon}
        </span>
        <span
          className={cn(
            'whitespace-nowrap overflow-hidden text-ellipsis font-medium',
            filenameClassName
          )}
          title={filename}
        >
          {filename}
        </span>
      </div>

      <div className="flex items-center flex-shrink-0 ml-2 bg-gray-100 rounded-md">
        {extraActions}
        {showDownload && downloadUrl && (
          <button
            onClick={handleDownload}
            className={cn(
              'flex-shrink-0',
              'flex items-center justify-center',
              '-mr-1 p-1.5', 
              'rounded-md',
              'text-gray-500 hover:bg-gray-300 hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
              downloadIconClassName
            )}
            aria-label={`Download ${filename}`}
          >
            <Download className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
