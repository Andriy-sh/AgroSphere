import type { Meta, StoryObj } from '@storybook/react';
import { DetailCard } from './detail-card';
import { Avatar } from '../avatar/avatar';
import { DetailRow } from '../detail-row/detail-row';

const meta: Meta<typeof DetailCard> = {
  title: 'Components/DetailCard',
  component: DetailCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Card title',
    },
    showEditButton: {
      control: 'boolean',
      description: 'Show edit button',
    },
    onEdit: {
      action: 'edit clicked',
      description: 'Edit button click handler',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Client Details',
    children: (
      <>
        <DetailRow icon="person" label="Name:" value="John Doe" />
        <DetailRow icon="email" label="Email:" value="john.doe@example.com" />
        <DetailRow icon="phone" label="Phone:" value="+1 234 567 890" />
        <DetailRow
          icon="location_on"
          label="Address:"
          value="123 Main St, City"
        />
      </>
    ),
  },
};

export const WithEditButton: Story = {
  args: {
    title: 'Client Details',
    showEditButton: true,
    onEdit: () => console.log('Edit clicked'),
    children: (
      <>
        <DetailRow icon="person" label="Name:" value="John Doe" />
        <DetailRow icon="email" label="Email:" value="john.doe@example.com" />
        <DetailRow icon="phone" label="Phone:" value="+1 234 567 890" />
        <DetailRow
          icon="location_on"
          label="Address:"
          value="123 Main St, City"
        />
      </>
    ),
  },
};

export const WithComplexContent: Story = {
  args: {
    title: 'Client Details',
    showEditButton: true,
    onEdit: () => console.log('Edit clicked'),
    children: (
      <>
        <DetailRow icon="person" label="Name:" value="John Doe" />
        <DetailRow icon="email" label="Email:" value="john.doe@example.com" />
        <DetailRow icon="phone" label="Phone:" value="+1 234 567 890" />
        <DetailRow
          icon="location_on"
          label="Address:"
          value="123 Main St, City"
        />
        <DetailRow icon="person" label="Assigned consultant:">
          <div className="flex items-center gap-3">
            <Avatar
              className="rounded-md"
              row={{
                original: {
                  client: {
                    name: 'Jane Smith',
                    surname: '',
                    avatarSrc: '',
                  },
                },
              }}
              size="sm"
              tooltipText="Jane Smith"
            />
            <span className="text-black font-medium">Jane Smith</span>
          </div>
        </DetailRow>
        <DetailRow icon="label" label="Tags:">
          <div className="flex gap-2 flex-wrap">
            <span className="bg-[#F3F4F6] text-gray-700 px-2 py-1 text-sm font-medium">
              Premium
            </span>
            <span className="bg-[#F3F4F6] text-gray-700 px-2 py-1 text-sm font-medium">
              Active
            </span>
          </div>
        </DetailRow>
      </>
    ),
  },
};

export const EmptyState: Story = {
  args: {
    title: 'Client Details',
    children: (
      <>
        <DetailRow icon="person" label="Name:" value="---" />
        <DetailRow icon="email" label="Email:" value="---" />
        <DetailRow icon="phone" label="Phone:" value="---" />
        <DetailRow icon="location_on" label="Address:" value="---" />
      </>
    ),
  },
};
