import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

const MAP_LAYER_IDS = {
  ZONES_FILL: 'zones-fill-layer',
  ZONES_LINE: 'zones-layer',
} as const;


export function useZoneSelectionVisualization(
  map: mapboxgl.Map | null,
  selectedZoneIds: string[]
) {
  useEffect(() => {
    if (!map) return;

    const fillLayerId = MAP_LAYER_IDS.ZONES_FILL;
    const lineLayerId = MAP_LAYER_IDS.ZONES_LINE;

    if (map.getLayer(fillLayerId)) {
      map.setPaintProperty(fillLayerId, 'fill-opacity', [
        'case',
        ['in', ['get', 'zone_id'], ['literal', selectedZoneIds]],
        0.3, 
        0.12, 
      ]);
    }

    if (map.getLayer(lineLayerId)) {
      map.setPaintProperty(lineLayerId, 'line-width', [
        'case',
        ['in', ['get', 'zone_id'], ['literal', selectedZoneIds]],
        2, 
        1, 
      ]);
    }
  }, [selectedZoneIds, map]);
}
