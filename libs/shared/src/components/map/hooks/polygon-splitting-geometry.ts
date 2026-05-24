import * as turf from '@turf/turf';
import {
  MIN_COORDINATE_DISTANCE,
  type DrawingFeature,
} from './polygon-splitting-constants';

export function calculatePolygonArea(
  features: DrawingFeature[],
  setPolygonArea: (area: number) => void
): void {
  const polygons = features.filter(
    (f) => f.geometry.type === 'Polygon'
  ) as DrawingFeature[];

  if (polygons.length === 0) {
    setPolygonArea(0);
    return;
  }

  try {
    const totalArea = polygons.reduce((sum, feature) => {
      const polygon = turf.polygon(
        feature.geometry.coordinates as number[][][]
      );
      const areaInSquareMeters = turf.area(polygon);
      return sum + areaInSquareMeters;
    }, 0);

    const areaInHectares = totalArea / 10000;
    setPolygonArea(areaInHectares);
  } catch {
    setPolygonArea(0);
  }
}

export function calculateLineLength(
  features: DrawingFeature[],
  setLineLength: (length: number) => void
): void {
  const lines = features.filter(
    (f) => f.geometry.type === 'LineString'
  ) as DrawingFeature[];

  if (lines.length === 0) {
    setLineLength(0);
    return;
  }

  try {
    const totalLength = lines.reduce((sum, feature) => {
      const line = turf.lineString(feature.geometry.coordinates as number[][]);
      const lengthInMeters = turf.length(line, { units: 'meters' });
      return sum + lengthInMeters;
    }, 0);

    setLineLength(totalLength);
  } catch {
    setLineLength(0);
  }
}

export function splitPolygonByLine(
  polygon: DrawingFeature,
  line: DrawingFeature
): {
  splitPolygons: DrawingFeature[];
  splitLineSegment: number[][];
} | null {
  try {
    const polygonTurf = turf.polygon(
      polygon.geometry.coordinates as number[][][]
    );
    const lineTurf = turf.lineString(line.geometry.coordinates as number[][]);

    const intersection = turf.lineIntersect(lineTurf, polygonTurf);

    if (!intersection || intersection.features.length < 2) {
      return null;
    }

    const intersectionPoints = intersection.features.map(
      (f) => (f.geometry as GeoJSON.Point).coordinates
    );

    const lineStart = (line.geometry.coordinates as number[][])[0];
    const intersectionsSorted = intersectionPoints.sort((a, b) => {
      const distA = turf.distance(turf.point(lineStart), turf.point(a));
      const distB = turf.distance(turf.point(lineStart), turf.point(b));
      return distA - distB;
    });

    const firstInt = intersectionsSorted[0];
    const lastInt = intersectionsSorted[intersectionsSorted.length - 1];

    const lineCoords = line.geometry.coordinates as number[][];
    const splitLine: number[][] = [firstInt];

    for (let i = 1; i < lineCoords.length - 1; i++) {
      const point = lineCoords[i];

      const pt = turf.point(point);
      const isInside = turf.booleanPointInPolygon(pt, polygonTurf, {
        ignoreBoundary: false,
      });

      if (isInside) {
        const lastPoint = splitLine[splitLine.length - 1];
        const dist = turf.distance(turf.point(lastPoint), pt);
        if (dist > MIN_COORDINATE_DISTANCE) {
          splitLine.push([...point]);
        }
      }
    }

    splitLine.push(lastInt);

    const bufferedLineResult = turf.buffer(lineTurf, 0.000001, {
      units: 'kilometers',
    });

    if (!bufferedLineResult || bufferedLineResult.geometry.type !== 'Polygon') {
      return null;
    }

    const bufferedLine = bufferedLineResult as GeoJSON.Feature<GeoJSON.Polygon>;

    let splittedPolygon: GeoJSON.Feature<
      GeoJSON.Polygon | GeoJSON.MultiPolygon
    > | null = null;

    try {
      const featureCollection = turf.featureCollection([
        polygonTurf,
        bufferedLine,
      ]);

      const turfAny = turf as Record<string, unknown>;
      if (typeof turfAny.difference === 'function') {
        try {
          splittedPolygon = (
            turfAny.difference as (
              fc: GeoJSON.FeatureCollection
            ) => GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon> | null
          )(featureCollection);
        } catch {
          splittedPolygon = (
            turfAny.difference as (
              poly1: GeoJSON.Feature<GeoJSON.Polygon>,
              poly2: GeoJSON.Feature<GeoJSON.Polygon>
            ) => GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon> | null
          )(polygonTurf, bufferedLine);
        }
      }
    } catch (error) {
      return null;
    }

    if (!splittedPolygon) {
      return null;
    }

    let polygons: GeoJSON.Feature<GeoJSON.Polygon>[] = [];

    if (splittedPolygon.geometry.type === 'Polygon') {
      polygons = [splittedPolygon as GeoJSON.Feature<GeoJSON.Polygon>];
    } else if (splittedPolygon.geometry.type === 'MultiPolygon') {
      const multiPoly =
        splittedPolygon as GeoJSON.Feature<GeoJSON.MultiPolygon>;
      polygons = multiPoly.geometry.coordinates.map((coords) =>
        turf.polygon(coords)
      );
    }

    if (polygons.length === 0) {
      return null;
    }

    const splitPolygons: DrawingFeature[] = polygons
      .map((feature, index) => {
        return {
          ...polygon,
          id: `${polygon.id}_split_${index + 1}`,
          type: 'Feature' as const,
          geometry: {
            type: 'Polygon' as const,
            coordinates: feature.geometry.coordinates as number[][][],
          },
          properties: {
            ...polygon.properties,
            split_index: index + 1,
          },
        };
      })
      .filter((poly) => {
        try {
          const area = turf.area(turf.polygon(poly.geometry.coordinates));
          return area > 0;
        } catch {
          return false;
        }
      });

    if (splitPolygons.length === 0) {
      return null;
    }

    const rewindedPolygons = splitPolygons.map((poly) => {
      const rewinded = turf.rewind(
        turf.polygon(poly.geometry.coordinates as number[][][]),
        { reverse: false }
      ) as GeoJSON.Feature<GeoJSON.Polygon>;
      return {
        ...poly,
        geometry: {
          type: 'Polygon' as const,
          coordinates: rewinded.geometry.coordinates as number[][][],
        },
      };
    });

    return {
      splitPolygons: rewindedPolygons,
      splitLineSegment: splitLine,
    };
  } catch (error) {
    console.error('Error splitting polygon:', error);
    return null;
  }
}
