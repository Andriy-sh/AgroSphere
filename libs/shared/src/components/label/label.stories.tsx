import type { Meta, StoryObj } from '@storybook/react';
import { Label } from './label';
import { getPostalCodeLabel } from '../../utils/postal-code-utils';
import { getRegionLabel } from '../../utils/region-utils';
import { useState } from 'react';
import { CountrySelect } from '../country-select/country-select';

const meta: Meta<typeof Label> = {
  title: 'Components/Label',
  component: Label,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'error', 'warning', 'success'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'default', 'lg'],
    },
    required: {
      control: { type: 'boolean' },
    },
    type: {
      control: { type: 'select' },
      options: ['default', 'postal-code', 'region'],
    },
    country: {
      control: { type: 'text' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Label text',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <Label>Default label</Label>
      <Label variant="error">Error label</Label>
      <Label variant="warning">Warning label</Label>
      <Label variant="success">Success label</Label>
      <Label required>Required label</Label>
    </div>
  ),
};

export const AllTypes: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold mb-4">Postal Codes</h3>
        <Label type="postal-code" country="United States" />
        <Label type="postal-code" country="Ireland" />
        <Label type="postal-code" country="United Kingdom" />
        <Label type="postal-code" country="Canada" />
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold mb-4">Regions</h3>
        <Label type="region" country="United States" />
        <Label type="region" country="Canada" />
        <Label type="region" country="United Kingdom" />
        <Label type="region" country="Ukraine" />
      </div>
    </div>
  ),
};

const InteractiveDemoComponent = () => {
  const [selectedCountry, setSelectedCountry] = useState('United States');

  return (
    <div className="w-96 space-y-6 p-6 border rounded-lg bg-white">
      <h3 className="text-lg font-semibold mb-4">
        Interactive Country Selector
      </h3>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Country</Label>
          <CountrySelect
            value={selectedCountry}
            onChange={setSelectedCountry}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label type="postal-code" country={selectedCountry} />
          <div className="text-sm text-gray-500 mt-1">
            Shows: {getPostalCodeLabel(selectedCountry)}
          </div>
        </div>

        <div className="space-y-2">
          <Label type="region" country={selectedCountry} />
          <div className="text-sm text-gray-500 mt-1">
            Shows: {getRegionLabel(selectedCountry)}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Current Values:
        </h4>
        <div className="text-sm text-gray-600 space-y-1">
          <div>Country: {selectedCountry}</div>
          <div>Postal Code Label: {getPostalCodeLabel(selectedCountry)}</div>
          <div>Region Label: {getRegionLabel(selectedCountry)}</div>
        </div>
      </div>
    </div>
  );
};

export const DynamicLabelsDemo: Story = {
  render: () => {
    const countries = [
      'United States',
      'Ireland',
      'United Kingdom',
      'Canada',
      'Germany',
    ];

    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Dynamic Labels by Country</h3>
        {countries.map((country) => (
          <div key={country} className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">{country}</h4>
            <div className="space-y-2">
              <div>
                <Label type="postal-code" country={country} />
                <div className="text-sm text-gray-500 mt-1">
                  Shows: {getPostalCodeLabel(country)}
                </div>
              </div>
              <div>
                <Label type="region" country={country} />
                <div className="text-sm text-gray-500 mt-1">
                  Shows: {getRegionLabel(country)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  },
};

export const InteractiveDemo: Story = {
  render: () => <InteractiveDemoComponent />,
};
