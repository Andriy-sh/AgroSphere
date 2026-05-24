import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CompanySelector } from './company-selector';
import { mockCompanies, type Company } from '../../mock/mock-companies';

const meta: Meta<typeof CompanySelector> = {
  title: 'Components/CompanySelector',
  component: CompanySelector,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Company selector component for the sidebar.

## Key Features
- **Interactive dropdown**: Click to open/close company selection
- **Responsive design**: Adapts to sidebar width changes
- **Visual indicators**: Crown icon for premium companies
- **Smooth animations**: Hover effects and transitions
- **Accessibility**: Keyboard navigation and screen reader support

## Usage
Used in the sidebar to allow users to switch between different companies/organizations.
        `,
      },
    },
  },
  argTypes: {
    onChange: { action: 'company changed' },
  },
};

export default meta;
type Story = StoryObj<typeof CompanySelector>;

export const DarkVariant: Story = {
  args: {
    companies: mockCompanies,
    value: mockCompanies[0],
    variant: 'dark',
    collapsed: false,
    showChevron: true,
    disabled: false,
  },
  render: (args) => {
    const CompanySelectorWrapper = () => {
      const [selectedCompany, setSelectedCompany] = useState<Company | null>(
        args.value || mockCompanies[0]
      );

      return (
        <div className="w-64 bg-gray-900 p-4">
          <CompanySelector
            companies={args.companies}
            value={selectedCompany}
            onChange={setSelectedCompany}
            variant={args.variant}
            collapsed={args.collapsed}
            showChevron={args.showChevron}
            disabled={args.disabled}
          />
        </div>
      );
    };

    return <CompanySelectorWrapper />;
  },
};

export const LightVariant: Story = {
  args: {
    companies: mockCompanies,
    value: mockCompanies[0],
    variant: 'light',
    collapsed: false,
    showChevron: true,
    disabled: false,
  },
  render: (args) => {
    const CompanySelectorWrapper = () => {
      const [selectedCompany, setSelectedCompany] = useState<Company | null>(
        args.value || mockCompanies[0]
      );

      return (
        <div className="w-64 bg-white p-4">
          <CompanySelector
            companies={args.companies}
            value={selectedCompany}
            onChange={setSelectedCompany}
            variant={args.variant}
            collapsed={args.collapsed}
            showChevron={args.showChevron}
            disabled={args.disabled}
          />
        </div>
      );
    };

    return <CompanySelectorWrapper />;
  },
};

export const Disabled: Story = {
  args: {
    companies: mockCompanies,
    value: mockCompanies[0],
    variant: 'dark',
    collapsed: false,
    showChevron: false,
    disabled: true,
  },
  render: (args) => {
    const CompanySelectorWrapper = () => {
      const [selectedCompany, setSelectedCompany] = useState<Company | null>(
        args.value || mockCompanies[0]
      );

      return (
        <div className="w-64 bg-gray-900 p-4">
          <CompanySelector
            companies={args.companies}
            value={selectedCompany}
            onChange={setSelectedCompany}
            variant={args.variant}
            collapsed={args.collapsed}
            showChevron={args.showChevron}
            disabled={args.disabled}
          />
        </div>
      );
    };

    return <CompanySelectorWrapper />;
  },
};
