import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { SelectAllCheckbox } from './select-all-checkbox';

const meta: Meta<typeof SelectAllCheckbox> = {
  title: 'Components/SelectAllCheckbox',
  component: SelectAllCheckbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    allItems: {
      control: 'object',
    },
    selectedItems: {
      control: 'object',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockItems = [
  { id: '1', name: 'Item 1' },
  { id: '2', name: 'Item 2' },
  { id: '3', name: 'Item 3' },
  { id: '4', name: 'Item 4' },
  { id: '5', name: 'Item 5' },
];

const SelectAllCheckboxWithState = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <SelectAllCheckbox
          allItems={mockItems}
          selectedItems={selectedItems}
          onSelectedItemsChange={setSelectedItems}
        />
        <span className="text-sm text-gray-600">
          Select All ({selectedItems.length} of {mockItems.length} selected)
        </span>
      </div>

      <div className="space-y-2">
        {mockItems.map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedItems.includes(item.id)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedItems([...selectedItems, item.id]);
                } else {
                  setSelectedItems(
                    selectedItems.filter((id) => id !== item.id)
                  );
                }
              }}
              className="w-4 h-4"
            />
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Default: Story = {
  render: () => <SelectAllCheckboxWithState />,
};

export const Disabled: Story = {
  args: {
    allItems: mockItems,
    selectedItems: [],
    onSelectedItemsChange: () => console.log('Selection changed'),
    disabled: true,
  },
};

export const AllSelected: Story = {
  args: {
    allItems: mockItems,
    selectedItems: mockItems.map((item) => item.id),
    onSelectedItemsChange: () => console.log('Selection changed'),
  },
};

export const SomeSelected: Story = {
  args: {
    allItems: mockItems,
    selectedItems: ['1', '3', '5'],
    onSelectedItemsChange: () => console.log('Selection changed'),
  },
};
