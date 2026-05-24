import {
  CurrentSubscriptionCard,
  PaymentHistory,
  mockPaymentHistory,
  type ClientData,
} from '@@agrosphere/shared';
import React from 'react';
import Script from 'next/script';

interface SubscriptionsProps {
  client?: ClientData;
}

export default function Subscriptions({ client }: SubscriptionsProps) {
  if (!client) {
    return (
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden m-1.5 text-sm">
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-500">No client data available</div>
        </div>
      </div>
    );
  }

  const hasSubscription = !!client?.subscription;
  const currentSubscription = client?.subscription;

  const displayData = (value: string | undefined | null, fallback = '---') => {
    return value && value.trim() !== '' ? value : fallback;
  };

  return (
    <>
      <Script
        src="https://js.stripe.com/v3/pricing-table.js"
        strategy="lazyOnload"
      />
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden m-1.5 text-sm">
        <div className="flex-1 min-h-0 grid grid-cols-[2fr_1fr] gap-2 items-start overflow-hidden p-1">
          <div className="flex flex-col min-h-0 h-full gap-2">
            {hasSubscription && currentSubscription && (
              <div className="h-1/4 min-h-0 overflow-hidden">
                <CurrentSubscriptionCard
                  plan={displayData(currentSubscription?.planName)}
                  price={displayData(currentSubscription?.price)}
                  period={displayData(currentSubscription?.period)}
                  startDate={displayData(currentSubscription?.startDate)}
                  cancelDisabled={!currentSubscription?.canCancel}
                  onCancel={() => {
                    return;
                  }}
                />
              </div>
            )}

            <div
              className={`${
                hasSubscription ? 'h-3/4' : 'h-full'
              } min-h-0 overflow-hidden`}
            >
              <div className="bg-white rounded-2xl shadow p-4 flex flex-col gap-4 h-full border border-basic-white">
                <div className="text-xl font-semibold mb-2">
                  Available subscription
                </div>
                {React.createElement('stripe-pricing-table', {
                  'pricing-table-id': 'prctbl_1S6ShQEIel784l8QsgVwa6sL',
                  'publishable-key':
                    'pk_live_nR0YZxlQJN13du4iJyQt3G0K00EOmykW5s',
                })}
                {/* <div className="grid grid-cols-3 gap-4 flex-1">
                  {SUBSCRIPTION_PLANS?.map((plan) => (
                    <div key={plan?.id} className="relative h-full">
                      <SubscriptionCard
                        title={displayData(plan?.title)}
                        price={displayData(plan?.price)}
                        period={displayData(plan?.period)}
                        features={
                          plan?.features?.map((feature) =>
                            displayData(feature)
                          ) ?? []
                        }
                        buttonText={
                          hasSubscription &&
                          currentSubscription?.planId === plan?.id
                            ? 'Current plan'
                            : 'Select plan'
                        }
                        disabled={
                          hasSubscription &&
                          currentSubscription?.planId === plan?.id
                        }
                        onButtonClick={() => {
                          if (
                            !hasSubscription ||
                            currentSubscription?.planId !== plan?.id
                          ) {
                            return;
                          }
                        }}
                      />
                      {plan?.popular && (
                        <div className="absolute top-4 right-4 bg-green-100 text-green-600 text-xs font-semibold px-3 py-1 rounded-xl shadow-sm">
                          Best value
                        </div>
                      )}
                    </div>
                  )) ?? []}
                </div> */}
              </div>
            </div>
          </div>
          <div className="flex flex-col min-h-0 h-full border border-basic-white rounded-2xl overflow-hidden">
            <PaymentHistory history={mockPaymentHistory} />
          </div>
        </div>
      </div>
    </>
  );
}
