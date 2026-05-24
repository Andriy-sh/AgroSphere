import type { Meta, StoryObj } from '@storybook/react';
import { FileCard } from './filecard';
import { Eye, Edit, Trash2 } from 'lucide-react';

const meta: Meta<typeof FileCard> = {
  component: FileCard,
  title: 'Components/FileCard',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A versatile file display component that shows file information with customizable icons, download functionality, and additional actions. Perfect for file browsers, document management systems, and any interface where files need to be displayed and interacted with.\n\n**Features:**\n- Automatic file type detection with appropriate icons and colors\n- Built-in download functionality with URL or custom handler\n- Customizable styling for all elements\n- Support for additional action buttons\n- Click handlers for file selection\n- Responsive design with text truncation\n- Accessibility features with proper ARIA labels\n\n**File Types Supported:**\n- PDF, DOCX, and text files (blue)\n- Images (purple)\n- Archives/ZIP files (orange)\n- Code files (green)\n- Other files (gray)\n\n**Usage:**\nProvide a filename and optionally a download URL. The component will automatically detect the file type and display an appropriate icon. Add custom actions or override the default download behavior as needed.',
      },
    },
  },
  argTypes: {
    filename: {
      description: 'The name of the file to display',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
      },
    },
    downloadUrl: {
      description:
        'URL for downloading the file. If provided, enables the download button.',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
      },
    },
    filetype: {
      description: 'The type of file to determine icon and color',
      control: { type: 'select' },
      options: ['pdf', 'docx', 'image', 'zip', 'code', 'text', 'other'],
      table: {
        type: { summary: 'FileType' },
        defaultValue: { summary: 'other' },
      },
    },
    showDownload: {
      description: 'Whether to show the download button (requires downloadUrl)',
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    icon: {
      description: 'Custom icon to override the default file type icon',
      control: { type: 'object' },
      table: {
        type: { summary: 'React.ReactNode' },
      },
    },
    onClick: {
      description: 'Callback function when the file card is clicked',
      action: 'clicked',
      table: {
        type: { summary: '() => void' },
      },
    },
    onDownload: {
      description:
        'Custom download handler to override default download behavior',
      action: 'downloaded',
      table: {
        type: { summary: '() => void' },
      },
    },
    extraActions: {
      description:
        'Additional action buttons to display next to the download button',
      control: { type: 'object' },
      table: {
        type: { summary: 'React.ReactNode' },
      },
    },
    className: {
      description: 'Additional CSS classes for the root container',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
      },
    },
    fileIconClassName: {
      description: 'Additional CSS classes for the file icon',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
      },
    },
    filenameClassName: {
      description: 'Additional CSS classes for the filename text',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
      },
    },
    downloadIconClassName: {
      description: 'Additional CSS classes for the download button',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof FileCard>;

export const Default: Story = {
  args: {
    filename: 'document.pdf',
    downloadUrl: 'https://example.com/document.pdf',
    filetype: 'pdf',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Basic file card with PDF document. Shows the default file icon, filename, and download button. The component automatically detects the file type and applies appropriate styling.',
      },
    },
  },
};

export const ImageFile: Story = {
  args: {
    filename: 'vacation-photo.jpg',
    downloadUrl: 'https://example.com/vacation-photo.jpg',
    filetype: 'image',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Image file card with purple icon. Demonstrates how the component handles different file types with appropriate visual indicators.',
      },
    },
  },
};

export const CodeFile: Story = {
  args: {
    filename: 'app.js',
    downloadUrl: 'https://example.com/app.js',
    filetype: 'code',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Code file card with green icon. Shows how the component displays programming files with distinct visual styling.',
      },
    },
  },
};

export const ArchiveFile: Story = {
  args: {
    filename: 'project-backup.zip',
    downloadUrl: 'https://example.com/project-backup.zip',
    filetype: 'zip',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Archive file card with orange icon. Demonstrates the component handling compressed files and archives.',
      },
    },
  },
};

export const WithExtraActions: Story = {
  args: {
    filename: 'important-document.docx',
    downloadUrl: 'https://example.com/important-document.docx',
    filetype: 'docx',
    extraActions: (
      <>
        <button
          className="flex items-center justify-center p-1.5 text-gray-500 hover:bg-gray-300 hover:text-blue-600 rounded-md"
          aria-label="View file"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          className="flex items-center justify-center p-1.5 text-gray-500 hover:bg-gray-300 hover:text-green-600 rounded-md"
          aria-label="Edit file"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          className="flex items-center justify-center p-1.5 text-gray-500 hover:bg-gray-300 hover:text-red-600 rounded-md"
          aria-label="Delete file"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'File card with additional action buttons (view, edit, delete). Shows how to extend the component with custom actions while maintaining the download functionality.',
      },
    },
  },
};

export const ClickableCard: Story = {
  args: {
    filename: 'presentation.pptx',
    downloadUrl: 'https://example.com/presentation.pptx',
    filetype: 'other',
    onClick: () => alert('File selected: presentation.pptx'),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Clickable file card that triggers a selection action. Demonstrates how to make the entire card interactive for file selection or preview functionality.',
      },
    },
  },
};

export const CustomDownloadHandler: Story = {
  args: {
    filename: 'sensitive-data.xlsx',
    filetype: 'other',
    showDownload: true,
    onDownload: () => {
      alert(
        'Custom download handler: Logging download attempt and showing confirmation'
      );
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'File card with custom download handler. Shows how to override the default download behavior for logging, analytics, or custom download workflows.',
      },
    },
  },
};

export const LongFilename: Story = {
  args: {
    filename:
      'very-long-filename-that-exceeds-normal-width-and-needs-truncation.pdf',
    downloadUrl: 'https://example.com/very-long-filename.pdf',
    filetype: 'pdf',
  },
  parameters: {
    docs: {
      description: {
        story:
          'File card with a very long filename. Demonstrates the text truncation feature and how the component handles overflow gracefully.',
      },
    },
  },
};

export const NoDownload: Story = {
  args: {
    filename: 'read-only-file.txt',
    filetype: 'text',
    showDownload: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'File card without download functionality. Useful for read-only files or when download is not available or permitted.',
      },
    },
  },
};

export const CustomIcon: Story = {
  args: {
    filename: 'special-file.xyz',
    downloadUrl: 'https://example.com/special-file.xyz',
    filetype: 'other',
    icon: (
      <div className="w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded" />
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'File card with custom icon. Shows how to override the default file type icon with a custom React component for special file types or branding.',
      },
    },
  },
};
