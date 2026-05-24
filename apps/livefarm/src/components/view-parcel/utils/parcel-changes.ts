import type {
  ViewParcelFormParcelData,
  ViewParcelHistoryEntry,
} from '../types';

// Function to compare two coordinate arrays
export const compareGeometry = (
  geom1: number[][],
  geom2: number[][]
): boolean => {
  if (geom1.length !== geom2.length) {
    return false;
  }
  for (let i = 0; i < geom1.length; i++) {
    if (geom1[i].length !== geom2[i].length) {
      return false;
    }
    for (let j = 0; j < geom1[i].length; j++) {
      if (Math.abs(geom1[i][j] - geom2[i][j]) > 0.000001) {
        return false;
      }
    }
  }
  return true;
};

export const compareHistory = (
  history1: ViewParcelHistoryEntry[],
  history2: ViewParcelHistoryEntry[]
): boolean => {
  if (history1.length !== history2.length) {
    return false;
  }

  const ids1 = new Set(history1.map((entry) => entry.id));
  const ids2 = new Set(history2.map((entry) => entry.id));

  if (ids1.size !== ids2.size) {
    return false;
  }

  for (const id of ids1) {
    if (!ids2.has(id)) {
      return false;
    }
  }

  return true;
};

// Normalize string for comparison (trim whitespace)
const normalizeString = (str: string | undefined | null): string => {
  if (str === undefined || str === null) {
    return '';
  }
  return String(str).trim();
};

// Compare effective area values (handle both string and number formats)
const compareEffectiveArea = (
  area1: string | undefined,
  area2: string | undefined
): boolean => {
  const normalized1 = normalizeString(area1);
  const normalized2 = normalizeString(area2);

  // If both are empty, they're equal
  if (normalized1 === '' && normalized2 === '') {
    return true;
  }

  // Try to compare as numbers if both are numeric
  const num1 = parseFloat(normalized1);
  const num2 = parseFloat(normalized2);

  if (!isNaN(num1) && !isNaN(num2)) {
    // Compare as numbers with small tolerance
    return Math.abs(num1 - num2) < 0.0001;
  }

  // Fall back to string comparison
  return normalized1 === normalized2;
};

export const hasParcelChanges = (
  current: ViewParcelFormParcelData,
  original: ViewParcelFormParcelData
): boolean => {
  // Compare strings with normalization
  const farmNameChanged =
    normalizeString(current.farmName) !== normalizeString(original.farmName);
  const parcelCodeChanged =
    normalizeString(current.parcelCode) !==
    normalizeString(original.parcelCode);
  const parcelNameChanged =
    normalizeString(current.parcelName) !==
    normalizeString(original.parcelName);
  const soilTypeChanged =
    normalizeString(current.soilType) !== normalizeString(original.soilType);

  // Compare crop: normalize 'not_set' and empty strings to empty for comparison
  const normalizeCrop = (crop: string | undefined): string => {
    const normalized = normalizeString(crop);
    return normalized === 'not_set' ? '' : normalized;
  };
  const cropChanged =
    normalizeCrop(current.crop) !== normalizeCrop(original.crop);

  if (
    farmNameChanged ||
    parcelCodeChanged ||
    parcelNameChanged ||
    soilTypeChanged ||
    cropChanged
  ) {
    return true;
  }

  // Compare effective area with special handling
  if (!compareEffectiveArea(current.effectiveArea, original.effectiveArea)) {
    return true;
  }

  // Compare geometry
  if (!compareGeometry(current.geometry, original.geometry)) {
    return true;
  }

  // Compare history
  if (!compareHistory(current.history, original.history)) {
    return true;
  }

  return false;
};
