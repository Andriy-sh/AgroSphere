'use client';

import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Button } from '../button/button';

interface GeolocationButtonProps {
  map: mapboxgl.Map | null;
  onGeolocate?: (coords: { latitude: number; longitude: number }) => void;
  className?: string;
}

export const GeolocationButton: React.FC<GeolocationButtonProps> = ({
  map,
  onGeolocate,
  className = '',
}) => {
  const geolocateControlRef = useRef<mapboxgl.GeolocateControl | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!map) return;

    const geolocateControl = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
      showUserHeading: true,
    });

    geolocateControlRef.current = geolocateControl;

    geolocateControl.on('geolocate', (e) => {
      if (onGeolocate) {
        onGeolocate({
          latitude: e.coords.latitude,
          longitude: e.coords.longitude,
        });
      }
    });

    geolocateControl.on('error', (e) => {
      console.warn('GeolocationButton: error event:', e);
    });



    const checkMapReady = () => {
      if (map.isStyleLoaded() && map.loaded()) {

        setIsReady(true);
      } else {
        setTimeout(checkMapReady, 100);
      }
    };

    if (map.loaded() && map.isStyleLoaded()) {
      setIsReady(true);
    } else {
      map.on('load', () => {
        checkMapReady();
      });
      map.on('styledata', () => {
        checkMapReady();
      });
    }

    return () => {
      if (geolocateControlRef.current) {
        geolocateControlRef.current = null;
      }
      setIsReady(false);
    };
  }, [map, onGeolocate]);

  const handleClick = () => {


    if (!isReady) {
      console.warn(
        'GeolocationButton: Map not ready yet, cannot trigger geolocation'
      );
      return;
    }

    if (geolocateControlRef.current) {
      const didTrigger = geolocateControlRef.current.trigger();

      if (!didTrigger) {
        return;
      }
    } else {
      return
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className={`bg-white/90 backdrop-blur-sm shadow-md hover:bg-white h-9 w-9 border border-gray-200 ${className}`}
      onClick={handleClick}
      disabled={!isReady}
      title={isReady ? 'Get my location' : 'Loading...'}
    >
      <span className="material-symbols-outlined text-lg text-basic-black">
        location_searching
      </span>
    </Button>
  );
};

export default GeolocationButton;
