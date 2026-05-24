// app/billing/success/page.tsx

import Stripe from 'stripe';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function BillingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const params = await searchParams;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-12-15.clover',
  });

  const sessionId = params.session_id;

  if (!sessionId) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold">Missing session ID</h1>
        <p>We could not verify your payment.</p>
      </div>
    );
  }

  // Fetch session details from Stripe
  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['customer', 'subscription', 'payment_intent'],
    });
    console.log('Retrieved session:', session);
  } catch (error: any) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold">Error retrieving session</h1>
        <p>There was an error verifying your payment. Please try again.</p>
        <pre>{JSON.stringify(error?.message, null, 2)}</pre>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-4">Payment Successful 🎉</h1>

      <p className="mb-6 text-gray-700">
        Thank you! Your subscription has been processed.
      </p>

      <Link
        href="/dashboard"
        className="mt-6 inline-block px-4 py-2 bg-blue-600 text-white rounded"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
