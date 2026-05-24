import type { Meta, StoryObj } from '@storybook/react';
import CurrentSubscriptionCard from './current-subscription-card';

const meta: Meta<typeof CurrentSubscriptionCard> = {
  component: CurrentSubscriptionCard,
  title: 'Components/CurrentSubscriptionCard',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A subscription management card component that displays current subscription details including plan name, pricing, billing period, start date, and cancellation options. This component provides users with a clear overview of their active subscription and allows them to manage their subscription status. The card supports different subscription tiers, pricing models, and cancellation states.',
      },
    },
  },
  argTypes: {
    plan: {
      description:
        'The name of the subscription plan (e.g., Basic, Pro, Enterprise)',
      control: { type: 'text' },
    },
    price: {
      description: 'The subscription price with currency symbol',
      control: { type: 'text' },
    },
    period: {
      description:
        'The billing period (e.g., per month, per year, per quarter)',
      control: { type: 'text' },
    },
    startDate: {
      description:
        'The date when the subscription started (formatted as DD.MM.YYYY)',
      control: { type: 'text' },
    },
    onCancel: {
      description:
        'Callback function triggered when user attempts to cancel subscription',
      action: 'cancelled',
    },
    cancelDisabled: {
      description:
        'Whether the cancel button is disabled (e.g., for trial periods or special plans)',
      control: { type: 'boolean' },
    },
  },
};
export default meta;
type Story = StoryObj<typeof CurrentSubscriptionCard>;

export const Active: Story = {
  args: {
    plan: 'Basic',
    price: '$29',
    period: 'per month',
    startDate: '27.05.2024',
    onCancel: () => alert('Cancel subscription'),
    cancelDisabled: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Active subscription card with basic plan details. This demonstrates a standard subscription that can be cancelled by the user. The card shows essential information including plan name, monthly pricing, and subscription start date.',
      },
    },
  },
};

export const CancelDisabled: Story = {
  args: {
    plan: 'Pro',
    price: '$59',
    period: 'per month',
    startDate: '01.06.2024',
    cancelDisabled: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Subscription card with disabled cancellation option. This is typically used for trial periods, promotional subscriptions, or enterprise plans where immediate cancellation is not allowed.',
      },
    },
  },
};

export const EnterprisePlan: Story = {
  args: {
    plan: 'Enterprise',
    price: '$199',
    period: 'per month',
    startDate: '15.03.2024',
    onCancel: () =>
      alert('Contact sales team to cancel Enterprise subscription'),
    cancelDisabled: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Enterprise subscription card with higher pricing tier. This demonstrates how the component handles premium plans with custom cancellation workflows that may require contacting sales teams.',
      },
    },
  },
};

export const AnnualSubscription: Story = {
  args: {
    plan: 'Pro Annual',
    price: '$599',
    period: 'per year',
    startDate: '01.01.2024',
    onCancel: () =>
      alert('Annual subscription cancellation - prorated refund may apply'),
    cancelDisabled: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Annual subscription card showing yearly billing cycle. This demonstrates the component handling different billing periods and the potential for prorated refunds on annual plans.',
      },
    },
  },
};

export const TrialPeriod: Story = {
  args: {
    plan: 'Premium Trial',
    price: '$0',
    period: 'trial period',
    startDate: '10.06.2024',
    cancelDisabled: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Trial subscription card with free pricing and disabled cancellation. This is used for promotional trial periods where users cannot cancel during the trial but can upgrade or let it expire.',
      },
    },
  },
};

export const QuarterlyBilling: Story = {
  args: {
    plan: 'Business',
    price: '$149',
    period: 'per quarter',
    startDate: '01.04.2024',
    onCancel: () => alert('Quarterly subscription cancellation'),
    cancelDisabled: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Quarterly billing subscription card. This demonstrates the component handling non-standard billing periods and business-focused subscription models.',
      },
    },
  },
};

export const LongTermSubscription: Story = {
  args: {
    plan: 'Lifetime',
    price: '$999',
    period: 'one-time payment',
    startDate: '01.01.2023',
    cancelDisabled: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Lifetime subscription card with one-time payment model. This demonstrates how the component handles special subscription types where cancellation is not applicable.',
      },
    },
  },
};

export const PromotionalPlan: Story = {
  args: {
    plan: 'Student',
    price: '$9',
    period: 'per month',
    startDate: '20.05.2024',
    onCancel: () => alert('Student subscription cancellation'),
    cancelDisabled: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Promotional subscription card with discounted pricing. This demonstrates the component handling special pricing tiers for specific user groups like students.',
      },
    },
  },
};
