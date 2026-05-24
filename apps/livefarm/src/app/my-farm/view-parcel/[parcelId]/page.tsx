import { ViewParcel } from '@/components/view-parcel/view-parcel';

export default async function ViewParcelPage({
  params,
}: {
  params: Promise<{ parcelId: string }>;
}) {
  const { parcelId } = await params;
  return <ViewParcel parcelId={parcelId} />;
}
