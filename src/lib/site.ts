/**
 * Which site this build is serving. One deployment answers both the main site and the raise subdomain:
 * on `raise.*` the root path is the raise page, and links to everything else go back to the main site.
 */
const env = import.meta.env;

export const MAIN_ORIGIN: string = (env.VITE_MAIN_SITE_URL || 'https://gamiprotocol.io').replace(/\/+$/, '');
export const RAISE_ORIGIN: string = (env.VITE_RAISE_SITE_URL || 'https://raise.gamiprotocol.io').replace(/\/+$/, '');

export const isRaiseHost = (hostname: string = window.location.hostname) => hostname.toLowerCase().startsWith('raise.');

/** A main-site path as a link that works from either host. */
export const mainHref = (path: string) => (isRaiseHost() ? MAIN_ORIGIN + path : path);

/** The raise page as a link that works from either host: the subdomain root when already there, else the subdomain. */
export const raiseHref = () => (isRaiseHost() ? '/' : RAISE_ORIGIN);
