/** Outbound links, from env. Empty values fall back to in-page anchors so the page never links to nowhere. */
const env = import.meta.env;

/** Only a well-formed 20-byte hex address is ever published; anything else is treated as "not launched". */
const rawToken = (env.VITE_GAMI_TOKEN_ADDRESS || '').trim();
const tokenAddress = /^0x[0-9a-fA-F]{40}$/.test(rawToken) ? rawToken : '';

export const links = {
  /** GAMI contract on Base. Empty until published; set only from your own deploy output. */
  tokenAddress,
  tokenExplorer: tokenAddress ? `https://basescan.org/token/${tokenAddress}` : '',
  appStore: env.VITE_APP_STORE_URL || '/#cta',
  playStore: env.VITE_PLAY_STORE_URL || '/#cta',
  chromeStore: env.VITE_CHROME_STORE_URL || '/#extension',
  docs: env.VITE_DOCS_URL || '/docs',
  /** Live sale app. Empty until the round is cleared to open; the raise page then asks for an allocation by email. */
  raise: env.VITE_RAISE_URL || '',
  /** POST endpoint for partner submissions. Empty falls back to email. */
  partnersApi: env.VITE_PARTNERS_API_URL || '',
  /** Public Privy app ID (not a secret). Empty hides card funding. */
  privyAppId: env.VITE_PRIVY_APP_ID || '',
  contact: 'admin@gamiprotocol.io',
};

export const isExternal = (href: string) => /^https?:\/\//.test(href);
