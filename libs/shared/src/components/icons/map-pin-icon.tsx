import React from 'react';

interface MapPinIconProps {
  width?: number;
  height?: number;
  className?: string;
  fill?: string;
  secondaryFill?: string;
}

export function MapPinIcon({
  width = 32,
  height = 52,
  className,
  fill = '#29B54C',
  secondaryFill = 'white',
}: MapPinIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 32 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 0C24.8366 0 32 7.16344 32 16C32 24.3226 25.6456 31.1611 17.5238 31.9284V48.7619C17.5238 49.6035 16.8416 50.2857 16 50.2857C15.1584 50.2857 14.4762 49.6035 14.4762 48.7619V31.9284C6.35439 31.1611 0 24.3226 0 16C0 7.16344 7.16344 0 16 0Z"
        fill={fill}
      />
      <path
        d="M21.3337 16.0003C21.3337 13.0548 18.9458 10.667 16.0003 10.667C13.0548 10.667 10.667 13.0548 10.667 16.0003C10.667 18.9458 13.0548 21.3337 16.0003 21.3337C18.9458 21.3337 21.3337 18.9458 21.3337 16.0003Z"
        fill={secondaryFill}
      />
      <path
        opacity="0.3"
        d="M16.0019 51.8095C18.1058 51.8095 19.8114 50.9567 19.8114 49.9048C19.8114 48.8528 18.1058 48 16.0019 48C13.898 48 12.1924 48.8528 12.1924 49.9048C12.1924 50.9567 13.898 51.8095 16.0019 51.8095Z"
        fill={fill}
      />
    </svg>
  );
}

export default MapPinIcon;
