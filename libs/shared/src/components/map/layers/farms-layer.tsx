'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useMapInstance, useMapLoaded, useMapStyleLoaded } from '../context/map-context';
import { FarmMarker as FarmMarkerComponent } from '../markers/map-farm-marker';
import { FarmPopup, FarmPopupData } from '../popups/farm-popup';
import type { FarmMarker } from '../../../types/map';

interface FarmsLayerProps {
  farms?: FarmMarker[];
  onFarmClick?: (farm: FarmMarker) => void;
  onZoomToFarmRef?: React.MutableRefObject<((farmId: string) => void) | null>;
  visible?: boolean;
}

export const FarmsLayer: React.FC<FarmsLayerProps> = ({
  farms = [],
  onFarmClick,
  onZoomToFarmRef,
  visible = true,
}) => {
  const map = useMapInstance();
  const mapLoaded = useMapLoaded();
  const styleLoaded = useMapStyleLoaded();
  const [isFarmPopupVisible, setIsFarmPopupVisible] = useState(false);
  const [selectedFarmPopup, setSelectedFarmPopup] =
    useState<FarmPopupData | null>(null);

  const handleFarmMarkerClick = useCallback(
    (farm: FarmMarker) => {
      const farmPopupData: FarmPopupData = {
        id: farm.id,
        name: farm.name || farm.title,
        client_name: farm.client_name,
        address: farm.address,
        size: farm.size,
        crop_type: farm.crop_type,
        last_visit: farm.last_visit,
        status: farm.status,
        color: farm.color,
        longitude: farm.longitude,
        latitude: farm.latitude,
      };

      // setSelectedFarmPopup(farmPopupData);
      // setIsFarmPopupVisible(true);

      if (onFarmClick) {
        onFarmClick(farm);
      }
    },
    [onFarmClick]
  );

  const handleFarmPopupClose = useCallback(() => {
    setIsFarmPopupVisible(false);
    setSelectedFarmPopup(null);
  }, []);

  const handleFarmPopupClick = useCallback(
    (farm: FarmPopupData) => {
      if (onFarmClick) {
        const originalFarm = farms.find((f) => f.id === farm.id);
        if (originalFarm) {
          onFarmClick(originalFarm);
        }
      }
    },
    [farms, onFarmClick]
  );

  const handleZoomToFarm = useCallback(
    (farmId: string) => {
      if (!map) return;

      const farm = farms.find((f) => f.id === farmId);
      if (!farm || farm.latitude == null || farm.longitude == null) {
        return;
      }

      map.flyTo({
        center: [farm.longitude, farm.latitude],
        zoom: 14,
        duration: 1500,
        essential: true,
      });
    },
    [map, farms]
  );

  useEffect(() => {
    if (onZoomToFarmRef) {
      onZoomToFarmRef.current = handleZoomToFarm;
    }
  }, [onZoomToFarmRef, handleZoomToFarm]);

  if (!visible || !mapLoaded || !styleLoaded) {
    return null;
  }

  return (
    <>
      {farms
        .filter((farm) => farm.visible !== false)
        .map((farm) => (
          <FarmMarkerComponent
            key={`${farm.id}-${mapLoaded}-${styleLoaded}`}
            map={map}
            feature={farm}
            onMarkerClick={handleFarmMarkerClick}
            mapLoaded={mapLoaded}
            styleLoaded={styleLoaded}
          />
        ))}

      {/* <FarmPopup
        map={map}
        farm={selectedFarmPopup}
        isVisible={isFarmPopupVisible}
        onClose={handleFarmPopupClose}
        onFarmClick={handleFarmPopupClick}
      /> */}
    </>
  );
};

