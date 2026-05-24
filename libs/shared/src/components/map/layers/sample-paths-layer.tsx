'use client';

import React from 'react';
import { useMapInstance, useMapLoaded, useMapStyleLoaded } from '../context/map-context';
import { MapSamplePaths } from '../markers/map-sample-paths';
import type { SamplePath } from '../../../mock/mock-samples';

interface SamplePathsLayerProps {
  samplePaths?: SamplePath[];
  onSamplePathClick?: (samplePath: SamplePath) => void;
  visible?: boolean;
}

export const SamplePathsLayer: React.FC<SamplePathsLayerProps> = ({
  samplePaths = [],
  onSamplePathClick,
  visible = false,
}) => {
  const map = useMapInstance();
  const mapLoaded = useMapLoaded();
  const styleLoaded = useMapStyleLoaded();

  if (!visible || !mapLoaded || !styleLoaded || samplePaths.length === 0) {
    return null;
  }

  return (
    <MapSamplePaths
      map={map}
      samplePaths={samplePaths}
      onSamplePathClick={onSamplePathClick}
      styleLoaded={styleLoaded}
      layerVisible={visible}
    />
  );
};

