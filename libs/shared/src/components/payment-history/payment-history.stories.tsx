
import { PaymentHistoryItem, PaymentHistory } from './payment-history';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof PaymentHistory> = {
  title: 'Components/PaymentHistory',
  component: PaymentHistory,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A comprehensive payment history component that displays a chronological list of payment transactions.

## Features
- **Chronological Display**: Shows payments in reverse chronological order (newest first)
- **Clean Design**: Clean, readable layout with consistent formatting
- **Flexible Data**: Accepts custom payment history data with date and amount
- **Responsive**: Adapts to different screen sizes and content lengths
- **Accessible**: Built with semantic HTML and proper ARIA labels

## Use Cases
- Subscription management dashboards
- Financial transaction history
- Billing and invoice tracking
- Account activity pages
- Payment confirmation displays
- Financial reporting interfaces
        `,
      },
    },
  },
  argTypes: {
    history: {
      description: 'Array of payment history items to display',
      table: {
        type: { summary: 'PaymentHistoryItem[]' },
        defaultValue: { summary: '[]' },
      },
      control: { type: 'object' },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '600px', width: '100%', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof PaymentHistory>;

const testHistory: PaymentHistoryItem[] = [
  { date: 'May 27, 2025', amount: '$29' },
  { date: 'April 27, 2025', amount: '$29' },
  { date: 'March 27, 2025', amount: '$29' },
  { date: 'February 27, 2025', amount: '$29' },
  { date: 'January 27, 2025', amount: '$29' },
  { date: 'December 27, 2024', amount: '$29' },
  { date: 'November 27, 2024', amount: '$29' },
  { date: 'October 27, 2024', amount: '$29' },
  { date: 'September 27, 2024', amount: '$29' },
  { date: 'August 27, 2024', amount: '$29' },
  { date: 'July 27, 2024', amount: '$29' },
  { date: 'June 27, 2024', amount: '$29' },
  { date: 'May 27, 2024', amount: '$29' },
];

const variedHistory: PaymentHistoryItem[] = [
  { date: 'May 27, 2025', amount: '$49.99' },
  { date: 'April 27, 2025', amount: '$29.99' },
  { date: 'March 27, 2025', amount: '$79.99' },
  { date: 'February 27, 2025', amount: '$29.99' },
  { date: 'January 27, 2025', amount: '$29.99' },
  { date: 'December 27, 2024', amount: '$99.99' },
  { date: 'November 27, 2024', amount: '$29.99' },
  { date: 'October 27, 2024', amount: '$29.99' },
];

const shortHistory: PaymentHistoryItem[] = [
  { date: 'May 27, 2025', amount: '$29' },
  { date: 'April 27, 2025', amount: '$29' },
  { date: 'March 27, 2025', amount: '$29' },
];

const longHistory: PaymentHistoryItem[] = [
  { date: 'May 27, 2025', amount: '$29' },
  { date: 'April 27, 2025', amount: '$29' },
  { date: 'March 27, 2025', amount: '$29' },
  { date: 'February 27, 2025', amount: '$29' },
  { date: 'January 27, 2025', amount: '$29' },
  { date: 'December 27, 2024', amount: '$29' },
  { date: 'November 27, 2024', amount: '$29' },
  { date: 'October 27, 2024', amount: '$29' },
  { date: 'September 27, 2024', amount: '$29' },
  { date: 'August 27, 2024', amount: '$29' },
  { date: 'July 27, 2024', amount: '$29' },
  { date: 'June 27, 2024', amount: '$29' },
  { date: 'May 27, 2024', amount: '$29' },
  { date: 'April 27, 2024', amount: '$29' },
  { date: 'March 27, 2024', amount: '$29' },
  { date: 'February 27, 2024', amount: '$29' },
  { date: 'January 27, 2024', amount: '$29' },
  { date: 'December 27, 2023', amount: '$29' },
  { date: 'November 27, 2023', amount: '$29' },
  { date: 'October 27, 2023', amount: '$29' },
];

const premiumHistory: PaymentHistoryItem[] = [
  { date: 'May 27, 2025', amount: '$99.99' },
  { date: 'April 27, 2025', amount: '$99.99' },
  { date: 'March 27, 2025', amount: '$99.99' },
  { date: 'February 27, 2025', amount: '$99.99' },
  { date: 'January 27, 2025', amount: '$99.99' },
  { date: 'December 27, 2024', amount: '$99.99' },
];

const enterpriseHistory: PaymentHistoryItem[] = [
  { date: 'May 27, 2025', amount: '$299.99' },
  { date: 'April 27, 2025', amount: '$299.99' },
  { date: 'March 27, 2025', amount: '$299.99' },
  { date: 'February 27, 2025', amount: '$299.99' },
  { date: 'January 27, 2025', amount: '$299.99' },
];

export const Default: Story = {
  args: {
    history: testHistory,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Standard payment history display with consistent monthly payments. This is the most common use case for subscription-based services.',
      },
    },
  },
};

export const ShortHistory: Story = {
  args: {
    history: shortHistory,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Payment history with only a few recent transactions. Useful for new customers or when displaying limited history.',
      },
    },
  },
};

export const LongHistory: Story = {
  args: {
    history: longHistory,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Extended payment history showing many months of transactions. Demonstrates how the component handles larger datasets.',
      },
    },
  },
};

export const VariedAmounts: Story = {
  args: {
    history: variedHistory,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Payment history with varying amounts, showing different pricing tiers or promotional periods. Useful for demonstrating flexible pricing models.',
      },
    },
  },
};

export const PremiumSubscription: Story = {
  args: {
    history: premiumHistory,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Payment history for a premium subscription tier. Shows higher-priced monthly payments typical of premium service offerings.',
      },
    },
  },
};

export const EnterprisePlan: Story = {
  args: {
    history: enterpriseHistory,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Payment history for an enterprise-level subscription. Demonstrates the component with high-value transactions.',
      },
    },
  },
};

export const EmptyHistory: Story = {
  args: {
    history: [],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Empty payment history state. Useful for new accounts or when no payment data is available.',
      },
    },
  },
};

export const SinglePayment: Story = {
  args: {
    history: [{ date: 'May 27, 2025', amount: '$29' }],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Payment history with a single transaction. Common for one-time purchases or new customers.',
      },
    },
  },
};
