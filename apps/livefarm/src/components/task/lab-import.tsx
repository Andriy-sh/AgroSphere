'use client';

import { useState } from 'react';
import { Button, Dialog, Input } from '@@agrosphere/shared';

interface ImportData {
  hashId: string;
  name: string;
  surveyIdent: string;
  uuid: string;
}

interface LabImportProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ImportData) => void;
  onSaveAndImport: (data: ImportData) => void;
  initialData?: ImportData;
}

export function LabImport({
  isOpen,
  onClose,
  onSave,
  onSaveAndImport,
  initialData,
}: LabImportProps) {
  const [formData, setFormData] = useState<ImportData>(
    initialData || {
      hashId: '',
      name: '',
      surveyIdent: '',
      uuid: '',
    }
  );

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const handleSaveAndImport = () => {
    onSaveAndImport(formData);
    onClose();
  };

  const dialogTitle = (
    <div className="flex items-center gap-2">
      <span className="material-symbols-outlined text-basic-green text-xl">
        upload
      </span>
      <span className="text-xl">Import</span>
    </div>
  );

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={dialogTitle}
      className="sm:max-w-xl"
    >
      <div className="space-y-4 py-4">
        <div className="space-y-4">
          {[
            { key: 'hashId', label: 'Hash ID' },
            { key: 'name', label: 'Name' },
            { key: 'surveyIdent', label: 'Survey ident' },
            { key: 'uuid', label: 'UUID' },
          ].map(({ key, label }) => (
            <div key={key} className="space-y-2">
              <label className="text-sm font-normal text-basic-black">
                {label}
              </label>
              <Input
                type="text"
                value={formData[key as keyof ImportData]}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, [key]: e.target.value })
                }
                className="w-full text-sm px-3 py-2 border border-basic-gray-light rounded-md bg-white text-basic-black"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 pb-5">
        <Button variant="complete" onClick={handleSave} className="w-1/2">
          Save
        </Button>
        <Button
          variant="complete"
          onClick={handleSaveAndImport}
          className="w-1/2"
        >
          Save & Import
        </Button>
      </div>
    </Dialog>
  );
}
