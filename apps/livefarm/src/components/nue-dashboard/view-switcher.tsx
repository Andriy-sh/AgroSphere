'use client';

export type ViewMode = 'enhanced-dashboard' | 'dual-view' | 'farm-map';

interface ViewOptionProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function ViewOption({ label, isActive, onClick }: ViewOptionProps) {
  return (
    <button
      onClick={onClick}
      aria-label={`Switch to ${label} view`}
      aria-selected={isActive}
      role="tab"
      className={`px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg bg-white border border-basic-gray-light
        ${
          isActive
            ? 'text-basic-black'
            : 'text-basic-gray hover:text-basic-black'
        }
      `}
    >
      {label}
    </button>
  );
}

interface ViewSwitcherProps {
  activeView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onCalculatorOpen?: () => void;
}

interface ViewItem {
  id: ViewMode;
  label: string;
}

const views: ViewItem[] = [
  { id: 'enhanced-dashboard', label: 'Enhanced Dashboard' },
  { id: 'dual-view', label: 'Dual View' },
  { id: 'farm-map', label: 'Farm Map' },
];

export function ViewSwitcher({
  activeView,
  onViewChange,
  onCalculatorOpen,
}: ViewSwitcherProps) {
  return (
    <div
      className="sticky top-0 z-[60] flex items-center justify-between gap-1 pt-5 px-5 bg-white border-b border-basic-gray-light pb-4"
      role="tablist"
      aria-label="NUE Dashboard view switcher"
    >
      <div className="flex items-center justify-center gap-1">
        {views.map((view) => (
          <ViewOption
            key={view.id}
            label={view.label}
            isActive={activeView === view.id}
            onClick={() => onViewChange(view.id)}
          />
        ))}
      </div>
      {onCalculatorOpen && (
        <button
          onClick={onCalculatorOpen}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 text-sm font-medium"
          aria-label="Open What-If Calculator"
        >
          <span className="material-symbols-outlined text-white">
            calculate
          </span>
          <span>What-if Calculator</span>
        </button>
      )}
    </div>
  );
}

