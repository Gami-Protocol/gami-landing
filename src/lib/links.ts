/** Outbound links, from env. Empty values fall back to in-page anchors so the page never links to nowhere. */
const env = import.meta.env;

export const links = {
  appStore: env.VITE_APP_STORE_URL || '#cta',
  playStore: env.VITE_PLAY_STORE_URL || '#cta',
  chromeStore: env.VITE_CHROME_STORE_URL || '#extension',
  docs: env.VITE_DOCS_URL || '#companies',
};

export const isExternal = (href: string) => /^https?:\/\//.test(href);
