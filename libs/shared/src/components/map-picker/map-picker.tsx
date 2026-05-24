'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '../button/button';
import { X, MapPin } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import { Map } from '../map/map';

const createCustomIcon = (color = '#29B54C') => {
  const svgString = `
<svg width="32" height="52" viewBox="0 0 32 52" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M16 0C24.8366 0 32 7.16344 32 16C32 24.3226 25.6456 31.1611 17.5238 31.9284V48.7619C17.5238 49.6035 16.8416 50.2857 16 50.2857C15.1584 50.2857 14.4762 49.6035 14.4762 48.7619V31.9284C6.35439 31.1611 0 24.3226 0 16C0 7.16344 7.16344 0 16 0Z" fill="#29B54C"/>
<path d="M21.3337 16.0003C21.3337 13.0548 18.9458 10.667 16.0003 10.667C13.0548 10.667 10.667 13.0548 10.667 16.0003C10.667 18.9458 13.0548 21.3337 16.0003 21.3337C18.9458 21.3337 21.3337 18.9458 21.3337 16.0003Z" fill="white"/>
<path opacity="0.3" d="M16.0019 51.8095C18.1058 51.8095 19.8114 50.9567 19.8114 49.9048C19.8114 48.8528 18.1058 48 16.0019 48C13.898 48 12.1924 48.8528 12.1924 49.9048C12.1924 50.9567 13.898 51.8095 16.0019 51.8095Z" fill="#29B54C"/>
</svg>
  `;

  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  return URL.createObjectURL(blob);
};

const createMarkerElement = (iconUrl: string) => {
  const element = document.createElement('div');
  element.style.width = '40px';
  element.style.height = '40px';
  element.style.backgroundImage = `url(${iconUrl})`;
  element.style.backgroundSize = 'contain';
  element.style.backgroundRepeat = 'no-repeat';
  element.style.backgroundPosition = 'center';
  element.style.cursor = 'pointer';
  element.style.pointerEvents = 'auto';
  return element;
};

interface MapPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onAddressSelect: (
    address: string,
    coordinates: { lat: number; lng: number }
  ) => void;
  initialAddress?: string;
  initialSearchValue?: string;
}

interface SearchResult {
  place_name: string;
  center: [number, number];
  bbox?: [number, number, number, number];
  context?: Array<{
    id: string;
    text: string;
  }>;
}

export function MapPicker({
  isOpen,
  onClose,
  onAddressSelect,
  initialAddress,
  initialSearchValue,
}: MapPickerProps) {
  const [selectedCoordinates, setSelectedCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeolocating, setIsGeolocating] = useState(false);
  const [initialCenter, setInitialCenter] = useState<[number, number]>([0, 0]);
  const [hasUserLocation, setHasUserLocation] = useState(false);
  const [userCoordinates, setUserCoordinates] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [searchValue, setSearchValue] = useState<string>(
    initialSearchValue || initialAddress || ''
  );
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [currentIconUrl, setCurrentIconUrl] = useState<string | null>(null);

  const getUserLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      return;
    }

    setIsGeolocating(true);

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000,
          });
        }
      );

      const { latitude, longitude } = position.coords;

      setInitialCenter([longitude, latitude]);
      setUserCoordinates({ latitude, longitude });
      setHasUserLocation(true);
    } catch (error) {
      onClose();
    } finally {
      setIsGeolocating(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      getUserLocation();
    }
  }, [isOpen, getUserLocation]);

  useEffect(() => {
    if (initialSearchValue || initialAddress) {
      setSearchValue(initialSearchValue || initialAddress || '');
    }
    return undefined;
  }, [initialSearchValue, initialAddress]);

  const handleMapClick = useCallback(
    async (coords: { latitude: number; longitude: number }) => {
      setSelectedCoordinates({ lat: coords.latitude, lng: coords.longitude });

      if (markerRef.current) {
        markerRef.current.remove();
      }

      if (currentIconUrl) {
        URL.revokeObjectURL(currentIconUrl);
      }

      if (mapRef.current) {
        const iconUrl = createCustomIcon();

        const marker = new mapboxgl.Marker({
          element: createMarkerElement(iconUrl),
          scale: 1.2,
          anchor: 'bottom',
        })
          .setLngLat([coords.longitude, coords.latitude])
          .addTo(mapRef.current);

        markerRef.current = marker;
        setCurrentIconUrl(iconUrl);
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${coords.longitude},${coords.latitude}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}&types=address,poi`
        );
        const data = await response.json();

        if (data.features && data.features.length > 0) {
          const address = data.features[0].place_name;
          setSelectedAddress(address);
          setSearchValue(address);
        } else {
          setSelectedAddress('Unknown location');
          setSearchValue('Unknown location');
        }
      } catch (error) {
        setSelectedAddress('Error getting address');
        setSearchValue('Error getting address');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (hasUserLocation && userCoordinates && mapRef.current) {
      const timer = setTimeout(() => {
        handleMapClick(userCoordinates);

        if (mapRef.current) {
          mapRef.current.flyTo({
            center: [userCoordinates.longitude, userCoordinates.latitude],
            zoom: 16,
            duration: 2000,
          });
        }
      }, 500);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [hasUserLocation, userCoordinates, handleMapClick]);

  const handleApply = () => {
    if (selectedCoordinates && selectedAddress) {
      onAddressSelect(selectedAddress, selectedCoordinates);
      onClose();
    }
  };

  useEffect(() => {
    return () => {
      if (currentIconUrl) {
        URL.revokeObjectURL(currentIconUrl);
      }
    };
  }, [currentIconUrl]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleSearchResult = useCallback((result: SearchResult) => {
    setSelectedCoordinates({ lat: result.center[1], lng: result.center[0] });
    setSelectedAddress(result.place_name);
    setSearchValue(result.place_name);

    if (markerRef.current) {
      markerRef.current.remove();
    }

    if (currentIconUrl) {
      URL.revokeObjectURL(currentIconUrl);
    }

    if (mapRef.current) {
      const iconUrl = createCustomIcon();

      const marker = new mapboxgl.Marker({
        element: createMarkerElement(iconUrl),
        scale: 1.2,
        anchor: 'bottom',
      })
        .setLngLat(result.center)
        .addTo(mapRef.current);

      markerRef.current = marker;
      setCurrentIconUrl(iconUrl);

      mapRef.current.flyTo({
        center: result.center,
        zoom: 16,
        duration: 1500,
      });
    }
  }, []);

  if (!isOpen) return null;

  if (!hasUserLocation) {
    return (
      <div className="w-full h-full flex flex-col bg-white">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-basic-green mx-auto mb-4"></div>
            <p className="text-gray-600">Getting your location...</p>
            <p className="text-sm text-gray-400 mt-2">
              Please allow location access
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-white">
      <div className="flex-1 relative">
        <Map
          ref={mapRef}
          className="w-full h-full"
          initialCenter={initialCenter}
          initialZoom={16}
          showMapboxControls={false}
          showSearch={true}
          showLayerSelector={false}
          showFullscreenButton={false}
          onMapClick={handleMapClick}
          onSearchResult={handleSearchResult}
          searchPlaceholder="Search for address..."
          autoGeolocate={false}
          initialSearchValue={searchValue}
          customActionButton={
            <Button
              variant="complete"
              size="default"
              onClick={handleApply}
              disabled={!selectedCoordinates || !selectedAddress || isLoading}
              className="min-w-[100px]"
            >
              Apply
            </Button>
          }
        />
      </div>
    </div>
  );
}
