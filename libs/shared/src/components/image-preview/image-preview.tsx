import { useId } from 'react';

interface ImagePreviewProps {
  imageUrl: string;
  alt?: string;
}

export function ImagePreview({ imageUrl, alt = 'Preview' }: ImagePreviewProps) {
  const boxSize = 44;
  const padding = 7;
  const imageSize = boxSize - padding * 2;
  const borderRadius = 6;
  const clipPathId = useId();

  return (
    <svg
      viewBox={`0 0 ${boxSize} ${boxSize}`}
      width="44"
      height="44"
      style={{
        background: 'black',
        borderRadius: `${borderRadius}px`,
      }}
    >
      <defs>
        <clipPath id={clipPathId}>
          <rect
            x={padding}
            y={padding}
            width={imageSize}
            height={imageSize}
            rx={borderRadius}
            ry={borderRadius}
          />
        </clipPath>
      </defs>
      <image
        href={imageUrl}
        x={padding}
        y={padding}
        width={imageSize}
        height={imageSize}
        preserveAspectRatio="xMidYMid slice"
        clipPath={`url(#${clipPathId})`}
      />
    </svg>
  );
}
