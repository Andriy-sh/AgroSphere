'use client';

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './farm-popup.css';

export interface FarmPopupData {
  id: string;
  name: string;
  client_name?: string;
  address?: string;
  size?: number;
  crop_type?: string;
  last_visit?: string;
  status?: string;
  color?: string;
  longitude: number;
  latitude: number;
}

interface FarmPopupProps {
  map: mapboxgl.Map | null;
  farm: FarmPopupData | null;
  isVisible: boolean;
  onClose: () => void;
  onFarmClick?: (farm: FarmPopupData) => void;
}

export const FarmPopup: React.FC<FarmPopupProps> = ({
  map,
  farm,
  isVisible,
  onClose,
  onFarmClick,
}) => {
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const [popupContent, setPopupContent] = useState<string>('');

  const truncate = (text: string, maxLen = 30) =>
    text.length > maxLen ? text.slice(0, maxLen) + '...' : text;

  const createPopupContent = (farmData: FarmPopupData) => {
    const farmName = farmData.name || '---';
    const clientName = farmData.client_name || '---';
    const address = farmData.address || '---';
    const size = farmData.size ? `${farmData.size} ha` : '---';
    const cropType = farmData.crop_type || '---';
    const lastVisit = farmData.last_visit || '---';
    const status = farmData.status || 'active';

    return `
      <div class="p-4 max-w-[320px] popup-content">
        
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-full bg-basic-green flex items-center justify-center flex-shrink-0">
            <span class="material-symbols-outlined text-white text-xl">
              home_work
            </span>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-lg font-semibold text-basic-black leading-tight truncate">${farmName}</h3>
            <p class="text-sm text-basic-gray truncate">${status}</p>
          </div>
          <button class="popup-close-btn text-gray-400 hover:text-gray-600 text-xl font-bold" aria-label="Close popup">&times;</button>
        </div>
        
        <div class="space-y-3 text-sm">
          <div class="flex justify-between items-start">
            <span class="text-basic-gray font-medium">Client:</span>
            <span class="text-basic-black flex-1 truncate text-right">${clientName}</span>
          </div>
          
          
          <div class="flex justify-between items-center">
            <span class="text-basic-gray font-medium">Area:</span>
            <span class="text-basic-black font-semibold">${size}</span>
          </div>
          
          <div class="flex justify-between items-center">
            <span class="text-basic-gray font-medium">Crop:</span>
            <span class="text-basic-black font-semibold">${cropType}</span>
          </div>
          
          <div class="flex justify-between items-center">
            <span class="text-basic-gray font-medium">Last Visit:</span>
            <span class="text-basic-black font-semibold">${lastVisit}</span>
          </div>
        </div>
      </div>
    `;
  };

  useEffect(() => {
    if (!map) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (!popupRef.current) return;
      const popupEl = popupRef.current.getElement();

      if (popupEl && !popupEl.contains(e.target as Node)) {
        const target = e.target as HTMLElement;
        const isMapElement =
          target.closest('.mapboxgl-canvas') ||
          target.closest('.mapboxgl-map') ||
          target.closest('.mapboxgl-control-container');

        if (!isMapElement) {
          onClose();
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible, map, onClose]);

  useEffect(() => {
    const handleFarmPopupClick = (event: CustomEvent) => {
      const farmId = event.detail;
      if (farm && farm.id === farmId && onFarmClick) {
        onFarmClick(farm);
        onClose();
      }
    };

    window.addEventListener(
      'farm-popup-click',
      handleFarmPopupClick as EventListener
    );

    return () => {
      window.removeEventListener(
        'farm-popup-click',
        handleFarmPopupClick as EventListener
      );
    };
  }, [farm, onFarmClick, onClose]);

  useEffect(() => {
    if (!map || !farm) return;

    if (isVisible && !popupRef.current) {
      const content = createPopupContent(farm);
      setPopupContent(content);

      popupRef.current = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        closeOnClick: false,
        maxWidth: '320px',
        className: 'farm-popup',
      })
        .setHTML(content)
        .setLngLat([farm.longitude, farm.latitude])
        .addTo(map);

      const popupEl = popupRef.current.getElement();
      if (popupEl) {
        const closeBtn = popupEl.querySelector('.popup-close-btn');
        if (closeBtn) {
          closeBtn.addEventListener('click', () => onClose());
        }
      }

    } else if (!isVisible && popupRef.current) {
      popupRef.current.remove();
      popupRef.current = null;
      setPopupContent('');
    }

    return () => {
      if (popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
        setPopupContent('');
      }
    };
  }, [map, farm, isVisible, onClose]);

  useEffect(() => {
    if (popupRef.current && farm) {
      const content = createPopupContent(farm);
      setPopupContent(content);
      popupRef.current.setHTML(content);

      popupRef.current.setLngLat([farm.longitude, farm.latitude]);

      const popupEl = popupRef.current.getElement();
      if (popupEl) {
        const closeBtn = popupEl.querySelector('.popup-close-btn');
        if (closeBtn) {
          closeBtn.addEventListener('click', () => onClose());
        }
      }
    }
  }, [farm, onClose]);

  return null;
};

export default FarmPopup;
