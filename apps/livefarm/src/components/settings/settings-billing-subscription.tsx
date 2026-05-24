'use client';

import React from 'react';
import { Button, SettingsTabHeader, useUsers } from '@@agrosphere/shared';
import { useSubscriptions, useCustomerSecret } from '@@agrosphere/shared/hooks';
import Script from 'next/script';

import { getTenant } from '@/utils/tenant-sync';

interface BillingSubscriptionProps {
  onManageSubscription?: () => void;
}

export function BillingSubscription({
  onManageSubscription,
}: BillingSubscriptionProps) {
  const { subscriptions, loading, fetchSubscriptions } = useSubscriptions();
  const {
    customerSecret,
    loading: secretLoading,
    createCustomerSecret,
  } = useCustomerSecret();

  const handleManageSubscription = () => {
    if (onManageSubscription) {
      onManageSubscription();
    } else {
      return;
    }
  };

  // Fetch subscriptions on component mount
  React.useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  React.useEffect(() => {
    createCustomerSecret();
  }, [createCustomerSecret]);

  const PRICING_TABLE_ID = process.env.NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID;
  const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  return (
    <div className="space-y-6">
      <SettingsTabHeader icon="credit_card" title="Billing & Subscription" />
      {loading ? (
        'Loading...'
      ) : (
        <div className="bg-white border border-basic-white rounded-xl p-5 ">
          {subscriptions.length ? (
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-base font-semibold text-basic-black mb-1">
                  Manage your subscription and billing
                </h2>
                <p className="text-sm text-basic-gray">
                  You can update your plan, change payment method, view
                  invoices, or cancel your subscription.
                </p>
              </div>
              <div className="ml-4">
                <Button
                  variant="complete"
                  size="md"
                  onClick={handleManageSubscription}
                  className="bg-basic-green hover:bg-basic-green/90 px-4 rounded-lg h-9 text-white"
                >
                  Manage via Stripe
                </Button>
              </div>
            </div>
          ) : (
            PRICING_TABLE_ID &&
            PUBLISHABLE_KEY && (
              <>
                <Script
                  src="https://js.stripe.com/v3/pricing-table.js"
                  strategy="lazyOnload"
                />
                <div className="bg-white rounded-2xl shadow p-4 flex flex-col gap-4 h-full border border-basic-white">
                  <div className="text-xl font-semibold mb-2">
                    Available subscription
                  </div>
                  {!secretLoading &&
                    React.createElement('stripe-pricing-table', {
                      'pricing-table-id': PRICING_TABLE_ID,
                      'publishable-key': PUBLISHABLE_KEY,
                      'customer-session-client-secret': customerSecret || '',
                    })}
                </div>
              </>
            )
          )}
        </div>
      )}
    </div>
  );
}
