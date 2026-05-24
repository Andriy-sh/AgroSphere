import { Suspense } from 'react';
import { CreateParcelZones } from "@/components/create-parcel-zones/create-parcel-zones";

export default function CreateParcelZonePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateParcelZones />
    </Suspense>
  );
}