import React from 'react';

interface TaskNotFoundIconProps {
  width?: number;
  height?: number;
  className?: string;
}

export function TaskNotFoundIcon({
  width = 174,
  height = 128,
  className,
}: TaskNotFoundIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 174 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M88.7 108.4C116.7 108.4 139.4 85.7 139.4 57.6C139.4 29.5 116.6 6.79999 88.7 6.79999C60.7 6.79999 38 29.5 38 57.6C38 85.7 60.7 108.4 88.7 108.4Z"
        fill="#EAEEF9"
      />
      <path
        d="M135.7 24.4C137.964 24.4 139.8 22.5644 139.8 20.3C139.8 18.0356 137.964 16.2 135.7 16.2C133.435 16.2 131.6 18.0356 131.6 20.3C131.6 22.5644 133.435 24.4 135.7 24.4Z"
        fill="#F1F3F9"
      />
      <path
        d="M141.7 8.39999C143.247 8.39999 144.5 7.14639 144.5 5.59999C144.5 4.05359 143.247 2.79999 141.7 2.79999C140.154 2.79999 138.9 4.05359 138.9 5.59999C138.9 7.14639 140.154 8.39999 141.7 8.39999Z"
        fill="#EAEEF9"
      />
      <path
        d="M33.8 31.4C35.3464 31.4 36.6 30.1464 36.6 28.6C36.6 27.0536 35.3464 25.8 33.8 25.8C32.2536 25.8 31 27.0536 31 28.6C31 30.1464 32.2536 31.4 33.8 31.4Z"
        fill="#EAEEF9"
      />
      <path
        d="M49.2 109.2C52.0719 109.2 54.4 106.872 54.4 104C54.4 101.128 52.0719 98.8 49.2 98.8C46.3281 98.8 44 101.128 44 104C44 106.872 46.3281 109.2 49.2 109.2Z"
        fill="#EAEEF9"
      />
      <g filter="url(#filter0_d_2008_26972)">
        <path
          d="M152 71.2046C152 84.1259 141.55 94.5754 128.517 94.5754C128.292 94.5754 126.382 94.5754 112.337 94.5754C102.562 94.5754 86.9438 94.5754 62 94.5754H50.0899C34.4719 94.9124 22 82.4405 22 67.3844C22 52.2159 34.5843 39.6316 50.4269 40.4181C64.0224 -2.05376 126.27 3.90129 131.55 47.8338C143.236 49.2945 152 59.1821 152 71.2046Z"
          fill="url(#paint0_linear_2008_26972)"
        />
      </g>
      <path
        d="M128.517 94.5755C141.439 94.5755 152 84.126 152 71.2047C152 58.2833 141.439 47.8339 128.517 47.8339C115.596 47.8339 105.034 58.2833 105.034 71.2047C105.034 84.126 115.596 94.5755 128.517 94.5755Z"
        fill="url(#paint1_linear_2008_26972)"
      />
      <path
        d="M90.202 94.8001C113.236 94.8001 132 76.1484 132 53.1147C132 30.081 113.236 11.4294 90.202 11.4294C67.1683 11.4294 48.4043 30.081 48.4043 53.1147C48.4043 76.1484 67.056 94.8001 90.202 94.8001Z"
        fill="url(#paint2_linear_2008_26972)"
      />
      <path
        d="M142.594 24.8647C142.168 26.6614 141.528 28.3889 140.746 29.9783C138.686 33.7098 135.63 36.7503 131.793 38.616C127.813 40.62 123.123 41.311 118.362 40.4127C107.276 38.1323 100.099 27.6288 102.444 16.7798C104.789 5.93076 115.52 -1.04855 126.676 1.23182C130.656 2.06105 134.138 3.9268 137.051 6.62178C141.883 11.4589 143.944 18.3 142.594 24.8647Z"
        fill="url(#paint3_linear_2008_26972)"
      />
      <mask
        id="mask0_2008_26972"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="111"
        y="8"
        width="24"
        height="25"
      >
        <rect x="111" y="8.96533" width="24" height="24" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_2008_26972)">
        <path
          d="M130.125 29.3653L124.15 23.3903C123.65 23.757 123.101 24.0445 122.505 24.2528C121.908 24.4611 121.274 24.5653 120.6 24.5653C118.933 24.5653 117.516 23.982 116.35 22.8153C115.183 21.6486 114.6 20.232 114.6 18.5653C114.6 16.8986 115.183 15.482 116.35 14.3153C117.516 13.1486 118.933 12.5653 120.6 12.5653C122.266 12.5653 123.683 13.1486 124.85 14.3153C126.016 15.482 126.6 16.8989 126.6 18.5661C126.6 19.2392 126.495 19.8741 126.287 20.4706C126.079 21.0671 125.791 21.6153 125.425 22.1153L131.4 28.0903L130.125 29.3653ZM120.6 22.7653C121.766 22.7653 122.758 22.357 123.575 21.5403C124.391 20.7236 124.8 19.732 124.8 18.5653C124.8 17.3986 124.391 16.407 123.575 15.5903C122.758 14.7736 121.766 14.3653 120.6 14.3653C119.433 14.3653 118.441 14.7736 117.625 15.5903C116.808 16.407 116.4 17.3986 116.4 18.5653C116.4 19.732 116.808 20.7236 117.625 21.5403C118.441 22.357 119.433 22.7653 120.6 22.7653Z"
          fill="white"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_2008_26972"
          x="0"
          y="0.530945"
          width="174"
          height="127.051"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="11" />
          <feGaussianBlur stdDeviation="11" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.397708 0 0 0 0 0.47749 0 0 0 0 0.575 0 0 0 0.27 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_2008_26972"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_2008_26972"
            result="shape"
          />
        </filter>
        <linearGradient
          id="paint0_linear_2008_26972"
          x1="86.9999"
          y1="45.8509"
          x2="86.9576"
          y2="95.4774"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="0.9964" stopColor="#ECF0F5" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_2008_26972"
          x1="102.535"
          y1="42.8022"
          x2="123.353"
          y2="65.5704"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#BCCBE1" />
          <stop offset="0.9942" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_2008_26972"
          x1="44.4904"
          y1="33.9864"
          x2="77.3007"
          y2="46.8261"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E2E8F0" />
          <stop offset="0.9942" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_2008_26972"
          x1="101.981"
          y1="20.8043"
          x2="143.007"
          y2="20.8043"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#B0BACC" />
          <stop offset="1" stopColor="#969EAE" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default TaskNotFoundIcon;
