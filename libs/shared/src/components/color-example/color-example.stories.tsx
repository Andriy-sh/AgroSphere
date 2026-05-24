import type { Meta, StoryObj } from '@storybook/react';
import { ColorExample } from './color-example';

const meta: Meta<typeof ColorExample> = {
  title: 'Design System/Colors',
  component: ColorExample,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Demonstration of all available colors in the LiveFarm design system. Includes basic colors, gradients, and usage examples.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      description: 'Additional CSS classes for styling',
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithCustomStyling: Story = {
  args: {
    className: 'bg-basic-white',
  },
};

export const DarkBackground: Story = {
  args: {
    className: 'bg-basic-black text-basic-white',
  },
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};

export const Compact: Story = {
  args: {
    className: 'p-4 space-y-2',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const GrayTheme: Story = {
  args: {
    className: 'bg-basic-gray-light',
  },
  parameters: {
    backgrounds: {
      default: 'light',
    },
  },
};

export const GreenTheme: Story = {
  args: {
    className: 'bg-basic-green-light',
  },
  parameters: {
    backgrounds: {
      default: 'light',
    },
  },
};

export const BlueTheme: Story = {
  args: {
    className: 'bg-basic-white',
  },
  parameters: {
    backgrounds: {
      default: 'light',
    },
  },
};

export const HighContrast: Story = {
  args: {
    className: 'bg-basic-black text-basic-white',
  },
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};

export const LightMode: Story = {
  args: {
    className: 'bg-basic-white text-basic-black',
  },
  parameters: {
    backgrounds: {
      default: 'light',
    },
  },
};

export const GrayColors: Story = {
  args: {
    className: 'bg-basic-white',
  },
  render: () => (
    <div className="p-6 space-y-4 bg-basic-white">
      <h2 className="text-2xl font-bold text-basic-black">
        Gray Color Palette
      </h2>

      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div
            className="w-20 h-20 rounded-lg border-2 border-basic-black"
            style={{ backgroundColor: '#818D99' }}
          />
          <div>
            <h3 className="text-lg font-semibold text-basic-black">
              Basic Gray
            </h3>
            <p className="text-basic-gray">
              #818D99 - Used for secondary text and borders
            </p>
            <div className="mt-2 space-y-1">
              <div className="p-2 bg-basic-gray text-basic-white rounded">
                bg-basic-gray
              </div>
              <div className="p-2 text-basic-gray border border-basic-gray rounded">
                text-basic-gray
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div
            className="w-20 h-20 rounded-lg border-2 border-basic-black"
            style={{ backgroundColor: '#dbdee8' }}
          />
          <div>
            <h3 className="text-lg font-semibold text-basic-black">
              Basic Gray Light
            </h3>
            <p className="text-basic-gray">
              #dbdee8 - Used for backgrounds and subtle borders
            </p>
            <div className="mt-2 space-y-1">
              <div className="p-2 bg-basic-gray-light text-basic-black rounded">
                bg-basic-gray-light
              </div>
              <div className="p-2 text-basic-gray-light border border-basic-gray-light rounded">
                text-basic-gray-light
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const BlueColors: Story = {
  args: {
    className: 'bg-basic-white',
  },
  render: () => (
    <div className="p-6 space-y-4 bg-basic-white">
      <h2 className="text-2xl font-bold text-basic-black">
        Blue Color Palette
      </h2>

      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div
            className="w-20 h-20 rounded-lg border-2 border-basic-black"
            style={{ backgroundColor: '#41B0FF' }}
          />
          <div>
            <h3 className="text-lg font-semibold text-basic-black">
              Basic Blue
            </h3>
            <p className="text-basic-gray">
              #41B0FF - Used for links, info states, and interactive elements
            </p>
            <div className="mt-2 space-y-1">
              <div className="p-2 bg-basic-blue text-basic-white rounded">
                bg-basic-blue
              </div>
              <div className="p-2 text-basic-blue border border-basic-blue rounded">
                text-basic-blue
              </div>
              <button className="px-4 py-2 bg-basic-blue text-basic-white rounded hover:opacity-90">
                Info Button
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const GreenVariants: Story = {
  args: {
    className: 'bg-basic-white',
  },
  render: () => (
    <div className="p-6 space-y-4 bg-basic-white">
      <h2 className="text-2xl font-bold text-basic-black">
        Green Color Variants
      </h2>

      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div
            className="w-20 h-20 rounded-lg border-2 border-basic-black"
            style={{ backgroundColor: '#29B54C' }}
          />
          <div>
            <h3 className="text-lg font-semibold text-basic-black">
              Basic Green
            </h3>
            <p className="text-basic-gray">
              #29B54C - Primary green for success states and primary actions
            </p>
            <div className="mt-2 space-y-1">
              <div className="p-2 bg-basic-green text-basic-white rounded">
                bg-basic-green
              </div>
              <button className="px-4 py-2 bg-basic-green text-basic-white rounded hover:opacity-90">
                Primary Button
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div
            className="w-20 h-20 rounded-lg border-2 border-basic-black"
            style={{ backgroundColor: '#00AF4D1F' }}
          />
          <div>
            <h3 className="text-lg font-semibold text-basic-black">
              Basic Green Light
            </h3>
            <p className="text-basic-gray">
              #00AF4D1F - Light green background with transparency
            </p>
            <div className="mt-2 space-y-1">
              <div className="p-2 bg-basic-green-light text-basic-black rounded border border-basic-green">
                bg-basic-green-light
              </div>
              <button className="px-4 py-2 bg-basic-green-light text-basic-black rounded border border-basic-green hover:opacity-90">
                Light Green Button
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div
            className="w-20 h-20 rounded-lg border-2 border-basic-black"
            style={{ backgroundColor: '#25A044' }}
          />
          <div>
            <h3 className="text-lg font-semibold text-basic-black">
              Basic Green Dark
            </h3>
            <p className="text-basic-gray">
              #25A044 - Darker green for hover states and emphasis
            </p>
            <div className="mt-2 space-y-1">
              <div className="p-2 bg-basic-green-dark text-basic-white rounded">
                bg-basic-green-dark
              </div>
              <button className="px-4 py-2 bg-basic-green-dark text-basic-white rounded hover:opacity-90">
                Dark Green Button
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const ColorCombinations: Story = {
  args: {
    className: 'bg-basic-white',
  },
  render: () => (
    <div className="p-6 space-y-4 bg-basic-white">
      <h2 className="text-2xl font-bold text-basic-black">
        Color Combinations
      </h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-basic-black mb-4">
            Button Combinations
          </h3>
          <div className="flex flex-wrap gap-4">
            <button className="px-4 py-2 bg-basic-green text-basic-white rounded hover:bg-basic-green-dark">
              Primary (Green)
            </button>
            <button className="px-4 py-2 bg-basic-blue text-basic-white rounded hover:opacity-90">
              Info (Blue)
            </button>
            <button className="px-4 py-2 bg-basic-gray text-basic-white rounded hover:opacity-90">
              Secondary (Gray)
            </button>
            <button className="px-4 py-2 bg-basic-green-light text-basic-black rounded border border-basic-green hover:bg-basic-green">
              Outline (Light Green)
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-basic-black mb-4">
            Card Examples
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-basic-green-light border border-basic-green rounded-lg">
              <h4 className="font-semibold text-basic-black">Success Card</h4>
              <p className="text-basic-gray">
                This card uses green light background
              </p>
            </div>
            <div className="p-4 bg-basic-gray-light border border-basic-gray rounded-lg">
              <h4 className="font-semibold text-basic-black">Info Card</h4>
              <p className="text-basic-gray">
                This card uses gray light background
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-basic-black mb-4">
            Text Combinations
          </h3>
          <div className="space-y-2">
            <p className="text-basic-black font-semibold">
              Primary text (Basic Black)
            </p>
            <p className="text-basic-gray">Secondary text (Basic Gray)</p>
            <p className="text-basic-green">Success text (Basic Green)</p>
            <p className="text-basic-blue">Link text (Basic Blue)</p>
            <p className="text-basic-red">Error text (Basic Red)</p>
            <p className="text-basic-yellow">Warning text (Basic Yellow)</p>
          </div>
        </div>
      </div>
    </div>
  ),
};
