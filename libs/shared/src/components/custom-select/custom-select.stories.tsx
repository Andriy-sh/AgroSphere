import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CustomSelect, SelectOption } from './custom-select';

const meta: Meta<typeof CustomSelect> = {
  title: 'Components/CustomSelect',
  component: CustomSelect,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Advanced select component with full customization capabilities.

## Key Features
- **Full customization**: Custom trigger, popup, and item rendering
- **Flexible styling**: Extensive className props for styling control
- **Accessibility**: Full keyboard navigation and screen reader support
- **Responsive design**: Automatic width calculation and responsive behavior
- **Agricultural focus**: Optimized for farm management applications

## Usage Examples
- Crop type selection with custom icons
- Equipment selection with rich metadata
- User assignment with avatars
- Location selection with distance info
- Task priority selection with color coding
        `,
      },
    },
  },
  argTypes: {
    options: {
      description:
        'Array of selectable options with value and label properties',
      control: { type: 'object' },
      table: {
        type: { summary: 'SelectOption[]' },
        defaultValue: { summary: '[]' },
      },
    },
    value: {
      description: 'Currently selected option value',
      control: { type: 'text' },
      table: {
        type: { summary: 'string | undefined' },
      },
    },
    defaultValue: {
      description: 'Default selected option value',
      control: { type: 'text' },
      table: {
        type: { summary: 'string | undefined' },
      },
    },
    placeholder: {
      description: 'Placeholder text displayed when no option is selected',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Select an option'" },
      },
    },
    onValueChange: {
      description: 'Callback fired when selection changes',
      action: 'onValueChange',
      table: {
        type: { summary: '(value: string) => void' },
      },
    },
    disabled: {
      description: 'Whether the select is disabled',
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    className: {
      description: 'Additional CSS classes for the select container',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
      },
    },
    triggerClassName: {
      description: 'Additional CSS classes for the trigger button',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
      },
    },
    popupClassName: {
      description: 'Additional CSS classes for the popup container',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
      },
    },
    itemClassName: {
      description: 'Additional CSS classes for individual items',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof CustomSelect>;

const cropOptions: SelectOption[] = [
  { value: 'wheat', label: 'Wheat' },
  { value: 'corn', label: 'Corn' },
  { value: 'soybeans', label: 'Soybeans' },
  { value: 'cotton', label: 'Cotton' },
  { value: 'rice', label: 'Rice' },
];





const priorityOptions: SelectOption[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];


function CustomSelectDefaultStory() {
  const [value, setValue] = useState<string | undefined>();
  return (
    <div>
      <CustomSelect
      options={cropOptions}
      value={value}
      onValueChange={setValue}
      placeholder="Choose a crop type"
      className="w-52"
      triggerClassName="h-9 w-52"
    />
    </div>
  );
}
export const Default: Story = {
  render: CustomSelectDefaultStory,
  name: 'Default',
  parameters: {
    docs: {
      description: {
        story:
          'Basic select component for crop type selection. This is the standard starting point for most selection scenarios in agricultural applications.',
      },
    },
  },
};

function TaskPrioritySelectStory() {
  const [priority, setPriority] = useState<string>('medium');
  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Task Priority Selection
      </h3>
      <label className="block font-normal text-sm mb-1 text-gray-700">
        Priority
      </label>
      <CustomSelect
        options={priorityOptions}
        value={priority}
        onValueChange={setPriority}
        disabled={false}
        placeholder="Select priority"
        className="w-52"
        triggerClassName="h-9 w-52"
      />
    </div>
  );
}
export const TaskPrioritySelect: Story = {
  render: TaskPrioritySelectStory,
  name: 'Task Priority Select',
  parameters: {
    docs: {
      description: {
        story:
          'Real-world example from task management - priority selection with compact styling. Used in task creation forms for priority assignment.',
      },
    },
  },
};


function SettingsSelectStory() {
  const [value, setValue] = useState<string>('');
  const languageOptions: SelectOption[] = [
    { value: 'en-us', label: 'English (US)' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
  ];

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Settings Selection
      </h3>
      <CustomSelect
        options={languageOptions}
        value={value}
        onValueChange={setValue}
        placeholder="Select language"
        className="w-full"
        triggerClassName="w-full"
        popupClassName="w-52"
        renderTrigger={({ selectedOption, isOpen, onClick, disabled }) => (
          <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className="w-full h-10 px-3 py-2 text-sm text-basic-black bg-white border border-basic-white rounded-md focus-within:border-basic-green focus:outline-none flex items-center justify-between gap-2 cursor-pointer transition-colors duration-200"
          >
            <span className="truncate text-left flex-1">
              {selectedOption?.label || 'Select language'}
            </span>
            <span className="material-symbols-outlined text-basic-gray transition-transform duration-200 text-lg flex-shrink-0">
              expand_all
            </span>
          </button>
        )}
      />
    </div>
  );
}
export const SettingsSelect: Story = {
  render: SettingsSelectStory,
  name: 'Settings Select',
  parameters: {
    docs: {
      description: {
        story:
          'Real-world example from settings - custom trigger with material icons. Used in personal preferences for language and other settings selection.',
      },
    },
  },
};
