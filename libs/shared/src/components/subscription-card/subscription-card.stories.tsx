import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SubscriptionCard } from './subscription-card';

const meta: Meta<any> = {
  title: 'Components/SubscriptionCard',
  component: SubscriptionCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A sophisticated subscription card component designed for agricultural software and services.

## Component Overview

The SubscriptionCard provides a professional way to display subscription options
with clear pricing, feature lists, and call-to-action buttons for agricultural
businesses and farmers.

## Key Features
- **Flexible pricing display**: Support for various pricing models and periods
- **Feature highlighting**: Clear presentation of included features and benefits
- **Current plan indication**: Visual feedback for active subscriptions
- **Agricultural focus**: Optimized for farm management and agricultural services
- **Responsive design**: Works seamlessly across desktop, tablet, and mobile devices
- **Selection functionality**: Radio button selection with visual feedback
- **Collapsible features**: Expandable/collapsible feature lists
- **VAT display**: Optional VAT text display

## Subscription Types
- **Basic**: Essential farm management features
- **Professional**: Advanced analytics and reporting
- **Enterprise**: Full-featured solution for large operations
- **Specialized**: Crop-specific or equipment-focused packages

## Usage Examples
- Farm management software subscriptions
- Equipment monitoring services
- Crop analysis and reporting packages
- Team collaboration and sharing plans
- Weather and forecasting services
        `,
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Subscription plan name or tier level',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Pro'" },
      },
    },
    price: {
      control: 'text',
      description: 'Subscription price with currency symbol',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'$59'" },
      },
    },
    period: {
      control: 'text',
      description: 'Billing period (e.g., per month, per year)',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'per month'" },
      },
    },
    features: {
      control: 'object',
      description: 'Array of features included in the subscription',
      table: {
        type: { summary: 'string[]' },
        defaultValue: {
          summary: "['All Basic features', 'Pro Feature 1', 'Pro Feature 2']",
        },
      },
    },
    buttonText: {
      control: 'text',
      description: 'Text displayed on the action button',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Current plan'" },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the subscription card is disabled (current plan)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    selectable: {
      control: 'boolean',
      description: 'Whether the card can be selected with a radio button',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    selected: {
      control: 'boolean',
      description: 'Whether the card is currently selected',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    showVat: {
      control: 'boolean',
      description: 'Whether to show VAT text',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    vatText: {
      control: 'text',
      description: 'Custom VAT text to display',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '"+VAT"' },
      },
    },
    collapsible: {
      control: 'boolean',
      description: 'Whether features can be collapsed/expanded',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
  args: {
    title: 'Pro',
    price: '$59',
    period: 'per month',
    features: ['All Basic features', 'Pro Feature 1', 'Pro Feature 2'],
    buttonText: 'Current plan',
    disabled: false,
    selectable: false,
    selected: false,
    showVat: false,
    vatText: '+VAT',
    collapsible: false,
  },
};
export default meta;

type Story = StoryObj<typeof SubscriptionCard>;

export const Basic: Story = {
  args: {
    title: 'Basic',
    price: '$29',
    period: 'per month',
    features: [
      'Crop management basics',
      'Weather monitoring',
      'Basic reporting',
      'Mobile app access',
    ],
    buttonText: 'Start Basic Plan',
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Basic subscription tier for small farms and individual farmers with essential crop management features.',
      },
    },
  },
};

export const Professional: Story = {
  args: {
    title: 'Professional',
    price: '$89',
    period: 'per month',
    features: [
      'All Basic features',
      'Advanced analytics',
      'Equipment monitoring',
      'Team collaboration',
      'Priority support',
    ],
    buttonText: 'Upgrade to Pro',
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Professional tier for medium-sized farms with advanced features including analytics and team collaboration.',
      },
    },
  },
};

export const Enterprise: Story = {
  args: {
    title: 'Enterprise',
    price: '$199',
    period: 'per month',
    features: [
      'All Professional features',
      'Custom integrations',
      'Dedicated account manager',
      'Advanced reporting',
      'API access',
      'White-label options',
    ],
    buttonText: 'Contact Sales',
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Enterprise solution for large agricultural operations with custom integrations and dedicated support.',
      },
    },
  },
};

export const CurrentPlan: Story = {
  args: {
    title: 'Professional',
    price: '$89',
    period: 'per month',
    features: [
      'All Basic features',
      'Advanced analytics',
      'Equipment monitoring',
      'Team collaboration',
      'Priority support',
    ],
    buttonText: 'Current plan',
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Subscription card showing the currently active plan with disabled state and visual indication.',
      },
    },
  },
};

export const AnnualPricing: Story = {
  args: {
    title: 'Professional Annual',
    price: '$799',
    period: 'per year',
    features: [
      'All Professional features',
      '2 months free',
      'Annual savings of $269',
      'Priority support',
      'Early access to new features',
    ],
    buttonText: 'Save with Annual',
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Annual subscription option with cost savings and additional benefits for long-term commitment.',
      },
    },
  },
};

export const SpecializedCrop: Story = {
  args: {
    title: 'Wheat Specialist',
    price: '$49',
    period: 'per month',
    features: [
      'Wheat-specific analytics',
      'Disease monitoring',
      'Harvest optimization',
      'Market price tracking',
      'Wheat expert consultation',
    ],
    buttonText: 'Choose Wheat Plan',
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Specialized subscription for wheat farmers with crop-specific features and expert consultation.',
      },
    },
  },
};

export const EquipmentMonitoring: Story = {
  args: {
    title: 'Equipment Pro',
    price: '$75',
    period: 'per month',
    features: [
      'Real-time equipment tracking',
      'Maintenance scheduling',
      'Fuel consumption monitoring',
      'Performance analytics',
      'Predictive maintenance alerts',
      'Equipment health reports',
    ],
    buttonText: 'Monitor Equipment',
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Equipment-focused subscription for farmers who want comprehensive machinery monitoring and maintenance.',
      },
    },
  },
};

export const TeamCollaboration: Story = {
  args: {
    title: 'Team Farm',
    price: '$129',
    period: 'per month',
    features: [
      'Up to 10 team members',
      'Shared task management',
      'Real-time collaboration',
      'Role-based permissions',
      'Team performance analytics',
      'Mobile team app',
    ],
    buttonText: 'Start Team Plan',
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Team collaboration subscription for farms with multiple workers and managers.',
      },
    },
  },
};

export const WeatherService: Story = {
  args: {
    title: 'Weather Premium',
    price: '$39',
    period: 'per month',
    features: [
      'Hyperlocal weather forecasts',
      'Crop-specific weather alerts',
      'Historical weather data',
      'Irrigation recommendations',
      'Frost protection alerts',
      'Weather-based planning tools',
    ],
    buttonText: 'Get Weather Premium',
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Weather service subscription providing advanced forecasting and crop-specific weather insights.',
      },
    },
  },
};

export const ComparisonView: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl">
      <SubscriptionCard
        title="Basic"
        price="$29"
        period="per month"
        features={[
          'Crop management basics',
          'Weather monitoring',
          'Basic reporting',
          'Mobile app access',
        ]}
        buttonText="Start Basic Plan"
        disabled={false}
      />
      <SubscriptionCard
        title="Professional"
        price="$89"
        period="per month"
        features={[
          'All Basic features',
          'Advanced analytics',
          'Equipment monitoring',
          'Team collaboration',
          'Priority support',
        ]}
        buttonText="Current plan"
        disabled={true}
      />
      <SubscriptionCard
        title="Enterprise"
        price="$199"
        period="per month"
        features={[
          'All Professional features',
          'Custom integrations',
          'Dedicated account manager',
          'Advanced reporting',
          'API access',
          'White-label options',
        ]}
        buttonText="Contact Sales"
        disabled={false}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Comparison view showing all three subscription tiers side by side, with the Professional plan highlighted as the current selection.',
      },
    },
  },
};

export const PromotionalOffer: Story = {
  args: {
    title: 'Professional',
    price: '$59',
    period: 'per month',
    features: [
      'All Basic features',
      'Advanced analytics',
      'Equipment monitoring',
      'Team collaboration',
      'Priority support',
      'Limited time: 30% off',
    ],
    buttonText: 'Get 30% Off',
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Promotional subscription card with discounted pricing and limited-time offer highlighting.',
      },
    },
  },
};

export const SelectableBasic: Story = {
  args: {
    title: 'Basic',
    price: '$29',
    period: 'per month',
    features: [
      'Mapping up to 5 farms',
      'Creating and managing tasks',
      'Receiving analysis results',
      'Export to PDF',
    ],
    buttonText: 'Choose Basic Plan',
    disabled: false,
    selectable: true,
    selected: true,
    showVat: true,
    collapsible: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Selectable Basic subscription card with Radio component, VAT display, and collapsible features - matches the design from the provided image.',
      },
    },
  },
};

const SelectableComparisonComponent = () => {
  const [selectedPlan, setSelectedPlan] = useState('basic');

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl">
      <SubscriptionCard
        title="Basic"
        price="$29"
        period="per month"
        features={[
          'Mapping up to 5 farms',
          'Creating and managing tasks',
          'Receiving analysis results',
          'Export to PDF',
        ]}
        buttonText="Choose Basic Plan"
        disabled={false}
        selectable={true}
        selected={selectedPlan === 'basic'}
        onSelect={() => setSelectedPlan('basic')}
        showVat={true}
        collapsible={true}
      />
      <SubscriptionCard
        title="Professional"
        price="$89"
        period="per month"
        features={[
          'All Basic features',
          'Advanced analytics',
          'Equipment monitoring',
          'Team collaboration',
          'Priority support',
        ]}
        buttonText="Choose Pro Plan"
        disabled={false}
        selectable={true}
        selected={selectedPlan === 'professional'}
        onSelect={() => setSelectedPlan('professional')}
        showVat={true}
        collapsible={true}
      />
      <SubscriptionCard
        title="Enterprise"
        price="$199"
        period="per month"
        features={[
          'All Professional features',
          'Custom integrations',
          'Dedicated account manager',
          'Advanced reporting',
          'API access',
          'White-label options',
        ]}
        buttonText="Choose Enterprise Plan"
        disabled={false}
        selectable={true}
        selected={selectedPlan === 'enterprise'}
        onSelect={() => setSelectedPlan('enterprise')}
        showVat={true}
        collapsible={true}
      />
    </div>
  );
};

export const SelectableComparison: Story = {
  render: () => <SelectableComparisonComponent />,
  parameters: {
    docs: {
      description: {
        story:
          'Interactive comparison view with selectable cards. Click on any card to select it and see the green border and Radio component change.',
      },
    },
  },
};

export const WithVatDisplay: Story = {
  args: {
    title: 'Professional',
    price: '$89',
    period: 'per month',
    features: [
      'All Basic features',
      'Advanced analytics',
      'Equipment monitoring',
      'Team collaboration',
      'Priority support',
    ],
    buttonText: 'Choose Pro Plan',
    disabled: false,
    showVat: true,
    vatText: '+VAT',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Subscription card with VAT display showing the additional tax information below the price.',
      },
    },
  },
};

export const CollapsibleFeatures: Story = {
  args: {
    title: 'Enterprise',
    price: '$199',
    period: 'per month',
    features: [
      'All Professional features',
      'Custom integrations',
      'Dedicated account manager',
      'Advanced reporting',
      'API access',
      'White-label options',
      'Custom branding',
      'Multi-language support',
    ],
    buttonText: 'Choose Enterprise Plan',
    disabled: false,
    collapsible: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Subscription card with collapsible features. Click the caret icon next to "Features" to expand or collapse the feature list.',
      },
    },
  },
};
