'use client';
import React, { useState } from 'react';
import {
  Dialog,
  Radio,
  Button,
  SubscriptionCard,
  SUBSCRIPTION_PLANS,
} from '@@agrosphere/shared';
import {
  ClientsProductDialogProps,
  BillingOption,
} from './clients-product-dialog.types';

export function ClientsProductDialog({
  isOpen,
  onClose,
  clientId,
  onProductAdded,
}: ClientsProductDialogProps) {
  const [billingOption, setBillingOption] = useState('bill-me');
  const [selectedSubscription, setSelectedSubscription] = useState('basic');

  const billingOptions: BillingOption[] = [
    {
      value: 'bill-client',
      label: 'Bill client',
    },
    {
      value: 'bill-me',
      label: 'Bill me, if client has no active subscription',
    },
  ];

  const handleAddProduct = () => {
    if (clientId && onProductAdded) {
      const selectedPlan = SUBSCRIPTION_PLANS.find(plan => plan.id === selectedSubscription);
      if (selectedPlan) {
        onProductAdded(clientId, selectedPlan.title);
      }
    }
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2 mb-5">
          <span className="material-symbols-outlined text-basic-green text-xl">
            credit_card_clock
          </span>
          <span className="text-lg font-semibold text-basic-black ">
            Add products
          </span>
        </div>
      }
      className="max-w-2xl"
    >
      <div className="space-y-6">
        <div>
          <Radio
            name="billing-options"
            options={billingOptions}
            value={billingOption}
            onChange={setBillingOption}
            label="Billing options?"
            className="mb-4"
          />

          <div className="border-basic-white border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-basic-black text-lg">
                info
              </span>
              <span className="text-sm font-semibold text-basic-black">
                Note!
              </span>
            </div>
            <p className="text-sm text-basic-black">
              If client already has an active subscription you will not be
              billed.
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-basic-black mb-4">
            Select subscription
          </h3>

          <div className="flex flex-col gap-4 max-h-96 overflow-y-auto">
            {SUBSCRIPTION_PLANS.map((plan) => (
              <SubscriptionCard
                key={plan.id}
                title={plan.title}
                price={plan.price}
                period={plan.period}
                features={plan.features}
                buttonText=""
                selectable={true}
                selected={selectedSubscription === plan.id}
                onSelect={() => setSelectedSubscription(plan.id)}
                showVat={true}
                vatText="+VAT"
                collapsible={true}
                disabled={false}
                popular={plan.popular}
                recommended={plan.recommended}
              />
            ))}
          </div>
        </div>

        <div className="pt-4">
          <Button
            variant="complete"
            size="md"
            className="w-full"
            onClick={handleAddProduct}
          >
            Add subscription
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
