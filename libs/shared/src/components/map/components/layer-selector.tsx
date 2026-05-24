'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Toggle } from '../../toggle/toggle';

interface LayerVisibility {
  farmLocations?: boolean;
  farmParcels?: boolean;
  farmZones?: boolean;
  showTasks?: boolean;
  showParcels?: boolean;
  parcelZoneMode?: 'parcels' | 'zones';
}

interface LayerOption {
  key: string;
  label: string;
  visible?: boolean;
}

interface LayerSelectorProps {
  layerVisibility: LayerVisibility;
  onLayerVisibilityChange: (layer: string, visible: boolean) => void;
  visibleLayers?: {
    showTasks?: boolean;
    farmLocations?: boolean;
    farmParcels?: boolean;
    farmZones?: boolean;
  };
}

export const LayerSelector: React.FC<LayerSelectorProps> = ({
  layerVisibility,
  onLayerVisibilityChange,
  visibleLayers = {
    showTasks: true,
    farmLocations: true,
    farmParcels: true,
    farmZones: true,
  },
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const layers: LayerOption[] = [
    {
      key: 'showTasks',
      label: 'Show tasks',
      visible: visibleLayers.showTasks,
    },
    {
      key: 'farmLocations',
      label: 'Show farm locations',
      visible: visibleLayers.farmLocations,
    },
    {
      key: 'farmParcels',
      label: 'Show farm parcels',
      visible: visibleLayers.farmParcels,
    },
    {
      key: 'farmZones',
      label: 'Show farm zones',
      visible: visibleLayers.farmZones,
    },
  ];

  const renderToggle = (layer: LayerOption) => {
    if (layer.key === 'farmParcels') {
      return (
        <Toggle
          checked={layerVisibility.parcelZoneMode === 'parcels'}
          onCheckedChange={(checked) => {
            if (checked) {
              onLayerVisibilityChange('parcelZoneMode:parcels', true);
            }
          }}
          size="sm"
        />
      );
    }

    if (layer.key === 'farmZones') {
      return (
        <Toggle
          checked={layerVisibility.parcelZoneMode === 'zones'}
          onCheckedChange={(checked) => {
            if (checked) {
              onLayerVisibilityChange('parcelZoneMode:zones', true);
            }
          }}
          size="sm"
        />
      );
    }

    const value = layerVisibility[layer.key as keyof LayerVisibility];
    const isChecked = typeof value === 'boolean' ? value : false;

    return (
      <Toggle
        checked={isChecked}
        onCheckedChange={(checked) =>
          onLayerVisibilityChange(layer.key, checked)
        }
        size="sm"
      />
    );
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/90 backdrop-blur-sm shadow-md hover:bg-white h-9 px-3 border border-gray-200 rounded-lg flex items-center gap-2 transition-colors"
      >
        <span className="material-symbols-outlined text-lg text-basic-black">
          layers
        </span>
        <span className="text-sm font-medium text-basic-black">Map layer</span>
        <span className="material-symbols-outlined text-base ml-10 text-basic-gray">
          expand_all
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-3 min-w-[200px] z-20">
          <div className="space-y-3">
            <div className="space-y-2">
              {layers
                .filter((layer) => layer.visible !== false)
                .map((layer) => (
                  <div
                    key={layer.key}
                    className="flex items-center justify-between"
                  >
                    {renderToggle(layer)}
                    <span className="text-sm text-basic-black">
                      {layer.label}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
