import type { Meta, StoryObj } from '@storybook/react';
import Accordion from './accordion';
import { ChevronDown, FileText, Settings, User, Calendar } from 'lucide-react';

const meta: Meta<typeof Accordion> = {
  component: Accordion,
  title: 'Components/Accordion',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The Accordion component for creating collapsible content sections.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-96">
      <Accordion>
        <Accordion.Trigger className="flex items-center justify-between w-full p-4 text-left bg-white border border-gray-200 rounded-t-lg hover:bg-gray-50">
          <span className="font-medium">Main Information</span>
          <ChevronDown className="w-4 h-4 transition-transform duration-200" />
        </Accordion.Trigger>
        <Accordion.Panel className="p-4 bg-white border border-gray-200 border-t-0 rounded-b-lg">
          <p className="text-gray-700">
            This is the main information about the project. Here you can place a
            detailed description, requirements, and other important details.
          </p>
        </Accordion.Panel>
      </Accordion>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A basic accordion with a single section that can be expanded and collapsed.',
      },
    },
  },
};

export const WithIcons: Story = {
  render: () => (
    <div className="w-96 space-y-2">
      <Accordion>
        <Accordion.Trigger className="flex items-center justify-between w-full p-4 text-left bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-blue-600" />
            <span className="font-medium">User Profile</span>
          </div>
          <ChevronDown className="w-4 h-4 transition-transform duration-200" />
        </Accordion.Trigger>
        <Accordion.Panel className="p-4 bg-white border border-gray-200 border-t-0 rounded-b-lg">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter your email"
              />
            </div>
          </div>
        </Accordion.Panel>
      </Accordion>

      <Accordion>
        <Accordion.Trigger className="flex items-center justify-between w-full p-4 text-left bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-green-600" />
            <span className="font-medium">Settings</span>
          </div>
          <ChevronDown className="w-4 h-4 transition-transform duration-200" />
        </Accordion.Trigger>
        <Accordion.Panel className="p-4 bg-white border border-gray-200 border-t-0 rounded-b-lg">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Notifications</span>
              <input type="checkbox" className="rounded" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Dark theme</span>
              <input type="checkbox" className="rounded" />
            </div>
          </div>
        </Accordion.Panel>
      </Accordion>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Accordion with icons for better visual identification of sections.',
      },
    },
  },
};

export const Multiple: Story = {
  render: () => (
    <div className="w-96 space-y-2">
      <Accordion>
        <Accordion.Trigger className="flex items-center justify-between w-full p-4 text-left bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
          <span className="font-medium">Tasks</span>
          <ChevronDown className="w-4 h-4 transition-transform duration-200" />
        </Accordion.Trigger>
        <Accordion.Panel className="p-4 bg-white border border-gray-200 border-t-0 rounded-b-lg">
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Soil sample collection</li>
            <li>• Water quality analysis</li>
            <li>• Plant monitoring</li>
          </ul>
        </Accordion.Panel>
      </Accordion>

      <Accordion>
        <Accordion.Trigger className="flex items-center justify-between w-full p-4 text-left bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
          <span className="font-medium">Documents</span>
          <ChevronDown className="w-4 h-4 transition-transform duration-200" />
        </Accordion.Trigger>
        <Accordion.Panel className="p-4 bg-white border border-gray-200 border-t-0 rounded-b-lg">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Quality Report.pdf</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <FileText className="w-4 h-4 text-green-600" />
              <span>Sample Collection Protocol.docx</span>
            </div>
          </div>
        </Accordion.Panel>
      </Accordion>

      <Accordion>
        <Accordion.Trigger className="flex items-center justify-between w-full p-4 text-left bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
          <span className="font-medium">Schedule</span>
          <ChevronDown className="w-4 h-4 transition-transform duration-200" />
        </Accordion.Trigger>
        <Accordion.Panel className="p-4 bg-white border border-gray-200 border-t-0 rounded-b-lg">
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span>Monday - Sample Collection</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span>Wednesday - Results Analysis</span>
            </div>
          </div>
        </Accordion.Panel>
      </Accordion>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Multiple accordion sections displayed as separate components.',
      },
    },
  },
};

export const NestedContent: Story = {
  render: () => (
    <div className="w-96">
      <Accordion>
        <Accordion.Trigger className="flex items-center justify-between w-full p-4 text-left bg-white border border-gray-200 rounded-t-lg hover:bg-gray-50">
          <span className="font-medium">Detailed Information</span>
          <ChevronDown className="w-4 h-4 transition-transform duration-200" />
        </Accordion.Trigger>
        <Accordion.Panel className="p-4 bg-white border border-gray-200 border-t-0 rounded-b-lg">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                Project Description
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                This project aims to improve the quality of agricultural
                products through systematic monitoring and analysis of soil and
                water.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Key Metrics</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded">
                  <div className="font-medium text-gray-900">Soil pH</div>
                  <div className="text-gray-600">6.5 - 7.0</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="font-medium text-gray-900">
                    Moisture Content
                  </div>
                  <div className="text-gray-600">15-20%</div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Next Steps</h4>
              <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
                <li>Complete sample collection</li>
                <li>Conduct laboratory analysis</li>
                <li>Prepare report</li>
                <li>Present results</li>
              </ol>
            </div>
          </div>
        </Accordion.Panel>
      </Accordion>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Accordion with rich nested content, including headings, metrics, and lists.',
      },
    },
  },
};

export const Colored: Story = {
  render: () => (
    <div className="w-96 space-y-2">
      <Accordion>
        <Accordion.Trigger className="flex items-center justify-between w-full p-4 text-left bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100">
          <span className="font-medium text-blue-900">Information</span>
          <ChevronDown className="w-4 h-4 text-blue-600 transition-transform duration-200" />
        </Accordion.Trigger>
        <Accordion.Panel className="p-4 bg-blue-50 border border-blue-200 border-t-0 rounded-b-lg">
          <p className="text-blue-800">
            This is an informational section with a blue color scheme.
          </p>
        </Accordion.Panel>
      </Accordion>

      <Accordion>
        <Accordion.Trigger className="flex items-center justify-between w-full p-4 text-left bg-green-50 border border-green-200 rounded-lg hover:bg-green-100">
          <span className="font-medium text-green-900">Success</span>
          <ChevronDown className="w-4 h-4 text-green-600 transition-transform duration-200" />
        </Accordion.Trigger>
        <Accordion.Panel className="p-4 bg-green-50 border border-green-200 border-t-0 rounded-b-lg">
          <p className="text-green-800">
            This is a success section with a green color scheme.
          </p>
        </Accordion.Panel>
      </Accordion>

      <Accordion>
        <Accordion.Trigger className="flex items-center justify-between w-full p-4 text-left bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100">
          <span className="font-medium text-yellow-900">Warning</span>
          <ChevronDown className="w-4 h-4 text-yellow-600 transition-transform duration-200" />
        </Accordion.Trigger>
        <Accordion.Panel className="p-4 bg-yellow-50 border border-yellow-200 border-t-0 rounded-b-lg">
          <p className="text-yellow-800">
            This is a warning section with a yellow color scheme.
          </p>
        </Accordion.Panel>
      </Accordion>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Accordion with different color schemes for various content types.',
      },
    },
  },
};

export const Animated: Story = {
  render: () => (
    <div className="w-96">
      <Accordion>
        <Accordion.Trigger className="group flex items-center justify-between w-full p-4 text-left bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200">
          <span className="font-medium group-hover:text-blue-600 transition-colors duration-200">
            Animated Accordion
          </span>
          <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-blue-600 transition-all duration-200 group-data-[state=open]:rotate-180" />
        </Accordion.Trigger>
        <Accordion.Panel className="p-4 bg-white border border-gray-200 border-t-0 rounded-b-lg">
          <div className="space-y-3">
            <p className="text-gray-700">
              This accordion features smooth animations for a better user
              experience.
            </p>
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-lg text-white text-sm">
              Gradient block with animation
            </div>
          </div>
        </Accordion.Panel>
      </Accordion>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Accordion with enhanced animations and visual effects.',
      },
    },
  },
};
