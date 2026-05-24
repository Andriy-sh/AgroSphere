import { Icon, ParcelPreview } from '@@agrosphere/shared';

type ParcelItem = {
  id: string;
  name: string;
  area: number;
  geometry?: number[][];
};

type EmptyStateProps = {
  parcels: ParcelItem[];
  onSelectParcel: (parcelId: string) => void;
  zoomToParcelRef?: React.MutableRefObject<((parcelId: string) => void) | null>;
};

export default function EmptyState({
  parcels,
  onSelectParcel,
  zoomToParcelRef,
}: EmptyStateProps) {
  return (
    <div className="bg-white rounded-md border border-basic-gray-light h-[calc(100vh-1rem)] p-4 flex flex-col">
      <div className="flex-1 flex flex-col gap-6">
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex flex-col gap-2 text-center">
            <div className="text-sm font-medium text-basic-black">
              Select parcel
            </div>
            <div className="text-xs text-basic-gray">
              Please select a parcel on the map or from the list below to start
              working with nitrogen fertilization
            </div>
          </div>

          {parcels.length > 0 && (
            <div className="flex-1 overflow-y-auto">
              <div className="flex flex-col gap-2">
                {parcels.map((parcel) => (
                  <button
                    key={parcel.id}
                    type="button"
                    onClick={() => {
                      onSelectParcel(parcel.id);
                      if (zoomToParcelRef?.current) {
                        setTimeout(() => {
                          zoomToParcelRef.current?.(parcel.id);
                        }, 150);
                      }
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border border-basic-gray-light hover:bg-basic-gray-light/50 transition-colors text-left"
                  >
                    <div className="flex-shrink-0">
                      {parcel.geometry ? (
                        <ParcelPreview geometry={parcel.geometry} />
                      ) : (
                        <div className="w-11 h-11 rounded-md bg-basic-gray-light flex items-center justify-center">
                          <Icon icon="map" className="text-basic-gray" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-basic-black truncate">
                        {parcel.name}
                      </div>
                      <div className="text-xs text-basic-gray">
                        {parcel.area.toFixed(2)} ha
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
