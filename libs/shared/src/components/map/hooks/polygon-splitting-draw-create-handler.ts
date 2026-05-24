import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as turf from '@turf/turf';
import {
  MAP_SOURCE_IDS,
  MAP_LAYER_IDS,
  type DrawingFeature,
  type ParcelWithZones,
  type PolygonProperties,
} from './polygon-splitting-constants';
import { createZoneClickHandlers } from './zone-click-handlers';
import { splitPolygonByLine } from './polygon-splitting-geometry';
import {
  getNextZoneName,
  extractZoneNumber,
} from './polygon-splitting-zone-utils';
import { updateLabels } from './polygon-splitting-labels';

export function createDrawCreateHandler(
  createdFeature: DrawingFeature,
  draw: MapboxDraw,
  map: mapboxgl.Map,
  zonesDataRef: React.MutableRefObject<GeoJSON.FeatureCollection>,
  parcelWithZonesRef: React.MutableRefObject<ParcelWithZones | null>,
  zoneNameCounterRef: React.MutableRefObject<number>,
  updateParcelAreaFn: () => void,
  updateDrawingsFn: (feature?: DrawingFeature) => void,
  toggleZoneSelection: (zoneId: string) => void,
  setCurrentMode: (
    mode: 'polygon' | 'line_string' | 'simple_select' | null
  ) => void
): void {
  if (createdFeature.geometry.type === 'Polygon' && draw) {
    const allFeatures = draw.getAll().features as DrawingFeature[];
    const polygonCount = allFeatures.filter(
      (f) => f.geometry.type === 'Polygon'
    ).length;

    if (polygonCount > 1) {
      draw.delete(createdFeature.id);
      return;
    }

    const parcelCoords = (
      createdFeature.geometry.coordinates[0] as number[][]
    ).slice(0, -1);

    parcelWithZonesRef.current = {
      parcelId: createdFeature.id,
      parcelCoordinates: parcelCoords,
      zones: [],
      splitLines: [],
      area: turf.area(
        turf.polygon(createdFeature.geometry.coordinates as number[][][])
      ),
    };
    zoneNameCounterRef.current = 0;
    updateParcelAreaFn();
  }

  if (createdFeature.geometry.type === 'LineString' && draw) {
    const allFeatures = draw.getAll().features as DrawingFeature[];
    const polygons = allFeatures.filter((f) => f.geometry.type === 'Polygon');

    const zonesFromDataRef = zonesDataRef.current.features.filter(
      (f) => f.geometry.type === 'Polygon'
    );

    if (polygons.length === 0 && zonesFromDataRef.length === 0) {
      draw.delete(createdFeature.id);
      updateDrawingsFn();
      return;
    }

    let hasValidIntersection = false;

    for (const polygon of polygons) {
      const splitResult = splitPolygonByLine(polygon, createdFeature);

      if (splitResult && splitResult.splitPolygons.length >= 2) {
        hasValidIntersection = true;
        draw.delete(polygon.id);
        draw.delete(createdFeature.id);

        const originalParcelCoords =
          parcelWithZonesRef.current?.parcelCoordinates ||
          (polygon.geometry.coordinates[0] as number[][]).slice(0, -1);

        if (!parcelWithZonesRef.current) {
          parcelWithZonesRef.current = {
            parcelId: polygon.id,
            parcelCoordinates: originalParcelCoords,
            zones: [],
            splitLines: [],
            area: turf.area(
              turf.polygon(polygon.geometry.coordinates as number[][][])
            ),
          };
          zoneNameCounterRef.current = 0;
          updateParcelAreaFn();
        }

        const parcelWithZones = parcelWithZonesRef.current;
        const polygonProps = polygon.properties as PolygonProperties;
        const isZoneSplit = !!polygonProps.zone_id;

        if (isZoneSplit && polygonProps.zone_id) {
          parcelWithZones.zones = parcelWithZones.zones.filter(
            (z) => z.zoneId !== polygonProps.zone_id
          );
        }

        const originalZoneNumber = extractZoneNumber(polygonProps.zone_name);
        if (
          originalZoneNumber !== null &&
          originalZoneNumber > zoneNameCounterRef.current
        ) {
          zoneNameCounterRef.current = originalZoneNumber;
        }

        const newZones = splitResult.splitPolygons.map(
          (splitPoly: DrawingFeature, index: number) => {
            const zoneId = crypto.randomUUID();
            const zoneCoords = (
              splitPoly.geometry.coordinates[0] as number[][]
            ).slice(0, -1);

            const zoneArea = turf.area(
              turf.polygon(splitPoly.geometry.coordinates as number[][][])
            );

            const zoneName =
              index === 0 && polygonProps.zone_name
                ? polygonProps.zone_name
                : getNextZoneName(
                    parcelWithZonesRef,
                    zoneNameCounterRef,
                    extractZoneNumber
                  );

            return {
              zoneId,
              zoneName,
              coordinates: zoneCoords,
              area: zoneArea,
            };
          }
        );

        parcelWithZones.zones.push(...newZones);
        parcelWithZones.splitLines.push({
          coordinates: splitResult.splitLineSegment,
        });

        const splitPolygonsWithProps = splitResult.splitPolygons.map(
          (splitPoly: DrawingFeature, index: number) => {
            const zoneId = newZones[index].zoneId;
            return {
              ...splitPoly,
              properties: {
                ...polygonProps,
                zone_id: zoneId,
                zone_name: newZones[index].zoneName,
                parent_parcel_id: parcelWithZones.parcelId,
              },
            };
          }
        );

        splitPolygonsWithProps.forEach((splitPoly) => {
          const props = splitPoly.properties as PolygonProperties;
          const zoneFeature: GeoJSON.Feature = {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: splitPoly.geometry.coordinates as number[][][],
            },
            properties: {
              zone_id: props.zone_id,
              zone_name:
                props.zone_name ??
                getNextZoneName(
                  parcelWithZonesRef,
                  zoneNameCounterRef,
                  extractZoneNumber
                ),
              parent_parcel_id: props.parent_parcel_id,
              draw_feature_id: '',
              area: turf.area(
                turf.polygon(splitPoly.geometry.coordinates as number[][][])
              ),
            },
          };
          zonesDataRef.current.features.push(zoneFeature);
        });

        if (map) {
          const sourceId = MAP_SOURCE_IDS.ZONES;
          if (map.getSource(sourceId)) {
            const source = map.getSource(sourceId) as mapboxgl.GeoJSONSource;
            source.setData(zonesDataRef.current);
          }

          updateLabels(
            map,
            draw,
            undefined,
            undefined,
            parcelWithZonesRef,
            zonesDataRef
          );

          if (!map.getSource(sourceId)) {
            map.addSource(sourceId, {
              type: 'geojson',
              data: zonesDataRef.current,
            });

            const fillLayerId = MAP_LAYER_IDS.ZONES_FILL;
            if (!map.getLayer(fillLayerId)) {
              map.addLayer({
                id: fillLayerId,
                type: 'fill',
                source: sourceId,
                paint: {
                  'fill-color': '#00AF4D',
                  'fill-opacity': 0.12,
                },
              });

              const fillClickHandlers = createZoneClickHandlers(
                map,
                toggleZoneSelection,
                () => draw?.getMode() === 'draw_line_string'
              );
              map.on('click', fillLayerId, fillClickHandlers.handleZoneClick);
              map.on(
                'mouseenter',
                fillLayerId,
                fillClickHandlers.handleMouseEnter
              );
              map.on(
                'mouseleave',
                fillLayerId,
                fillClickHandlers.handleMouseLeave
              );
            }

            const lineLayerId = MAP_LAYER_IDS.ZONES_LINE;
            if (!map.getLayer(lineLayerId)) {
              map.addLayer({
                id: lineLayerId,
                type: 'line',
                source: sourceId,
                paint: {
                  'line-color': '#29B54C',
                  'line-width': 1,
                },
              });

              const lineClickHandlers = createZoneClickHandlers(
                map,
                toggleZoneSelection,
                () => draw?.getMode() === 'draw_line_string'
              );
              map.on('click', lineLayerId, lineClickHandlers.handleZoneClick);
              map.on(
                'mouseenter',
                lineLayerId,
                lineClickHandlers.handleMouseEnter
              );
              map.on(
                'mouseleave',
                lineLayerId,
                lineClickHandlers.handleMouseLeave
              );
            }

            const selectedLayerId = MAP_LAYER_IDS.ZONES_SELECTED;
            if (!map.getLayer(selectedLayerId)) {
              map.addLayer({
                id: selectedLayerId,
                type: 'fill',
                source: sourceId,
                paint: {
                  'fill-color': '#00AF4D',
                  'fill-opacity': 0.12,
                },
                filter: ['==', ['get', 'zone_id'], ''],
              });
            }
          }
        }

        map.triggerRepaint();
        updateParcelAreaFn();
        updateLabels(
          map,
          draw,
          undefined,
          undefined,
          parcelWithZonesRef,
          zonesDataRef
        );
        draw?.changeMode('simple_select');
        setCurrentMode(null);
        updateDrawingsFn();
        return;
      }
    }

    if (!hasValidIntersection) {
      for (const zoneFeature of zonesFromDataRef) {
        if (zoneFeature.geometry.type !== 'Polygon') continue;

        const polygonGeometry = zoneFeature.geometry as GeoJSON.Polygon;
        const zoneAsDrawingFeature: DrawingFeature = {
          id: (zoneFeature.properties as PolygonProperties).zone_id || '',
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: polygonGeometry.coordinates as number[][][],
          },
          properties: zoneFeature.properties as PolygonProperties,
        };

        const splitResult = splitPolygonByLine(
          zoneAsDrawingFeature,
          createdFeature
        );

        if (splitResult && splitResult.splitPolygons.length >= 2) {
          hasValidIntersection = true;
          draw.delete(createdFeature.id);

          const zoneId = (zoneFeature.properties as PolygonProperties).zone_id;
          zonesDataRef.current.features = zonesDataRef.current.features.filter(
            (f) => (f.properties as PolygonProperties).zone_id !== zoneId
          );

          if (parcelWithZonesRef.current && zoneId) {
            const parcelWithZones = parcelWithZonesRef.current;
            const oldZoneIndex = parcelWithZones.zones.findIndex(
              (z) => z.zoneId === zoneId
            );

            if (oldZoneIndex !== -1) {
              const originalZoneName =
                parcelWithZones.zones[oldZoneIndex].zoneName;
              const originalZoneNumber = extractZoneNumber(originalZoneName);
              if (
                originalZoneNumber !== null &&
                originalZoneNumber > zoneNameCounterRef.current
              ) {
                zoneNameCounterRef.current = originalZoneNumber;
              }

              parcelWithZones.zones.splice(oldZoneIndex, 1);

              const newZones = splitResult.splitPolygons.map(
                (splitPoly: DrawingFeature, index: number) => {
                  const newZoneId = crypto.randomUUID();
                  const zoneCoords = (
                    splitPoly.geometry.coordinates[0] as number[][]
                  ).slice(0, -1);

                  const zoneArea = turf.area(
                    turf.polygon(splitPoly.geometry.coordinates as number[][][])
                  );

                  const zoneName =
                    index === 0 && originalZoneName
                      ? originalZoneName
                      : getNextZoneName(
                          parcelWithZonesRef,
                          zoneNameCounterRef,
                          extractZoneNumber
                        );

                  return {
                    zoneId: newZoneId,
                    zoneName,
                    coordinates: zoneCoords,
                    area: zoneArea,
                  };
                }
              );

              parcelWithZones.zones.push(...newZones);
              parcelWithZones.splitLines.push({
                coordinates: splitResult.splitLineSegment,
              });

              const zoneProps = zoneFeature.properties as PolygonProperties;
              newZones.forEach((newZone, index) => {
                const splitPoly = splitResult.splitPolygons[index];
                const newZoneFeature: GeoJSON.Feature = {
                  type: 'Feature',
                  geometry: {
                    type: 'Polygon',
                    coordinates: splitPoly.geometry.coordinates as number[][][],
                  },
                  properties: {
                    zone_id: newZone.zoneId,
                    zone_name: newZone.zoneName,
                    parent_parcel_id: zoneProps.parent_parcel_id,
                    draw_feature_id: '',
                    area: newZone.area,
                  },
                };
                zonesDataRef.current.features.push(newZoneFeature);
              });
            }
          }

          if (map) {
            const sourceId = MAP_SOURCE_IDS.ZONES;
            if (map.getSource(sourceId)) {
              const source = map.getSource(sourceId) as mapboxgl.GeoJSONSource;
              source.setData(zonesDataRef.current);
            }
          }

          map?.triggerRepaint();
          updateParcelAreaFn();
          updateLabels(
            map,
            draw,
            undefined,
            undefined,
            parcelWithZonesRef,
            zonesDataRef
          );
          draw?.changeMode('simple_select');
          setCurrentMode(null);
          updateDrawingsFn();
          return;
        }
      }

      if (!hasValidIntersection && draw) {
        draw.delete(createdFeature.id);
        updateDrawingsFn();
        return;
      }
    }
  }

  updateDrawingsFn(createdFeature);
}
