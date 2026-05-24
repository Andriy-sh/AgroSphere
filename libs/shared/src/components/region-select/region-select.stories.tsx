import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { RegionSelect } from './region-select';
import { CountrySelect } from '../country-select/country-select';
import { Label } from '../label/label';
const meta: Meta<typeof RegionSelect> = {
  title: 'Components/RegionSelect',
  component: RegionSelect,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'Selected region value',
    },
    onChange: {
      action: 'changed',
      description: 'Callback when region selection changes',
    },
    country: {
      control: 'text',
      description: 'Selected country name (required for regions to load)',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text when no region is selected',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the select is disabled',
    },
    error: {
      control: 'text',
      description: 'Error message to display',
    },
    warning: {
      control: 'text',
      description: 'Warning message to display',
    },
    required: {
      control: 'boolean',
      description: 'Whether the field is required',
    },
  },
};

export default meta;
type Story = StoryObj<typeof RegionSelect>;

const InteractiveStory = () => {
  const [selectedCountry, setSelectedCountry] =
    useState<string>('United States');
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [warning, setWarning] = useState<string>('');
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isRequired, setIsRequired] = useState<boolean>(false);

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    if (error) setError('');
  };

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setSelectedRegion('');
    setError('');
    setWarning('');
  };

  return (
    <div className="w-full max-w-2xl p-6 bg-white rounded-lg border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="block text-xs font-normal text-basic-black ">
            Country
          </label>
          <CountrySelect
            value={selectedCountry}
            onChange={handleCountryChange}
            placeholder="Select country"
            className="w-full"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label type="region" country={selectedCountry} />
          <RegionSelect
            value={selectedRegion}
            onChange={handleRegionChange}
            country={selectedCountry}
            placeholder={`Select ${
              selectedCountry
                ? getRegionLabel(selectedCountry).toLowerCase()
                : 'region'
            }`}
            disabled={isDisabled}
            error={error}
            warning={warning}
            required={isRequired}
            className="w-full"
          />
        </div>
      </div>
     
    </div>
  );
};

const getRegionLabel = (countryName?: string): string => {
  if (!countryName) return 'Region';

  const regionLabels: Record<string, string> = {
    'United States': 'State',
    USA: 'State',
    US: 'State',
    Ireland: 'County',
    'United Kingdom': 'County',
    UK: 'County',
    Canada: 'Province',
    Australia: 'State',
    Germany: 'State',
    France: 'Region',
    Japan: 'Prefecture',
    Brazil: 'State',
    India: 'State',
  };

  return regionLabels[countryName] || 'Region';
};

export const Interactive: Story = {
  render: () => <InteractiveStory />,
  parameters: {
    docs: {
      description: {
        story:
          'Interactive example showing a complete form with country selection, dynamic region label, and region selection with all component features including error/warning states, disabled state, and required field validation.',
      },
    },
  },
};
