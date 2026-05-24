'use client';
import React from 'react';
import {
  Button,
  Radio,
  SubscriptionCard,
  SUBSCRIPTION_PLANS,
  subscriptionOptions,
  billingOptions,
} from '@@agrosphere/shared';

interface AddClientStep2Props {
  subscriptionData: {
    addSubscription: boolean;
    billingOption: 'billClient' | 'billMe';
    selectedPlan?: string;
  };
  onSubscriptionDataChange: (data: {
    addSubscription: boolean;
    billingOption: 'billClient' | 'billMe';
    selectedPlan?: string;
  }) => void;
  onNext: () => void;
  onBack: () => void;
  errors?: Record<string, string>;
  canProceed?: boolean;
  onFieldTouch?: (fieldName: string) => void;
  loading?: boolean;
  error?: string | null;
}

export function AddClientStep2({
  subscriptionData,
  onSubscriptionDataChange,
  onNext,
  onBack,
  errors = {},
  canProceed = false,
  onFieldTouch,
  loading = false,
  error = null,
}: AddClientStep2Props) {
  const handleSubscriptionChange = (value: string) => {
    const addSubscription = value === 'yes';
    onSubscriptionDataChange({
      ...subscriptionData,
      addSubscription,
      selectedPlan: addSubscription ? subscriptionData.selectedPlan : undefined,
    });
    if (onFieldTouch) {
      onFieldTouch('addSubscription');
    }
  };

  const handleBillingChange = (value: string) => {
    onSubscriptionDataChange({
      ...subscriptionData,
      billingOption: value as 'billClient' | 'billMe',
    });
    if (onFieldTouch) {
      onFieldTouch('billingOption');
    }
  };

  const handlePlanSelect = (planId: string) => {
    onSubscriptionDataChange({
      ...subscriptionData,
      selectedPlan: planId,
    });
    if (onFieldTouch) {
      onFieldTouch('selectedPlan');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Would you like to add a product subscription for your client?
        </h3>
        <Radio
          name="subscription"
          options={subscriptionOptions}
          value={subscriptionData.addSubscription ? 'yes' : 'no'}
          onChange={handleSubscriptionChange}
          layout="single-column"
        />
      </div>

      {!subscriptionData.addSubscription && (
        <div className="p-4 rounded-lg border border-basic-white">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-sm">info</span>
            <h4 className="font-medium text-basic-black">No subscription?</h4>
          </div>
          <p className="text-sm text-basic-black">
            No problem, we&apos;ll add the client to your client list for now.
            Please note that functionality is limited for clients without an
            active account or subscription.
          </p>
        </div>
      )}

      {subscriptionData.addSubscription && (
        <>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Billing options?
            </h3>
            <Radio
              name="billing"
              options={billingOptions}
              value={subscriptionData.billingOption}
              onChange={handleBillingChange}
              layout="single-column"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Select subscription
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {SUBSCRIPTION_PLANS.map((plan) => (
                <SubscriptionCard
                  key={plan.id}
                  title={plan.title}
                  price={plan.price}
                  period={plan.period}
                  features={plan.features}
                  selectable={true}
                  selected={subscriptionData.selectedPlan === plan.id}
                  onSelect={() => handlePlanSelect(plan.id)}
                  collapsible={true}
                  popular={plan.popular}
                  showVat={plan.showVat}
                  vatText={plan.vatText}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {error && (
        <div className="p-4 rounded-lg border border-red-200 bg-red-50">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-red-500 text-sm">
              error
            </span>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-6">
        <Button variant="cancel" size="md" onClick={onBack}>
          Back
        </Button>
        <Button
          variant="complete"
          size="md"
          onClick={onNext}
          disabled={!canProceed || loading}
          isLoading={loading}
        >
          {loading ? 'Creating client...' : 'Add & Invite client'}
        </Button>
      </div>
    </div>
  );
}
