import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { isExternal } from '../../lib/links';

/** Eyebrow: mono, uppercase, letter-spaced label in accent above every H2. */
export const Eyebrow = ({ children, className = '', style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) => (
  <div className={`eyebrow ${className}`.trim()} style={style}>{children}</div>
);

type ButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: 'primary' | 'outline' | 'ink';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
};

/** Button: Space Grotesk 700, uppercase, 3px frame, hard offset shadow. Renders as a link. */
export function Button({ variant = 'primary', size = 'md', className = '', href = '#', children, ...rest }: ButtonProps) {
  const cls = ['btn', variant === 'primary' ? '' : variant, size === 'md' ? '' : size, className].filter(Boolean).join(' ');
  const external = isExternal(href);
  return (
    <a className={cls} href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>
      {children}
    </a>
  );
}

export const LiveBadge = ({ children = 'Network live' }: { children?: ReactNode }) => (
  <span className="live"><i />{children}</span>
);

type Trust = 'verified' | 'attested' | 'unverified';
const trustClass: Record<Trust, string> = { verified: 'v', attested: 'a', unverified: 'u' };

export const TrustBadge = ({ level, children }: { level: Trust; children: ReactNode }) => (
  <span className={`trust ${trustClass[level]}`}>● {children}</span>
);

/** Section header: eyebrow, uppercase H2, muted intro. */
export function SectionHead({ eyebrow, title, intro, size = 'lg' }: { eyebrow: string; title: string; intro?: string; size?: 'lg' | 'md' }) {
  return (
    <>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className={size === 'md' ? 'h2 md' : 'h2'}>{title}</h2>
      {intro ? <p className="intro">{intro}</p> : null}
    </>
  );
}
