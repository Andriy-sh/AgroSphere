import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import {
  MAP_SOURCE_IDS,
  MAP_LAYER_IDS,
  type ParcelWithZones,
  type PolygonProperties,
  type DrawingFeature,
} from './polygon-splitting-constants';

const ZONE_LABEL_ICON_ID = 'zone-label-icon';
const ZONE_LABEL_ICON_SIZE = 14;

const ensureZoneLabelIcon = (map: mapboxgl.Map) => {
  if (map.hasImage(ZONE_LABEL_ICON_ID)) {
    return;
  }

  const canvas = document.createElement('canvas');
  canvas.width = ZONE_LABEL_ICON_SIZE;
  canvas.height = ZONE_LABEL_ICON_SIZE;
  const context = canvas.getContext('2d');

  if (!context) {
    return;
  }

  context.clearRect(0, 0, ZONE_LABEL_ICON_SIZE, ZONE_LABEL_ICON_SIZE);
  context.strokeStyle = '#FFFFFF';
  context.lineWidth = 1.5;
  context.setLineDash([2, 2]);
  context.strokeRect(
    1.5,
    1.5,
    ZONE_LABEL_ICON_SIZE - 3,
    ZONE_LABEL_ICON_SIZE - 3
  );

  const imageData = context.getImageData(
    0,
    0,
    ZONE_LABEL_ICON_SIZE,
    ZONE_LABEL_ICON_SIZE
  );

  map.addImage(ZONE_LABEL_ICON_ID, {
    width: ZONE_LABEL_ICON_SIZE,
    height: ZONE_LABEL_ICON_SIZE,
    data: imageData.data,
  });
};

export function updateLabels(
  map: mapboxgl.Map | null,
  draw: MapboxDraw | null,
  parcelName: string | undefined,
  parcelAreaProp: number | undefined,
  parcelWithZonesRef: React.MutableRefObject<ParcelWithZones | null>,
  zonesDataRef: React.MutableRefObject<GeoJSON.FeatureCollection>
): void {
  if (!map || !draw) return;

  const parcel = parcelWithZonesRef.current;
  const hasZones = parcel && parcel.zones && parcel.zones.length > 0;
  const sourceId = MAP_SOURCE_IDS.ZONES;
  const zonesLabelLayerId = MAP_LAYER_IDS.ZONES_LABEL;
  const parcelLabelLayerId = MAP_LAYER_IDS.PARCEL_LABEL;

  if (map.getLayer(zonesLabelLayerId)) {
    map.removeLayer(zonesLabelLayerId);
  }
  if (map.getLayer(parcelLabelLayerId)) {
    map.removeLayer(parcelLabelLayerId);
  }

  if (hasZones && parcel) {
    const updatedZonesData = {
      ...zonesDataRef.current,
      features: zonesDataRef.current.features.map((feature) => {
        const props = feature.properties as PolygonProperties;
        const areaInHa = (props.area || 0) / 10000;
        return {
          ...feature,
          properties: {
            ...props,
            area_ha: areaInHa.toFixed(2),
          },
        };
      }),
    };

    if (map.getSource(sourceId)) {
      const source = map.getSource(sourceId) as mapboxgl.GeoJSONSource;
      source.setData(updatedZonesData);
    }

    const minZoomForLabels = 14.5;

    const zoneLabelTextField = [
      'format',
      ['image', ZONE_LABEL_ICON_ID],
      {
        'image-scale': 1,
      },
      '  ',
      {},
      ['get', 'zone_name'],
      {
        'font-scale': 1,
      },
      '\n',
      {},
      ['get', 'area_ha'],
      {
        'font-scale': 0.9,
      },
      ' ha',
      {
        'font-scale': 0.9,
      },
    ] as mapboxgl.Expression;

    if (!map.getLayer(zonesLabelLayerId)) {
      ensureZoneLabelIcon(map);
      map.addLayer({
        id: zonesLabelLayerId,
        type: 'symbol',
        source: sourceId,
        layout: {
          'text-field': zoneLabelTextField,
          'text-font': ['Open Sans Semibold', 'Arial Unicode MS Regular'],
          'text-size': 12,
          'text-anchor': 'center',
          'text-justify': 'center',
          'text-allow-overlap': true,
          'text-ignore-placement': true,
        },
        paint: {
          'text-color': '#FFFFFF',
          'text-halo-color': 'rgba(0,0,0,0)',
          'text-halo-width': 0,
          'text-opacity': [
            'step',
            ['zoom'],
            0,
            minZoomForLabels,
            0,
            minZoomForLabels + 0.0001,
            1,
          ],
        },
      });
    } else {
      const opacityExpression = [
        'step',
        ['zoom'],
        0,
        minZoomForLabels,
        0,
        minZoomForLabels + 0.0001,
        1,
      ] as unknown as mapboxgl.Expression;
      map.setPaintProperty(
        zonesLabelLayerId,
        'text-opacity',
        opacityExpression
      );
    }
  } else if (!hasZones && parcelName && parcelAreaProp && draw) {
    let parcelGeometry: GeoJSON.Polygon | null = null;

    // Double check that draw is not null before calling getAll()
    if (!draw) {
      return;
    }

    try {
      // Use optional chaining for extra safety
      const allFeatures = draw?.getAll();
      if (!allFeatures) {
        return;
      }

      const drawingFeatures = allFeatures.features.filter(
        (f) => f.geometry.type === 'Polygon'
      ) as DrawingFeature[];

      if (drawingFeatures.length > 0) {
        parcelGeometry = drawingFeatures[0].geometry as GeoJSON.Polygon;
      } else if (
        parcel &&
        parcel.parcelCoordinates &&
        parcel.parcelCoordinates.length > 0
      ) {
        const closedCoords = [
          ...parcel.parcelCoordinates,
          parcel.parcelCoordinates[0],
        ];
        parcelGeometry = {
          type: 'Polygon',
          coordinates: [closedCoords],
        };
      }

      if (parcelGeometry) {
        const parcelSourceId = 'parcel-label-source';
        const parcelFeature: GeoJSON.Feature = {
          type: 'Feature',
          geometry: parcelGeometry,
          properties: {
            parcel_name: parcelName,
            parcel_area_ha: parcelAreaProp.toFixed(2),
          },
        };

        if (!map.getSource(parcelSourceId)) {
          map.addSource(parcelSourceId, {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [parcelFeature],
            },
          });
        } else {
          const source = map.getSource(
            parcelSourceId
          ) as mapboxgl.GeoJSONSource;
          source.setData({
            type: 'FeatureCollection',
            features: [parcelFeature],
          });
        }

        if (!map.getLayer(parcelLabelLayerId)) {
          map.addLayer({
            id: parcelLabelLayerId,
            type: 'symbol',
            source: parcelSourceId,
            layout: {
              'text-field': [
                'concat',
                ['get', 'parcel_name'],
                '\n',
                ['get', 'parcel_area_ha'],
                ' ha',
              ],
              'text-font': ['Open Sans Semibold', 'Arial Unicode MS Regular'],
              'text-size': 12,
              'text-anchor': 'center',
              'text-justify': 'center',
              'text-allow-overlap': true,
              'text-ignore-placement': true,
              'text-line-height': 1.2,
            },
            paint: {
              'text-color': '#FFFFFF',
              'text-halo-color': 'rgba(0,0,0,0)',
              'text-halo-width': 0,
              'text-opacity': ['step', ['zoom'], 0, 14.5, 0, 14.5001, 1],
            },
          });
        }
      }
    } catch (error) {
      console.warn('Error updating parcel labels:', error);
      return;
    }
  }
}
