'use client';
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
// import { createPortal } from 'react-dom';

interface FarmMarkerProps {
  map: mapboxgl.Map | null;
  feature: {
    id: string;
    longitude: number;
    latitude: number;
    title: string;
    status?: string;
    color?: string;
    visible?: boolean;
    clientId?: string;
  };
  onMarkerClick?: (marker: any) => void;
  mapLoaded?: boolean;
  styleLoaded?: boolean;
}

const FarmMarker = ({
  map,
  feature,
  onMarkerClick,
}: FarmMarkerProps) => {
  const { longitude, latitude, title, visible = true } = feature;
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  const getFarmColors = () => {
    if (feature.color) {
      return {
        backgroundColor: feature.color,
        borderColor: '#fff',
      };
    }

    return {
      backgroundColor: '#22c55e',
      borderColor: '#fff',
    };
  };

  const colors = getFarmColors();

  useEffect(() => {
    if (!map || visible === false) {
      return;
    }

    if (markerRef.current) {
      markerRef.current.remove();
    }

    const markerElement = document.createElement('div');
    markerElement.style.display = 'flex';
    markerElement.style.flexDirection = 'column';
    markerElement.style.alignItems = 'center';
    // markerElement.style.cursor = 'pointer';

    const circle = document.createElement('div');
    circle.style.width = '40px';
    circle.style.height = '40px';
    circle.style.borderRadius = '50%';
    circle.style.border = '2px solid #ffffff';
    circle.style.backgroundColor = colors.backgroundColor;
    circle.style.display = 'flex';
    circle.style.alignItems = 'center';
    circle.style.justifyContent = 'center';
    circle.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.3)';

    const icon = document.createElement('span');
    icon.className = 'material-symbols-outlined';
    icon.textContent = 'home_work';
    icon.style.color = '#ffffff';
    icon.style.fontSize = '22px';

    const pointer = document.createElement('div');
    pointer.style.width = '0';
    pointer.style.height = '0';
    pointer.style.borderLeft = '6px solid transparent';
    pointer.style.borderRight = '6px solid transparent';
    pointer.style.borderTop = '10px solid #ffffff';
    pointer.style.marginTop = '-2px';

    const dot = document.createElement('div');
    dot.style.width = '8px';
    dot.style.height = '8px';
    dot.style.borderRadius = '50%';
    dot.style.backgroundColor = '#ffffff';
    dot.style.border = `2px solid ${colors.backgroundColor}`;
    dot.style.marginTop = '4px';
    dot.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.3)';

    circle.appendChild(icon);
    markerElement.appendChild(circle);
    markerElement.appendChild(pointer);
    markerElement.appendChild(dot);

    // const handleClick = () => {
    //   if (onMarkerClick) {
    //     onMarkerClick(feature);
    //   } else {
    //     alert(`${title} - Farm`);
    //   }
    // };

    // markerElement.addEventListener('click', handleClick);

    markerRef.current = new mapboxgl.Marker({
      element: markerElement,
      anchor: 'bottom',
    })
      .setLngLat([longitude, latitude])
      .addTo(map);

    return () => {
      // markerElement.removeEventListener('click', handleClick);
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    };
  }, [
    map,
    longitude,
    latitude,
    visible,
    feature,
    onMarkerClick,
    colors.backgroundColor,
  ]);

  return null;
};

export { FarmMarker };
