'use client';
import React, { useState, useRef } from 'react';
import { Dialog } from '../dialog/dialog';
import { Button } from '../button/button';
import {
  CsvImportProps,
  CsvImportState,
  CsvTemplate,
} from './csv-import.types';

export function CsvImport<T = unknown>({
  isOpen,
  onClose,
  onImport,
  config,
}: CsvImportProps<T>) {
  const [state, setState] = useState<CsvImportState>({
    files: [],
    isProcessing: false,
    error: null,
    previewData: [],
    showPreview: false,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseCsvFile = (csvContent: string): T[] => {
    const lines = csvContent.split('\n').filter((line) => line.trim());
    if (lines.length < 2) {
      throw new Error(
        'CSV file must contain at least a header and one data row'
      );
    }

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
    const missingFields = config.requiredFields.filter(
      (field) => !headers.includes(field)
    );

    if (missingFields.length > 0) {
      throw new Error(
        `Missing required columns: ${missingFields.join(', ')}. ` +
          `Available columns: ${headers.join(', ')}`
      );
    }

    const data: T[] = [];
    let errorRow = 0;

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map((v) => v.trim());
      if (values.length > 0 && values.some((v) => v.trim())) {
        try {
          const row = config.parseRow(values, headers);
          data.push(row);
        } catch (rowError) {
          errorRow = i + 1;
          throw new Error(
            `Error parsing row ${errorRow}: ${
              rowError instanceof Error
                ? rowError.message
                : 'Invalid data format'
            }`
          );
        }
      }
    }

    if (data.length === 0) {
      throw new Error('No valid data rows found in CSV file');
    }

    return data;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length === 0) return;

    const csvFiles = selectedFiles.filter((file) =>
      file.name.toLowerCase().endsWith('.csv')
    );

    if (csvFiles.length !== selectedFiles.length) {
      setState((prev) => ({ ...prev, error: 'Please select only CSV files' }));
      return;
    }

    setState((prev) => ({
      ...prev,
      files: [...prev.files, ...csvFiles],
      error: null,
      previewData: [],
      showPreview: false,
    }));

    if (event.target) {
      event.target.value = '';
    }
  };

  const handleFileProcess = async () => {
    if (state.files.length === 0) return;

    setState((prev) => ({ ...prev, isProcessing: true, error: null }));

    try {
      let allImportedData: unknown[] = [];

      for (const file of state.files) {
        try {
          const content = await file.text();
          const csvData = parseCsvFile(content);
          const importedData = config.convertToImported(csvData);
          allImportedData = [...allImportedData, ...importedData];
        } catch (fileError) {
          throw new Error(
            `Error processing file "${file.name}": ${
              fileError instanceof Error ? fileError.message : 'Unknown error'
            }`
          );
        }
      }

      setState((prev) => ({
        ...prev,
        previewData: allImportedData,
        showPreview: true,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error:
          err instanceof Error ? err.message : 'Failed to process CSV files',
      }));
    } finally {
      setState((prev) => ({ ...prev, isProcessing: false }));
    }
  };

  const handleImport = () => {
    if (state.previewData.length > 0) {
      onImport(state.previewData);
      handleClose();
    }
  };

  const handleClose = () => {
    setState({
      files: [],
      error: null,
      previewData: [],
      showPreview: false,
      isProcessing: false,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    const csvFiles = droppedFiles.filter((file) =>
      file.name.toLowerCase().endsWith('.csv')
    );

    if (csvFiles.length !== droppedFiles.length) {
      setState((prev) => ({ ...prev, error: 'Please drop only CSV files' }));
      return;
    }

    setState((prev) => ({
      ...prev,
      files: [...prev.files, ...csvFiles],
      error: null,
      previewData: [],
      showPreview: false,
    }));
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const removeFile = (index: number) => {
    const newFiles = state.files.filter((_, i) => i !== index);
    setState((prev) => ({ ...prev, files: newFiles }));
  };

  const downloadTemplate = (template: CsvTemplate) => {
    const blob = new Blob([template.content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = template.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title={
        <div className="w-full">
          <div className="flex items-center gap-2 w-full">
            <div className="w-10 h-10 bg-basic-green rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-white text-xl">
                upload_file
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-semibold text-basic-black">
                {config.title}
              </h2>
            </div>
            {config.templates && config.templates.length > 0 && (
              <div className="flex items-center gap-2 flex-shrink-0">
                {config.templates.map((template, index) => (
                  <div
                    key={index}
                    onClick={() => downloadTemplate(template)}
                    className="group flex items-center gap-1 px-3 py-1 bg-white border-2 border-dashed border-basic-white rounded-lg cursor-pointer text-sm transition-all duration-200 hover:border-basic-green hover:shadow-md"
                  >
                    <span className="material-symbols-outlined text-basic-green text-sm transition-colors duration-200 group-hover:text-basic-green">
                      download
                    </span>
                    <span className="text-basic-gray transition-colors duration-200 group-hover:text-basic-green">
                      {template.filename.includes('sample')
                        ? 'Sample'
                        : 'Template'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      }
      className="max-w-2xl"
      showCloseButton={false}
    >
      <div className="space-y-6 mt-4">
        {!state.showPreview ? (
          <div className="space-y-4">
            <div
              className={`border-2 border-dashed border-basic-white rounded-xl p-8 text-center hover:border-basic-green transition-colors bg-[#F8F9FA] ${
                state.files.length === 0 ? 'cursor-pointer' : ''
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={
                state.files.length === 0
                  ? () => fileInputRef.current?.click()
                  : undefined
              }
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />

              {state.files.length > 0 ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-basic-green rounded-xl flex items-center justify-center mx-auto">
                    <span className="material-symbols-outlined text-white text-2xl">
                      description
                    </span>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium text-basic-black">
                      {state.files.length} file
                      {state.files.length > 1 ? 's' : ''} selected
                    </h3>
                    <div className="max-h-32 overflow-y-auto space-y-2">
                      {state.files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-white rounded-lg p-3 border border-basic-white"
                        >
                          <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-basic-green text-lg">
                              description
                            </span>
                            <div className="flex justify-center gap-2 items-center">
                              <p className="text-sm font-medium text-basic-black">
                                {file.name}
                              </p>
                              <p className="text-xs text-basic-gray">
                                {(file.size / 1024).toFixed(1)} KB
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile(index);
                            }}
                            className="p-1 hover:bg-red-50 rounded-full transition-colors h-auto w-auto"
                          >
                            <span className="material-symbols-outlined text-red-500 text-lg">
                              close
                            </span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                  >
                    Add more files
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-basic-white rounded-xl flex items-center justify-center mx-auto">
                    <span className="material-symbols-outlined text-basic-gray text-2xl">
                      cloud_upload
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-basic-black mb-2">
                      Drop your CSV files here
                    </h3>
                    <p className="text-sm text-basic-gray mb-4">
                      or{' '}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        className="text-basic-green hover:underline font-medium p-0 h-auto"
                      >
                        browse files
                      </Button>
                    </p>
                    <p className="text-xs text-basic-gray">
                      You can select multiple CSV files at once or add them one
                      by one
                    </p>
                  </div>
                </div>
              )}
            </div>

            {state.error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-red-500 text-lg">
                    error
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-700 mb-1">
                    Processing Error
                  </p>
                  <p className="text-sm text-red-600 mb-2">{state.error}</p>
                  <div className="text-xs text-red-500 space-y-1">
                    <p>
                      • Check that your CSV file has the correct column headers
                    </p>
                    <p>• Ensure all required fields are present</p>
                    <p>• Verify the file is not corrupted</p>
                    <p>
                      • Try downloading a template to see the correct format
                    </p>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setState((prev) => ({ ...prev, error: null }))
                      }
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      Dismiss
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      Try Different Files
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {state.files.length > 0 && !state.error && (
              <div className="flex justify-end">
                <Button
                  variant="complete"
                  size="md"
                  onClick={handleFileProcess}
                  disabled={state.isProcessing}
                >
                  {state.isProcessing
                    ? 'Processing...'
                    : `Process ${state.files.length} file${
                        state.files.length > 1 ? 's' : ''
                      }`}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="max-h-96 overflow-y-auto border border-basic-white rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-[#F8F9FA] sticky top-0">
                  <tr>
                    {config.previewColumns.map((column) => (
                      <th
                        key={column.key}
                        className="px-4 py-3 text-left font-medium text-basic-black"
                      >
                        {column.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-basic-white">
                  {state.previewData.map((item, index) => (
                    <tr key={item.id || index} className="hover:bg-[#F8F9FA]">
                      {config.previewColumns.map((column) => (
                        <td
                          key={column.key}
                          className="px-4 py-3 text-basic-gray"
                        >
                          {column.render(item)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="cancel"
                size="md"
                onClick={() =>
                  setState((prev) => ({ ...prev, showPreview: false }))
                }
              >
                Back to Upload
              </Button>
              <Button variant="complete" size="md" onClick={handleImport}>
                {config.importButtonText(state.previewData.length)}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
}
