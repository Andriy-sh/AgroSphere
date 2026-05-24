'use client';
import React from 'react';
import { Button, type ClientFormData } from '@@agrosphere/shared';

interface AddClientStep3Props {
  clientData: ClientFormData;
  subscriptionData: {
    addSubscription: boolean;
    billingOption: 'billClient' | 'billMe';
    selectedPlan?: string;
  };
  onBack: () => void;
  onAddClient: () => void;
}

const subscriptionPlans = {
  basic: { name: 'Basic', price: '$29' },
  premium: { name: 'Premium', price: '$59' },
  enterprise: { name: 'Enterprise', price: '$99' },
};

export function AddClientStep3({
  clientData,
  subscriptionData,
  onBack,
  onAddClient,
}: AddClientStep3Props) {
  const getSelectedPlanName = () => {
    if (
      subscriptionData.selectedPlan &&
      subscriptionPlans[
        subscriptionData.selectedPlan as keyof typeof subscriptionPlans
      ]
    ) {
      return subscriptionPlans[
        subscriptionData.selectedPlan as keyof typeof subscriptionPlans
      ];
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {!subscriptionData.addSubscription && (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-gray-600 text-lg mt-0.5">
              info
            </span>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Client will be added without a subscription!
              </h4>
              <p className="text-sm text-gray-600">
                This client will appear in your client list. You&apos;ll be able
                to manage their details or assign a subscription later.
              </p>
            </div>
          </div>
        </div>
      )}

      {subscriptionData.addSubscription &&
        subscriptionData.billingOption === 'billClient' && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-blue-600 text-lg mt-0.5">
                info
              </span>
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">
                  Client will handle their own subscription
                </h4>
                <p className="text-sm text-blue-700">
                  The client will be responsible for selecting and paying for
                  their subscription directly. You won&apos;t be charged for
                  this subscription.
                </p>
              </div>
            </div>
          </div>
        )}

      {subscriptionData.addSubscription &&
        subscriptionData.billingOption === 'billMe' && (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-green-600 text-lg mt-0.5">
                check_circle
              </span>
              <div>
                <h4 className="font-semibold text-green-900 mb-2">
                  Subscription will be added successfully!
                </h4>
                <p className="text-sm text-green-700">
                  You will be billed for the {getSelectedPlanName()?.name} plan
                  at {getSelectedPlanName()?.price}/month. The client will have
                  full access to all features included in their subscription.
                </p>
              </div>
            </div>
          </div>
        )}

      {subscriptionData.addSubscription &&
        subscriptionData.billingOption === 'billMe' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Subscription Details
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Plan:
                  </span>
                  <p className="text-gray-900">
                    {getSelectedPlanName()?.name} -{' '}
                    {getSelectedPlanName()?.price}
                    /month
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Billing:
                  </span>
                  <p className="text-gray-900">Bill me</p>
                </div>
              </div>
            </div>
          </div>
        )}

      <div className="flex items-center justify-between pt-6">
        <Button variant="cancel" size="md" onClick={onBack}>
          Back
        </Button>
        <Button variant="complete" size="md" onClick={onAddClient}>
          Add client
        </Button>
      </div>
    </div>
  );
}
