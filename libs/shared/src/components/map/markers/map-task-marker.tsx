'use client';
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { createPortal } from 'react-dom';
import { StatusIndicator } from '../../status-indicator/status-indicator';
import { getStatusColor } from '../../../utils/status-utils';

interface MarkerProps {
  map: mapboxgl.Map | null;
  feature: {
    id: string;
    longitude: number;
    latitude: number;
    title: string;
    status: string;
    color?: string;
    type?: 'task' | 'farm';
  };
  onMarkerClick?: (marker: any) => void;
}

const Marker = ({ map, feature, onMarkerClick }: MarkerProps) => {
  const { longitude, latitude, status, title } = feature;
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  if (!contentRef.current) {
    contentRef.current = document.createElement('div');
  }

  useEffect(() => {
    const createMarker = () => {
      if (!map || !map.isStyleLoaded()) {
        return;
      }

      markerRef.current = new mapboxgl.Marker({
        element: contentRef.current!,
        anchor: 'bottom',
      })
        .setLngLat([longitude, latitude])
        .addTo(map);
    };

    if (map && map.isStyleLoaded()) {
      createMarker();
    } else if (map) {
      const handleStyleReady = () => {
        if (map.isStyleLoaded()) {
          createMarker();
        }
      };

      map.once('styledata', handleStyleReady);
      map.once('load', handleStyleReady);
    }

    const handleMapMove = () => {
      if (markerRef.current) {
        markerRef.current.setLngLat([longitude, latitude]);
      }
    };

    if (map) {
      map.on('move', handleMapMove);
      map.on('zoom', handleMapMove);
      map.on('resize', handleMapMove);
    }

    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
      }
      if (map) {
        map.off('move', handleMapMove);
        map.off('zoom', handleMapMove);
        map.off('resize', handleMapMove);
      }
    };
  }, [map, longitude, latitude]);

  const colors = feature.color
    ? { backgroundColor: feature.color, borderColor: '#fff' }
    : getStatusColor(status, { includeBorder: true });

  return (
    <>
      {createPortal(
        <div
          onClick={() => {
            if (onMarkerClick) {
              onMarkerClick(feature);
            } else {
              alert(`${title} - ${status}`);
            }
          }}
          className="relative cursor-pointer flex flex-col items-center"
        >
          <div className="relative">
            <div
              className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center shadow-lg"
              style={{
                backgroundColor: colors.backgroundColor,
              }}
            >
              <StatusIndicator
                status={status as any}
                showTooltip={false}
                iconClassName="text-white text-lg"
              />
            </div>

            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-white" />
          </div>

          <div
            className={`w-2 h-2 rounded-full mt-2 shadow-sm border-2 bg-white`}
            style={{
              borderColor: colors.backgroundColor,
            }}
          />
        </div>,
        contentRef.current
      )}
    </>
  );
};

export { Marker };
