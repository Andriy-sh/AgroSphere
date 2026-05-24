import mapboxgl from 'mapbox-gl';

interface PolygonProperties {
  zone_id?: string;
  parent_parcel_id?: string;
  area?: number;
  zone_name?: string;
  [key: string]: unknown;
}

export interface ZoneClickHandlers {
  handleZoneClick: (e: mapboxgl.MapLayerMouseEvent) => void;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
}

export function createZoneClickHandlers(
  map: mapboxgl.Map,
  onZoneToggle: (zoneId: string) => void,
  isDrawingLine: () => boolean 
): ZoneClickHandlers {
  return {
    handleZoneClick: (e: mapboxgl.MapLayerMouseEvent) => {
      if (isDrawingLine()) {
        return;
      }

      if (e.features && e.features.length > 0) {
        const zoneId = (e.features[0].properties as PolygonProperties).zone_id;
        if (zoneId) {
          onZoneToggle(zoneId);
          e.preventDefault();
        }
      }
    },
    handleMouseEnter: () => {
      if (isDrawingLine()) {
        return;
      }
      map.getCanvas().style.cursor = 'pointer';
    },
    handleMouseLeave: () => {
      if (isDrawingLine()) {
        return;
      }
      map.getCanvas().style.cursor = '';
    },
  };
}
