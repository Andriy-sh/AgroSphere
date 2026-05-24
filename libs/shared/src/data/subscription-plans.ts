export interface SubscriptionPlan {
  id: string;
  title: string;
  price: string;
  period: string;
  features: string[];
  showVat?: boolean;
  vatText?: string;
  popular?: boolean;
  recommended?: boolean;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'basic',
    title: 'Basic',
    price: '$29',
    period: 'per month',
    features: [
      'Mapping up to 5 farms',
      'Creating and managing tasks',
      'Receiving analysis results',
      'Export to PDF',
    ],
    showVat: true,
    vatText: '+VAT',
  },
  {
    id: 'pro',
    title: 'Pro',
    price: '$69',
    period: 'per month',
    popular: true,
    features: [
      'All features from the Basic plan',
      'Unlimited number of farms',
      'Team collaboration (up to 5 users)',
      'Integration with laboratories',
      'History of analysis results',
    ],
  },
  {
    id: 'enterprise',
    title: 'Enterprise',
    price: '$119',
    period: 'per month',
    features: [
      'Everything from the Pro plan',
      'Advanced analytics',
      'Support for a large number of users',
      'Priority support',
    ],
  },
];

export const getSubscriptionPlan = (
  id: string
): SubscriptionPlan | undefined => {
  return SUBSCRIPTION_PLANS.find((plan) => plan.id === id);
};

export const getDefaultSubscriptionPlan = (): SubscriptionPlan => {
  return SUBSCRIPTION_PLANS[0]; 
};

export const subscriptionOptions = [
  { value: 'yes', label: 'Yes, add a subscription' },
  { value: 'no', label: 'No, no subscription needed' },
];

export const billingOptions = [
  { value: 'billClient', label: 'Bill client' },
  { value: 'billMe', label: 'Bill me, if client has no active subscription' },
];
