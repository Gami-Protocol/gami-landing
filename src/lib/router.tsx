import { useEffect, useState } from 'react';

/**
 * Minimal path router. The site is static and Vercel rewrites every path to index.html, so real paths work.
 * Same-origin link clicks are intercepted once here, which keeps every existing <a href> and <Button> as is.
 */
const NAV_EVENT = 'gami:navigate';

export const normalisePath = (p: string) => (p.length > 1 ? p.replace(/\/+$/, '') : p) || '/';

export function usePath(): string {
  const [path, setPath] = useState(() => normalisePath(window.location.pathname));
  useEffect(() => {
    const sync = () => setPath(normalisePath(window.location.pathname));
    window.addEventListener('popstate', sync);
    window.addEventListener(NAV_EVENT, sync);
    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener(NAV_EVENT, sync);
    };
  }, []);
  return path;
}

function scrollToHash(hash: string) {
  const id = decodeURIComponent(hash.replace(/^#/, ''));
  const el = id ? document.getElementById(id) : null;
  if (el) el.scrollIntoView();
  else window.scrollTo(0, 0);
}

export function navigate(href: string) {
  const url = new URL(href, window.location.href);
  window.history.pushState({}, '', url.pathname + url.search + url.hash);
  window.dispatchEvent(new Event(NAV_EVENT));
  // Wait a frame so the new page has rendered before looking for the anchor.
  requestAnimationFrame(() => scrollToHash(url.hash));
}

/** Install once at the app root. */
export function useLinkInterceptor() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.('a');
      if (!a || a.target || a.hasAttribute('download')) return;
      const raw = a.getAttribute('href');
      if (!raw || raw.startsWith('mailto:') || raw.startsWith('tel:')) return;
      const url = new URL(raw, window.location.href);
      if (url.origin !== window.location.origin) return;
      // Same document with only a hash change: let the browser scroll.
      if (url.pathname === window.location.pathname && url.search === window.location.search && url.hash) return;
      e.preventDefault();
      navigate(url.pathname + url.search + url.hash);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
}
