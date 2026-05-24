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
import {
  getNextZoneName,
  extractZoneNumber,
} from './polygon-splitting-zone-utils';
import { updateLabels } from './polygon-splitting-labels';

export function syncZonesFromDraw(
  mapInstance: mapboxgl.Map,
  draw: MapboxDraw,
  zonesDataRef: React.MutableRefObject<GeoJSON.FeatureCollection>,
  zoneNameCounterRef: React.MutableRefObject<number>,
  parcelWithZonesRef: React.MutableRefObject<ParcelWithZones | null>,
  toggleZoneSelection: (zoneId: string) => void
): void {
  if (!draw) return;

  const sourceId = MAP_SOURCE_IDS.ZONES;
  const layerId = MAP_LAYER_IDS.ZONES_LINE;
  const selectedLayerId = MAP_LAYER_IDS.ZONES_SELECTED;

  const allFeatures = draw.getAll().features as DrawingFeature[];
  const zonePolygons = allFeatures.filter(
    (f) =>
      f.geometry.type === 'Polygon' &&
      (f.properties as PolygonProperties).zone_id
  );

  zonesDataRef.current.features = [];

  zonePolygons.forEach((poly) => {
    const props = poly.properties as PolygonProperties;
    const zoneName =
      props.zone_name ??
      getNextZoneName(
        parcelWithZonesRef,
        zoneNameCounterRef,
        extractZoneNumber
      );
    const zoneNumber = extractZoneNumber(zoneName);
    if (zoneNumber !== null && zoneNumber > zoneNameCounterRef.current) {
      zoneNameCounterRef.current = zoneNumber;
    }
    const zoneFeature: GeoJSON.Feature = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: poly.geometry.coordinates as number[][][],
      },
      properties: {
        zone_id: props.zone_id,
        zone_name: zoneName,
        parent_parcel_id: props.parent_parcel_id,
        draw_feature_id: poly.id,
        area: turf.area(
          turf.polygon(poly.geometry.coordinates as number[][][])
        ),
      },
    };
    zonesDataRef.current.features.push(zoneFeature);
  });

  if (!mapInstance.getSource(sourceId)) {
    mapInstance.addSource(sourceId, {
      type: 'geojson',
      data: zonesDataRef.current,
    });
  } else {
    const source = mapInstance.getSource(sourceId) as mapboxgl.GeoJSONSource;
    source.setData(zonesDataRef.current);
  }

  const fillLayerId = MAP_LAYER_IDS.ZONES_FILL;
  if (!mapInstance.getLayer(fillLayerId)) {
    mapInstance.addLayer({
      id: fillLayerId,
      type: 'fill',
      source: sourceId,
      paint: {
        'fill-color': '#00AF4D',
        'fill-opacity': 0.12,
      },
      filter: ['!', ['in', ['get', 'draw_feature_id'], ['literal', []]]],
    });

    const fillClickHandlers = createZoneClickHandlers(
      mapInstance,
      toggleZoneSelection,
      () => draw?.getMode() === 'draw_line_string'
    );
    mapInstance.on('click', fillLayerId, fillClickHandlers.handleZoneClick);
    mapInstance.on(
      'mouseenter',
      fillLayerId,
      fillClickHandlers.handleMouseEnter
    );
    mapInstance.on(
      'mouseleave',
      fillLayerId,
      fillClickHandlers.handleMouseLeave
    );
  }

  if (!mapInstance.getLayer(layerId)) {
    mapInstance.addLayer({
      id: layerId,
      type: 'line',
      source: sourceId,
      paint: {
        'line-color': '#29B54C',
        'line-width': 1,
      },
      filter: ['!', ['in', ['get', 'draw_feature_id'], ['literal', []]]],
    });

    mapInstance.addLayer({
      id: selectedLayerId,
      type: 'fill',
      source: sourceId,
      paint: {
        'fill-color': '#00AF4D',
        'fill-opacity': 0.12,
      },
      filter: ['==', ['get', 'zone_id'], ''],
    });

    const lineClickHandlers = createZoneClickHandlers(
      mapInstance,
      toggleZoneSelection,
      () => draw?.getMode() === 'draw_line_string'
    );
    mapInstance.on('click', layerId, lineClickHandlers.handleZoneClick);
    mapInstance.on('mouseenter', layerId, lineClickHandlers.handleMouseEnter);
    mapInstance.on('mouseleave', layerId, lineClickHandlers.handleMouseLeave);
  }
}

export function mergeZones(
  map: mapboxgl.Map,
  draw: MapboxDraw | null,
  selectedZoneIds: string[],
  zonesDataRef: React.MutableRefObject<GeoJSON.FeatureCollection>,
  parcelWithZonesRef: React.MutableRefObject<ParcelWithZones | null>,
  zoneNameCounterRef: React.MutableRefObject<number>,
  getNextZoneNameFn: () => string,
  extractZoneNumberFn: (zoneName?: string) => number | null,
  updateParcelAreaFn: () => void,
  updateLabelsFn: () => void,
  setParcelArea: (area: number) => void,
  setSelectedZoneIds: (ids: string[] | ((prev: string[]) => string[])) => void,
  setSelectedZoneId: (
    id: string | null | ((prev: string | null) => string | null)
  ) => void
): void {
  if (!map || selectedZoneIds.length < 2) {
    return;
  }

  try {
    const parcel = parcelWithZonesRef.current;
    if (!parcel) {
      return;
    }

    const selectedZoneFeatures = zonesDataRef.current.features.filter(
      (f) =>
        (f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon') &&
        selectedZoneIds.includes(
          (f.properties as PolygonProperties).zone_id || ''
        )
    ) as GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>[];

    if (selectedZoneFeatures.length < 2) {
      return;
    }

    const validPolygons: GeoJSON.Feature<GeoJSON.Polygon>[] = [];

    selectedZoneFeatures.forEach((feature) => {
      if (feature.geometry.type === 'Polygon') {
        validPolygons.push(feature as GeoJSON.Feature<GeoJSON.Polygon>);
        return;
      }

      if (feature.geometry.type === 'MultiPolygon') {
        const multi = feature.geometry.coordinates as number[][][][];
        multi.forEach((coords) => {
          validPolygons.push(
            turf.polygon(coords) as GeoJSON.Feature<GeoJSON.Polygon>
          );
        });
      }
    });

    if (validPolygons.length < 2) {
      return;
    }

    let unionResult: GeoJSON.Feature<
      GeoJSON.Polygon | GeoJSON.MultiPolygon
    > | null = null;

    try {
      if (validPolygons.length === 0) {
        throw new Error('No valid polygons to union');
      }

      const featureCollection = turf.featureCollection(validPolygons);
      unionResult = turf.union(featureCollection);

      if (!unionResult) {
        let currentUnion: GeoJSON.Feature<
          GeoJSON.Polygon | GeoJSON.MultiPolygon
        > = validPolygons[0];

        for (let i = 1; i < validPolygons.length; i++) {
          const nextPolygon = validPolygons[i];

          const pairCollection = turf.featureCollection([
            currentUnion,
            nextPolygon,
          ]);

          const partialUnion = turf.union(pairCollection);

          if (!partialUnion) {
            continue;
          }

          currentUnion = partialUnion;
        }

        unionResult = currentUnion;
      }

      if (unionResult && unionResult.geometry.type === 'MultiPolygon') {
        const BUFFER_DISTANCE_METERS = 0.05;

        try {
          const buffered = turf.buffer(unionResult, BUFFER_DISTANCE_METERS, {
            units: 'meters',
          }) as GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>;

          if (buffered) {
            const cleaned = turf.buffer(buffered, -BUFFER_DISTANCE_METERS, {
              units: 'meters',
            }) as GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>;

            if (cleaned && cleaned.geometry.type === 'Polygon') {
              unionResult = cleaned as GeoJSON.Feature<GeoJSON.Polygon>;
            } else if (cleaned) {
              unionResult = cleaned;
            }
          }
        } catch (bufferError) {
          return;
        }
      }

      if (unionResult) {
        const inputAreas = validPolygons.map((p) => turf.area(p));
        const totalInputArea = inputAreas.reduce((sum, area) => sum + area, 0);
        const unionArea = turf.area(unionResult);

        if (Math.abs(unionArea - totalInputArea) < 0.01) {
            return
        }
      }

      if (!unionResult) {
        throw new Error('Union returned null');
      }
    } catch (error) {
      return;
    }

    let processedUnion: GeoJSON.Feature<
      GeoJSON.Polygon | GeoJSON.MultiPolygon
    > = turf.cleanCoords(unionResult) as GeoJSON.Feature<
      GeoJSON.Polygon | GeoJSON.MultiPolygon
    >;

    try {
      processedUnion = turf.simplify(processedUnion, {
        tolerance: 0.000001,
        highQuality: true,
        mutate: false,
      }) as GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>;
    } catch (simplifyError) {
      return;
    }

    let processedUnionPolygon: GeoJSON.Feature<GeoJSON.Polygon>;

    if (processedUnion.geometry.type === 'Polygon') {
      processedUnionPolygon =
        processedUnion as GeoJSON.Feature<GeoJSON.Polygon>;
    } else {
      const firstPolygon = (processedUnion.geometry as GeoJSON.MultiPolygon)
        .coordinates[0];
      processedUnionPolygon = turf.polygon(
        firstPolygon
      ) as GeoJSON.Feature<GeoJSON.Polygon>;
    }

    const unionArea = turf.area(processedUnionPolygon);

    const mergedZoneName = (() => {
      if (selectedZoneIds.length === 0) {
        return getNextZoneNameFn();
      }

      const ensureCounterCovers = (zoneName: string) => {
        const zoneNumber = extractZoneNumberFn(zoneName);
        if (zoneNumber !== null && zoneNumber > zoneNameCounterRef.current) {
          zoneNameCounterRef.current = zoneNumber;
        }
      };

      const firstSelectedId = selectedZoneIds[0];
      const firstSelectedZone = parcel.zones.find(
        (zone) => zone.zoneId === firstSelectedId
      );

      if (firstSelectedZone?.zoneName) {
        ensureCounterCovers(firstSelectedZone.zoneName);
        return firstSelectedZone.zoneName;
      }

      let minZoneName: string | null = null;
      let minZoneNumber = Number.POSITIVE_INFINITY;

      parcel.zones.forEach((zone) => {
        if (!selectedZoneIds.includes(zone.zoneId) || !zone.zoneName) {
          return;
        }

        const zoneNumber = extractZoneNumberFn(zone.zoneName);
        if (zoneNumber !== null && zoneNumber < minZoneNumber) {
          minZoneNumber = zoneNumber;
          minZoneName = zone.zoneName;
        }
      });

      if (minZoneName) {
        ensureCounterCovers(minZoneName);
        return minZoneName;
      }

      return getNextZoneNameFn();
    })();

    const unionPolygon = processedUnionPolygon;

    parcel.splitLines = parcel.splitLines.filter((splitLine) => {
      const splitLineString = turf.lineString(splitLine.coordinates);
      const intersection = turf.lineIntersect(splitLineString, unionPolygon);

      if (intersection && intersection.features.length > 0) {
        const allPointsInsideOrOnBoundary = splitLine.coordinates.every(
          (point) => {
            const pt = turf.point(point);
            return turf.booleanPointInPolygon(pt, unionPolygon, {
              ignoreBoundary: false,
            });
          }
        );

        if (allPointsInsideOrOnBoundary) {
          return false;
        }
      }

      return true;
    });

    parcel.zones = parcel.zones.filter(
      (z) => !selectedZoneIds.includes(z.zoneId)
    );

    zonesDataRef.current.features = zonesDataRef.current.features.filter(
      (f) =>
        !selectedZoneIds.includes(
          (f.properties as PolygonProperties).zone_id || ''
        )
    );

    if (parcel.zones.length === 0) {
      const mergedCoords = (
        processedUnionPolygon.geometry.coordinates[0] as number[][]
      ).slice(0, -1);

      parcel.parcelCoordinates = mergedCoords;
      parcel.zones = [];
      parcel.splitLines = [];
      parcel.area = unionArea;
      zoneNameCounterRef.current = 0;

      zonesDataRef.current.features = [];

      const sourceId = MAP_SOURCE_IDS.ZONES;
      if (map.getSource(sourceId)) {
        const source = map.getSource(sourceId) as mapboxgl.GeoJSONSource;
        source.setData(zonesDataRef.current);
        updateLabelsFn();
      }

      if (draw) {
        const closedCoords = [...mergedCoords, mergedCoords[0]];

        const parcelFeature: GeoJSON.Feature = {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [closedCoords],
          },
          properties: {},
        };

        const existingFeatures = draw.getAll();
        existingFeatures.features.forEach((feature) => {
          if (feature.geometry.type === 'Polygon' && feature.id) {
            const featureId =
              typeof feature.id === 'string' ? feature.id : String(feature.id);
            draw.delete(featureId);
          }
        });

        draw.add(parcelFeature);
      }

      setParcelArea(unionArea / 10000);
      setSelectedZoneIds([]);
      setSelectedZoneId(null);
      map.triggerRepaint();
      updateParcelAreaFn();

      setTimeout(() => {
        updateLabelsFn();
      }, 0);
      return;
    }

    const mergedZoneId = crypto.randomUUID();
    const mergedCoords = (
      processedUnionPolygon.geometry.coordinates[0] as number[][]
    ).slice(0, -1);

    const mergedZone = {
      zoneId: mergedZoneId,
      zoneName: mergedZoneName,
      coordinates: mergedCoords,
      area: unionArea,
    };

    parcel.zones.push(mergedZone);

    const mergedZoneFeature: GeoJSON.Feature = {
      type: 'Feature',
      geometry: processedUnionPolygon.geometry,
      properties: {
        zone_id: mergedZoneId,
        zone_name: mergedZone.zoneName,
        parent_parcel_id: parcel.parcelId,
        draw_feature_id: '',
        area: unionArea,
      },
    };

    zonesDataRef.current.features.push(mergedZoneFeature);

    const sourceId = MAP_SOURCE_IDS.ZONES;
    if (map.getSource(sourceId)) {
      const source = map.getSource(sourceId) as mapboxgl.GeoJSONSource;
      const updatedZonesData: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: [...zonesDataRef.current.features],
      };
      source.setData(updatedZonesData);
      zonesDataRef.current = updatedZonesData;
    } else {
      map.addSource(sourceId, {
        type: 'geojson',
        data: zonesDataRef.current,
      });
    }

    updateParcelAreaFn();
    setSelectedZoneIds([]);
    setSelectedZoneId(null);
    map.triggerRepaint();
    updateLabelsFn();
  } catch (error) {
    console.error('Error merging zones:', error);
  }
}
