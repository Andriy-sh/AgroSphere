import type { Meta, StoryObj } from '@storybook/react';
import React, { useEffect } from 'react';
import { Sidebar } from './sidebar.storybook'; // Use Storybook version with mock hook
import { useOrganisationsStore } from '../../stores/useOrganisationsStore';
import { mockCompanies } from '../../mock/mock-companies';

// Decorator to initialize stores with mock data
const withMockData = (Story: React.ComponentType) => {
  const MockDataInitializer = () => {
    const { setCurrentTenant, currentTenant } = useOrganisationsStore();

    useEffect(() => {
      // Initialize store with first mock company as current tenant
      if (mockCompanies[0] && !currentTenant) {
        setCurrentTenant({
          id: mockCompanies[0].id,
          name: mockCompanies[0].name,
          type: 'farmer',
          email: 'demo@example.com',
        });
      }
    }, [setCurrentTenant, currentTenant]);

    return <Story />;
  };

  return <MockDataInitializer />;
};

const meta: Meta<typeof Sidebar> = {
  component: Sidebar,
  title: 'Components/Sidebar',
  tags: ['autodocs'],
  argTypes: {
    initialWidth: {
      control: { type: 'number', min: 76, max: 256, step: 10 },
      description: 'Initial width of the sidebar',
      defaultValue: 256,
    },
  },
  decorators: [
    withMockData,
    (Story) => (
      <div style={{ height: '100vh', display: 'flex' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Sidebar> & {
  initialWidth?: number;
};

export const Expanded: Story = {
  render: () => <Sidebar />,
};

export const Collapsed: Story = {
  render: () => <Sidebar />,
  parameters: {
    docs: {
      description: {
        story: 'Sidebar in collapsed state',
      },
    },
  },
};
