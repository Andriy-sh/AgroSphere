import { FileIcon } from '../components/icons';

export const getFileIcon = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'pdf':
      return <FileIcon className="w-4 h-4 mr-2" />;
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'svg':
      return <FileIcon className="w-4 h-4 mr-2" />;
    default:
      return (
        <span className="material-symbols-outlined text-gray-500 text-sm mr-2">
          description
        </span>
      );
  }
};
