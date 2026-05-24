'use client';
import React from 'react';
import { CsvImport, CsvImportConfig } from '@@agrosphere/shared';
import {
  ClientsImportFromCsvProps,
  ImportedClient,
  CsvRow,
} from './clients-import-from-csv.types';

export function ClientsImportFromCsv({
  isOpen,
  onClose,
  onImport,
}: ClientsImportFromCsvProps) {
  const generateId = () => {
    return `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const generateInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const parseRow = (values: string[], headers: string[]): CsvRow => {
    return {
      name: values[headers.indexOf('name')],
      address: values[headers.indexOf('address')] || undefined,
      phone: values[headers.indexOf('phone')] || undefined,
      herdNo:
        values[headers.indexOf('herdno')] ||
        values[headers.indexOf('herd no')] ||
        undefined,
      asgn:
        values[headers.indexOf('asgn')] ||
        values[headers.indexOf('assignee')] ||
        undefined,
      tasks: values[headers.indexOf('tasks')] || undefined,
      product: values[headers.indexOf('product')] || undefined,
      tags: values[headers.indexOf('tags')] || undefined,
    };
  };

  const convertToImportedClients = (csvData: CsvRow[]): ImportedClient[] => {
    return csvData.map((row) => ({
      id: generateId(),
      name: row.name,
      address: row.address || null,
      phone: row.phone || null,
      herdNo: row.herdNo || null,
      asgn: row.asgn || null,
      tasks: row.tasks ? parseInt(row.tasks, 10) || 0 : 0,
      product: row.product || null,
      tags: row.tags
        ? row.tags
            .split(',')
            .map((tag) => tag.trim())
            .filter((tag) => tag)
        : null,
      avatar: '',
      initials: generateInitials(row.name),
      isOwn: false,
    }));
  };

  const config: CsvImportConfig<CsvRow> = {
    title: 'Import clients from CSV',
    requiredFields: ['name'],
    parseRow,
    convertToImported: convertToImportedClients,
    generateId,
    previewColumns: [
      {
        key: 'name',
        label: 'Name',
        render: (item) => item.name,
      },
      {
        key: 'address',
        label: 'Address',
        render: (item) => item.address || '---',
      },
      {
        key: 'phone',
        label: 'Phone',
        render: (item) => item.phone || '---',
      },
      {
        key: 'herdNo',
        label: 'Herd No',
        render: (item) => item.herdNo || '---',
      },
      {
        key: 'tags',
        label: 'Tags',
        render: (item) => (item.tags ? item.tags.join(', ') : '---'),
      },
    ],
    successMessage: (count, filesCount) =>
      `Successfully processed ${count} clients from ${filesCount} file${
        filesCount > 1 ? 's' : ''
      }`,
    importButtonText: (count) => `Import ${count} Clients`,
    templates: [
      {
        filename: 'clients-sample.csv',
        description: 'Sample clients with example data',
        content: `name,address,phone,herdno,asgn,tasks,product,tags
John Doe,123 Farm Road,555-0123,12345,Alice Smith,5,Dairy,Premium
Jane Smith,456 Ranch Lane,555-0456,67890,Bob Johnson,3,Beef,Standard
Bob Johnson,789 Pasture Way,555-0789,54321,Alice Smith,7,Sheep,Organic`,
      },
      {
        filename: 'clients-template.csv',
        description: 'Blank template for clients',
        content: `name,address,phone,herdno,asgn,tasks,product,tags
,,,,,,,`,
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
