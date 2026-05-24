import { ParcelWithZones } from '../map/hooks/use-map-polygon-splitting';

interface ParcelPreviewProps {
  geometry?: number[][];
  parcelWithZones?: ParcelWithZones | null;
  hideParcelFill?: boolean;
}

export function ParcelPreview({
  geometry,
  parcelWithZones,
  hideParcelFill = false,
}: ParcelPreviewProps) {
  const size = 100;
  const padding = 10;

  const parcelCoordinates =
    parcelWithZones?.parcelCoordinates || geometry || [];
  const zones = parcelWithZones?.zones || [];
  const splitLines = parcelWithZones?.splitLines || [];

  if (parcelCoordinates.length === 0) {
    return null;
  }

  const isMarker = (coord: number[]): boolean => {
    return coord[0] === Infinity && coord[1] === Infinity;
  };

  const validCoordinates = [
    ...parcelCoordinates,
    ...zones.flatMap((z) => z.coordinates.filter((c) => !isMarker(c))),
    ...splitLines.flatMap((sl) => sl.coordinates),
  ];

  if (validCoordinates.length === 0) {
    return null;
  }

  const xs = validCoordinates.map((p) => p[0]);
  const ys = validCoordinates.map((p) => p[1]);

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const width = maxX - minX;
  const height = maxY - minY;

  const scale = Math.min(
    (size - 2 * padding) / width,
    (size - 2 * padding) / height
  );
  const offsetX = (size - width * scale) / 2;
  const offsetY = (size - height * scale) / 2;

  const normalizeCoords = (coords: number[][]) => {
    return coords
      .filter((coord) => !isMarker(coord))
      .map(([x, y]) => {
        if (!isFinite(x) || !isFinite(y)) {
          return null;
        }
        const normX = (x - minX) * scale + offsetX;
        const normY = size - ((y - minY) * scale + offsetY);
        return `${normX},${normY}`;
      })
      .filter((point) => point !== null)
      .join(' ');
  };

  const parcelPath = normalizeCoords(parcelCoordinates);

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width="44"
      height="44"
      style={{
        background: 'black',
        borderRadius: '6px',
      }}
    >
      <polygon
        points={parcelPath}
        fill={
          hideParcelFill
            ? 'none'
            : zones.length > 0
            ? 'rgba(255, 255, 255, 0.3)'
            : 'rgba(255, 255, 255, 0.12)'
        }
        stroke="white"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {zones.map((zone, index) => {
        const polygons: number[][][] = [];
        let currentPolygon: number[][] = [];

        zone.coordinates.forEach((coord) => {
          if (coord[0] === Infinity && coord[1] === Infinity) {
            if (currentPolygon.length > 0) {
              polygons.push(currentPolygon);
              currentPolygon = [];
            }
          } else {
            currentPolygon.push(coord);
          }
        });

        if (currentPolygon.length > 0) {
          polygons.push(currentPolygon);
        }

        if (polygons.length === 0 && zone.coordinates.length > 0) {
          polygons.push(zone.coordinates);
        }

        return (
          <g key={zone.zoneId || index}>
            {polygons.map((polygon, polyIndex) => {
              const polygonPath = normalizeCoords(polygon);
              return (
                <polygon
                  key={`${zone.zoneId || index}-poly-${polyIndex}`}
                  points={polygonPath}
                  fill="none"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              );
            })}
          </g>
        );
      })}

      {splitLines.map((splitLine, index) => {
        const linePath = normalizeCoords(splitLine.coordinates);
        return (
          <polyline
            key={index}
            points={linePath}
            fill="none"
            stroke="white"
            strokeWidth="1"
            strokeDasharray="2,2"
          />
        );
      })}
    </svg>
  );
}
