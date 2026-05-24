'use client';
import React, { useState } from 'react';
import { CsvImport } from '../csv-import/csv-import';
import { CsvImportConfig } from '../csv-import/csv-import.types';

interface SampleDataUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (data: unknown[]) => void;
}

interface SampleDataRow {
  id: string;
  taskType: string;
  farmerName: string;
  soilSampler: string;
  createdDate: string;
  startAfter: string;
  dueDate: string;
  status: string;
  priority: string;
  location: string;
  notes: string;
}

export function SampleDataUpload({
  isOpen,
  onClose,
  onUpload,
}: SampleDataUploadProps) {
  const [isModalOpen, setIsModalOpen] = useState(isOpen);

  React.useEffect(() => {
    setIsModalOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setIsModalOpen(false);
    onClose();
  };

  const handleUpload = (data: unknown[]) => {
    onUpload(data);
    handleClose();
  };

  const sampleDataConfig: CsvImportConfig<SampleDataRow> = {
    title: 'Upload Sample Data',
    requiredFields: [
      'task_type',
      'farmer_name',
      'soil_sampler',
      'created_date',
      'start_after',
      'due_date',
      'status',
      'priority',
      'location',
      'notes',
    ],
    parseRow: (values: string[], headers: string[]): SampleDataRow => {
      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });

      return {
        id:
          row.id ||
          `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        taskType: row.task_type || 'Soil Analysis',
        farmerName: row.farmer_name || '',
        soilSampler: row.soil_sampler || '',
        createdDate: row.created_date || '',
        startAfter: row.start_after || '',
        dueDate: row.due_date || '',
        status: row.status || 'pending',
        priority: row.priority || 'normal',
        location: row.location || '',
        notes: row.notes || '',
      };
    },
    convertToImported: (csvData: SampleDataRow[]) => {
      return csvData.map((row) => ({
        ...row,
        assigned_to: row.soilSampler ? 1 : 0,
        assigned_to_organisation: row.soilSampler ? 1 : null,
        task_has_unmatched_samples: false,
        task_has_tests_without_lab_result: false,
        task_has_not_started_test: true,
      }));
    },
    generateId: () =>
      `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    previewColumns: [
      {
        key: 'taskType',
        label: 'Task Type',
        render: (item) => item.taskType || 'N/A',
      },
      {
        key: 'farmerName',
        label: 'Farmer Name',
        render: (item) => item.farmerName || 'N/A',
      },
      {
        key: 'soilSampler',
        label: 'Soil Sampler',
        render: (item) => item.soilSampler || 'Unassigned',
      },
      {
        key: 'status',
        label: 'Status',
        render: (item) => item.status || 'pending',
      },
      {
        key: 'dueDate',
        label: 'Due Date',
        render: (item) => item.dueDate || 'N/A',
      },
    ],
    successMessage: (count: number, filesCount: number) =>
      `Successfully imported ${count} sample data records from ${filesCount} file${
        filesCount > 1 ? 's' : ''
      }`,
    importButtonText: (count: number) =>
      `Import ${count} sample data record${count > 1 ? 's' : ''}`,
    templates: [
      {
        filename: 'task_data_sample.csv',
        description: 'Sample data with examples',
        content: `task_type,farmer_name,soil_sampler,created_date,start_after,due_date,status,priority,location,notes
Soil Analysis,Robert Anderson,Maria Garcia,2024-01-20,2024-01-25,2024-01-30,pending,normal,"Green Valley Farm, North Field","Quarterly soil testing"
Fertilizer Application,Jennifer Martinez,David Kim,2024-01-21,2024-01-26,2024-01-31,in_progress,urgent,"Sunrise Farm, East Field","Spring fertilizer application"
Pesticide Spray,Michael Thompson,Anna Rodriguez,2024-01-22,2024-01-27,2024-02-01,pending,normal,"Meadow Farm, West Field","Organic pest control"
Drainage Check,Susan Clark,James Wilson,2024-01-23,2024-01-28,2024-02-02,completed,normal,"River Farm, South Field","Drainage system maintenance"
Soil Testing,Daniel Brown,Lisa Johnson,2024-01-24,2024-01-29,2024-02-03,pending,urgent,"Hill Farm, Central Field","Pre-planting soil analysis"
Crop Rotation,Amanda Davis,Mark Taylor,2024-01-25,2024-01-30,2024-02-04,pending,normal,"Valley Farm, Field A","Plan crop rotation schedule"
Irrigation Check,Christopher Lee,Sarah White,2024-01-26,2024-01-31,2024-02-05,in_progress,normal,"Desert Farm, Field B","Check irrigation system efficiency"
Harvest Planning,Jessica Green,Robert Smith,2024-01-27,2024-02-01,2024-02-06,pending,urgent,"Mountain Farm, Field C","Plan harvest schedule and logistics"`,
      },
      {
        filename: 'task_data_template.csv',
        description: 'Empty template for task data upload',
        content: `task_type,farmer_name,soil_sampler,created_date,start_after,due_date,status,priority,location,notes
Soil Analysis,John Smith,Jane Doe,2024-01-15,2024-01-20,2024-01-25,pending,normal,"Farm A, Field 1","Regular soil testing for crop rotation"
Fertilizer Application,Mike Johnson,Bob Wilson,2024-01-16,2024-01-21,2024-01-26,in_progress,urgent,"Farm B, Field 2","Apply nitrogen-based fertilizer"
Pesticide Spray,Sarah Davis,Tom Brown,2024-01-17,2024-01-22,2024-01-27,pending,normal,"Farm C, Field 3","Preventive pest control treatment"
Drainage Check,Emily White,Alex Green,2024-01-18,2024-01-23,2024-01-28,completed,normal,"Farm D, Field 4","Check and maintain drainage systems"
Soil Testing,Lisa Taylor,Chris Lee,2024-01-19,2024-01-24,2024-01-29,pending,urgent,"Farm E, Field 5","Comprehensive soil analysis for new crops"`,
      },
    ],
  };

  return (
    <CsvImport
      isOpen={isModalOpen}
      onClose={handleClose}
      onImport={handleUpload}
      config={sampleDataConfig}
    />
  );
}
