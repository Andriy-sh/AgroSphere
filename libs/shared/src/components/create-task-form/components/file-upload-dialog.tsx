'use client';
import React, { useRef, useState } from 'react';
import { FileText, Trash2, RotateCcw } from 'lucide-react';
import { Button } from '../../button/button';
import { Dialog } from '../../dialog/dialog';
import { UploadFile } from '../types';
import { getFileIcon } from '../../../utils/file-utils';
import Image from 'next/image';
import UploadFileIcon from '../../../../public/upload_file.png';

interface FileUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onFilesUploaded?: (files: File[]) => void;
  localFiles: File[];
  onFilesChange?: (files: File[]) => void;
}

export const FileUploadDialog: React.FC<FileUploadDialogProps> = ({
  isOpen,
  onClose,
  onFilesUploaded,
  localFiles,
  onFilesChange,
}) => {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDrag, setIsDrag] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files).map(
      (file): UploadFile => ({
        file,
        progress: 0,
        status: 'pending',
      })
    );
    setFiles((prev) => [...prev, ...dropped]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files).map(
        (file): UploadFile => ({
          file,
          progress: 0,
          status: 'pending',
        })
      );
      setFiles((prev) => [...prev, ...selected]);
    }
  };

  const handleRemove = (idx: number) => {
    setFiles((files) => files.filter((_, i) => i !== idx));
  };

  const handleRemoveFile = (index: number) => {
    if (onFilesChange) {
      const updatedFiles = localFiles.filter((_, i) => i !== index);
      onFilesChange(updatedFiles);
    }
  };

  const handleRetry = (idx: number) => {
    setFiles((files) =>
      files.map((f, i) =>
        i === idx ? { ...f, status: 'uploading' as const, progress: 0 } : f
      )
    );

    const file = files[idx];
    let progress = 0;

    const interval = setInterval(() => {
      progress += 10;
      setFiles((currentFiles) =>
        currentFiles.map((f, i) =>
          i === idx
            ? {
                ...f,
                progress: Math.min(progress, 100),
                status: progress >= 100 ? ('success' as const) : 'uploading',
              }
            : f
        )
      );

      if (progress >= 100) {
        clearInterval(interval);

        if (onFilesChange) {
          onFilesChange([...localFiles, file.file]);
          setFiles((currentFiles) => currentFiles.filter((_, i) => i !== idx));
        }
      }
    }, 100);
  };

  const handleUpload = () => {
    setFiles((files) =>
      files.map((f) =>
        f.status === 'pending'
          ? { ...f, status: 'uploading' as const, progress: 0 }
          : f
      )
    );

    const uploadPromises = files.map((_, idx) => {
      return new Promise<{ index: number; success: boolean }>((resolve) => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          setFiles((files) =>
            files.map((file, i) =>
              i === idx
                ? {
                    ...file,
                    progress: Math.min(progress, 100),
                    status:
                      progress >= 100 ? ('success' as const) : 'uploading',
                  }
                : file
            )
          );
          if (progress >= 100) {
            clearInterval(interval);
            resolve({ index: idx, success: true });
          }
        }, 100);
      });
    });

    Promise.all(uploadPromises).then((results) => {
      const successfulFiles = results
        .filter((result) => result.success)
        .map((result) => files[result.index].file);

      if (successfulFiles.length > 0 && onFilesChange) {
        onFilesChange([...localFiles, ...successfulFiles]);
      }

      setFiles((currentFiles) =>
        currentFiles.filter((_, idx) => !results[idx].success)
      );
    });
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Upload file"
      className="max-w-lg"
    >
      <div
        className={`border-dashed border-2 rounded-lg p-6 text-center mb-4 transition-colors duration-200 ${
          isDrag ? 'border-green-500 bg-green-50' : 'border-gray-200'
        }`}
        onDrop={handleDrop}
        onDragOver={(e: React.DragEvent<HTMLDivElement>) => {
          e.preventDefault();
          setIsDrag(true);
        }}
        onDragLeave={() => setIsDrag(false)}
        onClick={() => inputRef.current?.click()}
        style={{ cursor: 'pointer' }}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
        <div>
          <div className="flex justify-center mb-2">
            <Image
              src={UploadFileIcon}
              alt="file icon"
              className="w-32 h-32"
              width={100}
              height={100}
            />
          </div>
          <div className="font-light text-sm">Drop or select file</div>
          <div className="text-gray-500 text-sm font-extralight">
            Drop files here or click to{' '}
            <span className="text-basic-green underline">browse</span> through
            your machine.
          </div>
        </div>
      </div>
      <div className="h-[150px] mb-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-2">
        <div className="space-y-3">
          {files.map((f, idx) => (
            <div key={`new-${idx}`} className="flex items-center gap-2">
              <div className="flex-1 relative">
                <span className="text-sm border border-basic-white rounded-lg p-1.5 flex-1 flex items-center justify-start block relative">
                  <div className="flex items-center min-w-0 flex-1 overflow-hidden">
                    {getFileIcon(f.file.name)}
                    <span
                      className={`truncate flex-1 ${
                        f.status === 'error' ? 'w-1/2' : ''
                      }`}
                      style={{ minWidth: '100px' }}
                    >
                      {f.file.name}
                    </span>
                  </div>
                  {f.status === 'uploading' && (
                    <span className="text-gray-500 text-xs flex-shrink-0 ml-auto">
                      {Math.round(f.progress)}%
                    </span>
                  )}
                  {f.status === 'error' && (
                    <span className="text-red-500 text-xs flex-shrink-0 ml-auto">
                      Upload failed
                    </span>
                  )}
                  {f.status === 'uploading' && (
                    <div className="absolute left-2 right-2 bottom-1">
                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-1.5 bg-green-500 rounded-full transition-all duration-200"
                          style={{ width: `${f.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </span>
              </div>
              {f.status === 'error' && (
                <Button
                  variant="ghost"
                  onClick={() => handleRetry(idx)}
                  className="p-2 rounded bg-basic-white focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 border border-basic-white"
                  title="Delete"
                  type="button"
                >
                  <span className="material-symbols-outlined text-basic-black text-sm">
                    replay
                  </span>
                </Button>
              )}
              <Button
                variant="ghost"
                onClick={() => handleRemove(idx)}
                className="p-2 rounded bg-basic-white focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 border border-basic-white"
                title="Delete"
                type="button"
              >
                <span className="material-symbols-outlined text-basic-black text-sm">
                  delete
                </span>
              </Button>
            </div>
          ))}

          {localFiles.map((file, idx) => (
            <div key={`existing-${idx}`} className="flex items-center gap-2">
              <span className="text-sm truncate border border-basic-white rounded-lg p-2 flex-1 flex items-center">
                {getFileIcon(file.name)}
                {file.name}
              </span>
              <Button
                variant="ghost"
                onClick={() => handleRemoveFile(idx)}
                className="p-2 rounded bg-basic-white focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 border border-basic-white"
                title="Delete"
                type="button"
              >
                <span className="material-symbols-outlined text-basic-black text-sm">
                  delete
                </span>
              </Button>
            </div>
          ))}
        </div>
      </div>
      <Button
        className="w-full mt-2"
        variant="complete"
        size="md"
        onClick={handleUpload}
        type="button"
        disabled={
          files.length === 0 ||
          files.every((f) => f.status === 'success' || f.status === 'uploading')
        }
      >
        Upload
      </Button>
    </Dialog>
  );
};
