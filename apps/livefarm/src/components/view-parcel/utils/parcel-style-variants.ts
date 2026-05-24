const PARCEL_STYLE_CSV = `
variant,fillColor,fillOpacity,borderColor,borderWidth
default,#1F2937,0.12,#FFFFFF,1
active,#29B54C,0.3,#29B54C,3
`.trim();

interface ParcelStyle {
  fillColor: string;
  fillOpacity: number;
  borderColor: string;
  borderWidth: number;
}

const parseParcelStyles = (csv: string): Map<string, ParcelStyle> => {
  const [headerLine, ...rows] = csv.split('\n').map((line) => line.trim());

  if (!headerLine) {
    return new Map();
  }

  const headers = headerLine.split(',');
  const requiredHeaders = [
    'variant',
    'fillColor',
    'fillOpacity',
    'borderColor',
    'borderWidth',
  ];

  const missingHeaders = requiredHeaders.filter(
    (required) => !headers.includes(required)
  );

  if (missingHeaders.length > 0) {
    console.warn(
      `Parcel style CSV is missing headers: ${missingHeaders.join(', ')}`
    );
    return new Map();
  }

  const variantIndex = headers.indexOf('variant');
  const fillColorIndex = headers.indexOf('fillColor');
  const fillOpacityIndex = headers.indexOf('fillOpacity');
  const borderColorIndex = headers.indexOf('borderColor');
  const borderWidthIndex = headers.indexOf('borderWidth');

  const variants = new Map<string, ParcelStyle>();

  rows.forEach((row) => {
    if (!row) {
      return;
    }

    const columns = row.split(',');

    const variant = columns[variantIndex]?.trim();
    const fillColor = columns[fillColorIndex]?.trim();
    const fillOpacityRaw = columns[fillOpacityIndex]?.trim();
    const borderColor = columns[borderColorIndex]?.trim();
    const borderWidthRaw = columns[borderWidthIndex]?.trim();

    if (!variant || !fillColor || !fillOpacityRaw || !borderColor) {
      return;
    }

    const fillOpacity = Number.parseFloat(fillOpacityRaw);
    const borderWidth = Number.parseFloat(borderWidthRaw ?? '');

    if (Number.isNaN(fillOpacity) || Number.isNaN(borderWidth)) {
      return;
    }

    variants.set(variant, {
      fillColor,
      fillOpacity,
      borderColor,
      borderWidth,
    });
  });

  return variants;
};

const parcelStyleVariants = parseParcelStyles(PARCEL_STYLE_CSV);

const DEFAULT_VARIANT = 'default';

export const getParcelStyleVariant = (variant: string): ParcelStyle => {
  if (parcelStyleVariants.size === 0) {
    return {
      fillColor: '#1F2937',
      fillOpacity: 0.12,
      borderColor: '#FFFFFF',
      borderWidth: 1,
    };
  }

  return (
    parcelStyleVariants.get(variant) ??
    parcelStyleVariants.get(DEFAULT_VARIANT) ??
    {
      fillColor: '#1F2937',
      fillOpacity: 0.12,
      borderColor: '#FFFFFF',
      borderWidth: 1,
    }
  );
};

