'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import {
  Map,
  FarmsLayer,
  ParcelsLayer,
  useMapInstance,
  useMapLoaded,
  useMapStyleLoaded,
  zoomToFarmBbox,
} from '@@agrosphere/shared';
import type { FarmMarker, MapParcel } from '@@agrosphere/shared';
import mapboxgl from 'mapbox-gl';
import { getNueMapParcelsByPeriod } from './data/nue-parcels-map-data';
import { allParcelsData } from './data/all-tabs-mock-data';
import type { TimePeriod } from './dashboard-tabs';
import { NueMapLegend } from './nue-map-legend';

interface NUEDashboardMapProps {
  farms?: FarmMarker[];
  onParcelClick?: (parcel: MapParcel) => void;
  timePeriod?: TimePeriod;
  customStartDate?: string;
  customEndDate?: string;
  showNueColors?: boolean;
}

const calculateFarmCenter = (
  parcels: (MapParcel & { nue: number })[]
): { longitude: number; latitude: number } => {
  if (parcels.length === 0) {
    return { longitude: -6.7893373321256805, latitude: 52.803046419691846 };
  }

  let totalLng = 0;
  let totalLat = 0;
  let count = 0;

  parcels.forEach((parcel) => {
    if (parcel.coordinates && parcel.coordinates.length > 0) {
      parcel.coordinates.forEach((polygon) => {
        polygon.forEach((ring) => {
          ring.forEach((coord) => {
            totalLng += coord[0];
            totalLat += coord[1];
            count++;
          });
        });
      });
    }
  });

  return {
    longitude: count > 0 ? totalLng / count : -6.7893373321256805,
    latitude: count > 0 ? totalLat / count : 52.803046419691846,
  };
};

export function NUEDashboardMap({
  farms = [],
  onParcelClick,
  timePeriod = 'year-to-date',
  customStartDate,
  customEndDate,
  showNueColors = true,
}: NUEDashboardMapProps) {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [farmLocationsVisible, setFarmLocationsVisible] = useState(true);

  const parcels = useMemo(() => {
    return getNueMapParcelsByPeriod(timePeriod, customStartDate, customEndDate);
  }, [timePeriod, customStartDate, customEndDate]);

  const mapFarms = useMemo(() => {
    if (farms.length > 0) {
      return farms;
    }
    const farm1Parcels = allParcelsData.filter((p) => p.id.startsWith('1'));
    const farm2Parcels = allParcelsData.filter((p) => p.id.startsWith('2'));

    const farm1MapParcels = farm1Parcels.map((p) => ({
      id: p.id,
      name: p.name,
      area: p.area,
      coordinates: [[p.geometry.map((coord) => [coord[0], coord[1]])]],
      nue: p.nue,
      visible: true,
    })) as (MapParcel & { nue: number })[];

    const farm2MapParcels = farm2Parcels.map((p) => ({
      id: p.id,
      name: p.name,
      area: p.area,
      coordinates: [[p.geometry.map((coord) => [coord[0], coord[1]])]],
      nue: p.nue,
      visible: true,
    })) as (MapParcel & { nue: number })[];

    const farm1Center = calculateFarmCenter(farm1MapParcels);
    const farm2Center = calculateFarmCenter(farm2MapParcels);

    return [
      {
        id: '1',
        longitude: farm1Center.longitude,
        latitude: farm1Center.latitude,
        title: 'Farm 1',
        status: 'active',
        type: 'farm' as const,
        name: 'Farm 1',
        visible: true,
      },
      {
        id: '2',
        longitude: farm2Center.longitude,
        latitude: farm2Center.latitude,
        title: 'Farm 2',
        status: 'active',
        type: 'farm' as const,
        name: 'Farm 2',
        visible: true,
      },
    ];
  }, [farms]);

  const handleLayerVisibilityChange = (layer: string, visible: boolean) => {
    if (layer === 'farmLocations') {
      setFarmLocationsVisible(visible);
    }
  };

  const ParcelsZoomHandler = ({
    parcels,
  }: {
    parcels: (MapParcel & { nue: number })[];
  }) => {
    const map = useMapInstance();
    const mapLoaded = useMapLoaded();
    const styleLoaded = useMapStyleLoaded();

    useEffect(() => {
      if (
        !mapRef.current ||
        !map ||
        !mapLoaded ||
        !styleLoaded ||
        parcels.length === 0
      ) {
        return;
      }

      const parcelsWithCoordinates = parcels.filter(
        (parcel) => parcel.coordinates && parcel.coordinates.length > 0
      );

      if (parcelsWithCoordinates.length === 0) {
        return;
      }

      const farmCenter = calculateFarmCenter(parcels);
      
      zoomToFarmBbox(
        mapRef,
        parcelsWithCoordinates.map((p) => ({ coordinates: p.coordinates })),
        farmCenter,
        {
          padding: 60,
          duration: 800,
          essential: true,
        }
      );
    }, [map, mapLoaded, styleLoaded, parcels]);

    return null;
  };

  return (
    <div className="w-full h-full rounded-xl overflow-hidden bg-white relative">
      <Map
        ref={mapRef}
        accessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        initialCenter={[-6.7893373321256805, 52.803046419691846]}
        initialZoom={12}
        maxZoom={18}
        minZoom={6}
        showMapboxControls={false}
        showLayerSelector={true}
        layerVisibility={{
          farmLocations: farmLocationsVisible,
          farmParcels: true,
          farmZones: false,
          showTasks: false,
        }}
        parcelZoneMode="parcels"
        onLayerVisibilityChange={handleLayerVisibilityChange}
        className="w-full h-full"
      >
        <FarmsLayer farms={mapFarms} visible={farmLocationsVisible} />
        <ParcelsLayer
          parcels={parcels}
          visible={true}
          showNueColors={showNueColors}
          onParcelClick={onParcelClick}
        />
        <ParcelsZoomHandler parcels={parcels} />
      </Map>
      <NueMapLegend show={true} position="left" />
    </div>
  );
}
