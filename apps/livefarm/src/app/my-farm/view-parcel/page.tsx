import { Suspense } from 'react';
import { ViewParcel } from '@/components/view-parcel/view-parcel';

export default function ViewParcelPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ViewParcel />
    </Suspense>
  );
}
