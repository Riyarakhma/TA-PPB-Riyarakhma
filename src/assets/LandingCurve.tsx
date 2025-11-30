import React from 'react';

export const LandingCurve = React.forwardRef<SVGSVGElement, {}>((_props, ref) => (
  <svg
    ref={ref}
    width="320" // Lebar diatur oleh CSS di Landing.tsx
    height="1886"
    viewBox="0 0 320 1886"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    // Atur lebar agar responsif, -z-10 agar di belakang
    className="absolute top-0 left-1/2 -translate-x-1/2 -z-20 w-full max-w-md"
  >
    <path
      id="curve-path"
      d="M160 0 C-40 400, 360 600, 160 1000 C-40 1400, 360 1600, 160 1886"
      stroke="red"
      strokeWidth="100"
      fill="none" // Pastikan fill="none"
    />
  </svg>
));