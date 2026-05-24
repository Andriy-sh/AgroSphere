'use client';
import React from 'react';
import { CsvImport, CsvImportConfig } from '@@agrosphere/shared';
import {
  LabImportFromCsvProps,
  ImportedLabItem,
  CsvLabRow,
} from './lab-import-from-csv.types';

export function LabImportFromCsv({
  isOpen,
  onClose,
  onImport,
}: LabImportFromCsvProps) {
  const generateId = () => {
    return `LAB-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const generateLabOrderNo = (taskId: string) => {
    return `LO-2024-${taskId.padStart(3, '0')}`;
  };

  const parseRow = (values: string[], headers: string[]): CsvLabRow => {
    return {
      labName: values[headers.indexOf('labname')] || '',
      clientName: values[headers.indexOf('clientname')] || '',
      clientSurname: values[headers.indexOf('clientsurname')] || '',
      farm: values[headers.indexOf('farm')] || '',
      taskId: values[headers.indexOf('taskid')] || '',
      labOrderNo: values[headers.indexOf('laborderno')] || '',
      samples: values[headers.indexOf('samples')] || '0',
      sampleDate: values[headers.indexOf('sampledate')] || '',
      sentDate: values[headers.indexOf('sentdate')] || '',
      receivedDate: values[headers.indexOf('receiveddate')] || '',
      status: values[headers.indexOf('status')] || 'pending',
      type: values[headers.indexOf('type')] || 'Soil',
    };
  };

  const convertToImportedLabItems = (
    csvData: CsvLabRow[]
  ): ImportedLabItem[] => {
    return csvData.map((row) => {
      const samples = parseInt(row.samples, 10) || 0;
      const sampleDate = new Date(row.sampleDate).toISOString();
      const sentDate = row.sentDate
        ? new Date(row.sentDate).toISOString()
        : sampleDate;
      const receivedDate = row.receivedDate
        ? new Date(row.receivedDate).toISOString()
        : sampleDate;

      const validStatuses = [
        'pending',
        'complete',
        'in_progress',
        'cancelled',
        'testing',
        'received',
      ] as const;

      type ValidStatus = (typeof validStatuses)[number];

      const status: ValidStatus = validStatuses.includes(
        (row.status || '') as ValidStatus
      )
        ? (row.status as ValidStatus)
        : 'pending';

      const validTypes = [
        'Soil',
        'Grass',
        'Silage',
        'Feed',
        'Water',
        'Slurry',
      ] as const;

      type ValidType = (typeof validTypes)[number];

      const type: ValidType = validTypes.includes(row.type as ValidType)
        ? (row.type as ValidType)
        : 'Soil';

      return {
        id: generateId(),
        labName: row.labName,
        client: {
          name: row.clientName,
          surname: row.clientSurname || '',
          avatarSrc: `https://i.pravatar.cc/40?img=${
            Math.floor(Math.random() * 10) + 1
          }`,
        },
        farm: row.farm,
        taskId: row.taskId,
        labOrderNo: row.labOrderNo || generateLabOrderNo(row.taskId),
        samples,
        sampleDate,
        sentDate,
        receivedDate,
        status,
        hasResults: status === 'complete',
        updatedAt: new Date().toISOString(),
        type,
      };
    });
  };

  const config: CsvImportConfig<CsvLabRow> = {
    title: 'Import lab orders from CSV',
    requiredFields: [
      'labname',
      'clientname',
      'farm',
      'taskid',
      'samples',
      'sampledate',
      'type',
    ],
    parseRow,
    convertToImported: convertToImportedLabItems,
    generateId,
    previewColumns: [
      {
        key: 'labName',
        label: 'Lab Name',
        render: (item) => item.labName,
      },
      {
        key: 'client',
        label: 'Client',
        render: (item) => `${item.client.name} ${item.client.surname}`,
      },
      {
        key: 'farm',
        label: 'Farm',
        render: (item) => item.farm,
      },
      {
        key: 'taskId',
        label: 'Task ID',
        render: (item) => item.taskId,
      },
      {
        key: 'type',
        label: 'Type',
        render: (item) => item.type,
      },
      {
        key: 'samples',
        label: 'Samples',
        render: (item) => item.samples.toString(),
      },
      {
        key: 'status',
        label: 'Status',
        render: (item) => item.status,
      },
    ],
    successMessage: (count, filesCount) =>
      `Successfully processed ${count} lab orders from ${filesCount} file${
        filesCount > 1 ? 's' : ''
      }`,
    importButtonText: (count) => `Import ${count} Lab Orders`,
    templates: [
      {
        filename: 'lab-orders-sample.csv',
        description: 'Sample lab orders with example data',
        content: `labname,clientname,clientsurname,farm,taskid,laborderno,samples,sampledate,sentdate,receiveddate,status,type
AgriLab,John,Doe,Farm A,001,LO-2024-001,5,2024-01-15,2024-01-16,2024-01-20,completed,Soil
SoilTest,Jane,Smith,Farm B,002,LO-2024-002,3,2024-01-16,2024-01-17,,pending,Grass
LabCorp,Bob,Johnson,Farm C,003,LO-2024-003,7,2024-01-17,2024-01-18,2024-01-22,in_progress,Silage`,
      },
      {
        filename: 'lab-orders-template.csv',
        description: 'Blank template for lab orders',
        content: `labname,clientname,clientsurname,farm,taskid,laborderno,samples,sampledate,sentdate,receiveddate,status,type
,,,,,,,,,,,`,
      },
    ],
  };

  return (
    <CsvImport
      isOpen={isOpen}
      onClose={onClose}
      onImport={onImport}
      config={config}
    />
  );
}
