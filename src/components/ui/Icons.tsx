import type { SVGProps } from 'react';

/** Shared SVG symbols: the Gami mark (never redrawn) and the hexagon motif. Mount once in App. */
export function SvgDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <symbol id="gmark" viewBox="0 0 100 100">
          <rect width="100" height="100" fill="#6E3CFB" />
          <path
            fill="#FFFFFF"
            d="M52.63 14.69A5.18 5.18 0 0 0 47.37 14.69L22.27 29.47A5.18 5.18 0 0 0 19.72 33.93L19.72 63.67A5.18 5.18 0 0 0 22.27 68.14L47.37 82.92A5.18 5.18 0 0 0 52.63 82.92L77.73 68.14A5.18 5.18 0 0 0 80.28 63.67L80.28 40.83L50 40.83L43.54 51.83L68.75 51.83L68.75 59.85L50 70.89L31.25 59.85L31.25 37.76L50 26.72L68.75 37.76L80.28 30.97Z"
          />
        </symbol>
        <symbol id="hex" viewBox="0 0 100 100">
          <path d="M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z" />
        </symbol>
      </defs>
    </svg>
  );
}

export const GamiMark = (p: SVGProps<SVGSVGElement>) => (
  <svg {...p}>
    <use href="#gmark" />
  </svg>
);

export const Hexagon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...p}>
    <use href="#hex" />
  </svg>
);

/** 24px stroke icons (Heroicons outline convention). */
const base = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export const Icon = {
  Card: (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}><rect x="2" y="5" width="20" height="14" /><path d="M2 10h20M6 15h4" /></svg>
  ),
  Shield: (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}><path d="M9 12l2 2 4-4" /><path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z" /></svg>
  ),
  ShieldPlain: (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}><path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z" /></svg>
  ),
  Bolt: (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}><path d="M13 2L4 14h7l-1 8 9-12h-7z" /></svg>
  ),
  Ramp: (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}><path d="M3 17l6-6 4 4 8-8" /><path d="M14 7h7v7" /></svg>
  ),
  List: (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}><path d="M3 6h18M3 12h18M3 18h12" /></svg>
  ),
  Swap: (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}><path d="M7 7h10M7 7l3-3M7 7l3 3M17 17H7m10 0l-3-3m3 3l-3 3" /></svg>
  ),
  Dollar: (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v10M9.5 9.5h3.5a1.75 1.75 0 010 3.5h-2a1.75 1.75 0 000 3.5H15" /></svg>
  ),
  Wallet: (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}><path d="M4 7h16v10H4zM8 7V5h8v2" /></svg>
  ),
  Clock: (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 8v4l3 2" /></svg>
  ),
  Star: (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}><path d="M12 3l2.5 5.5L20 10l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-1.5z" /></svg>
  ),
  Grid: (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}><path d="M4 4h16v16H4zM4 9h16M9 9v11" /></svg>
  ),
  Lock: (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}><rect x="5" y="11" width="14" height="10" /><path d="M8 11V7a4 4 0 018 0v4" /></svg>
  ),
  Qr: (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h3v3h-3M20 14v6h-3" /></svg>
  ),
  Gamepad: (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}><rect x="2" y="7" width="20" height="11" /><path d="M6 12h4M8 10v4M15 11h.01M18 13h.01" /></svg>
  ),
  Timer: (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
  ),
  Crosshair: (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}><path d="M3 12h18M12 3v18" /><circle cx="12" cy="12" r="9" /></svg>
  ),
  Chart: (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}><path d="M4 4v16h16" /><path d="M8 14l3-3 3 3 5-6" /></svg>
  ),
};
