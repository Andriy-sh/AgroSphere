'use client';

import React from 'react';
import { useMapInstance, useMapLoaded } from '../context/map-context';
import { useMapImageOverlay } from '../hooks/use-map-image-overlay';
import type { DownloadVisualGeometry } from '../../../api/types/eosda.types';

interface ImageOverlayLayerProps {
  imageUrl?: string | null;
  savedGeometry?: DownloadVisualGeometry | null;
  onImageOverlayReady?: () => void;
  onLoadingOverlayReady?: () => void;
  imageLoading?: boolean;
  isImageReady?: boolean;
}

export const ImageOverlayLayer: React.FC<ImageOverlayLayerProps> = ({
  imageUrl,
  savedGeometry,
  onImageOverlayReady,
  onLoadingOverlayReady,
  imageLoading = false,
  isImageReady = false,
}) => {
  const map = useMapInstance();
  const mapLoaded = useMapLoaded();

  useMapImageOverlay({
    map,
    imageUrl: imageUrl ?? null,
    geometry: savedGeometry ?? null,
    onImageReady: onImageOverlayReady,
    isLoading: imageLoading,
    isImageReady: isImageReady,
    onLoadingOverlayReady: onLoadingOverlayReady,
  });

  if (!mapLoaded) {
    return null;
  }

  return null;
};
