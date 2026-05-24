'use client';

interface MapToggleButtonProps {
  mapSize: number;
  showFilters: boolean;
  onMapSizeChange: (size: number) => void;
}

export function MapToggleButton({
  mapSize,
  showFilters,
  onMapSizeChange,
}: MapToggleButtonProps) {
  if (mapSize !== 0) {
    return null;
  }

  return (
    <div
      onClick={() => onMapSizeChange(showFilters ? 30 : 40)}
      className="fixed top-1/2 -translate-y-8 -right-1 z-50 cursor-pointer group"
      title="Open map"
    >
      <div className="w-6 h-12 bg-white border border-basic-gray-light rounded-l-lg flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:bg-gray-100 group-hover:border-gray-400">
        <span className="material-symbols-outlined text-basic-black text-xl group-hover:text-black transition-colors font-bold">
          arrow_left
        </span>
      </div>
    </div>
  );
}
