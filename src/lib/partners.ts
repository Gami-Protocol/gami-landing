/**
 * Partner listing: the manifest a site publishes at /.well-known/gami.json, the validation the
 * registry applies, and the MCP and WebMCP snippets that submit it.
 *
 * Listing is origin-bound. A submission starts "unverified"; it becomes "verified" only when the
 * registry fetches the manifest from the origin it names and the two match.
 */

export const SCHEMA = 'gami.partner/1';

export const CATEGORIES = ['Game', 'Store', 'Web app', 'Mobile app', 'Community', 'Other'] as const;
export type Category = (typeof CATEGORIES)[number];

export const ASSETS = ['XP only', 'USDC'] as const;
export type RewardAsset = (typeof ASSETS)[number];

export interface PartnerInput {
  name: string;
  origin: string;
  category: Category;
  description: string;
  contact: string;
  trigger: string;
  xp: string;
  asset: RewardAsset;
  /** Quest pool in USDC; only used when asset is USDC. */
  poolUsdc: string;
  webAgent: boolean;
}

export const EMPTY_PARTNER: PartnerInput = {
  name: '',
  origin: '',
  category: 'Web app',
  description: '',
  contact: '',
  trigger: 'mission.completed',
  xp: '100',
  asset: 'XP only',
  poolUsdc: '',
  webAgent: true,
};

export type PartnerErrors = Partial<Record<keyof PartnerInput, string>>;

const TRIGGER_RE = /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Normalise a typed origin to `https://host`, or null when it isn't a public https origin. */
export function normaliseOrigin(raw: string): string | null {
  const text = raw.trim();
  if (!text) return null;
  let url: URL;
  try {
    url = new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(text) ? text : `https://${text}`);
  } catch {
    return null;
  }
  if (url.protocol !== 'https:') return null;
  const host = url.hostname.toLowerCase();
  if (!host.includes('.') || host === 'localhost' || /^\d{1,3}(\.\d{1,3}){3}$/.test(host) || host.endsWith('.local')) return null;
  return url.origin;
}

export function validatePartner(p: PartnerInput): PartnerErrors {
  const e: PartnerErrors = {};
  const name = p.name.trim();
  if (name.length < 2 || name.length > 60) e.name = 'Use 2 to 60 characters.';
  if (!normaliseOrigin(p.origin)) e.origin = 'Use the public https origin of your site, for example https://yourgame.com.';
  if (p.description.trim().length < 20 || p.description.trim().length > 280) e.description = 'Describe it in 20 to 280 characters.';
  if (!EMAIL_RE.test(p.contact.trim())) e.contact = 'Use an email we can reach.';
  if (!TRIGGER_RE.test(p.trigger.trim())) e.trigger = 'Use a dotted event name such as mission.completed.';
  const xp = Number(p.xp);
  if (!Number.isInteger(xp) || xp < 1 || xp > 10_000) e.xp = 'Whole XP between 1 and 10,000.';
  if (p.asset === 'USDC') {
    const pool = Number(p.poolUsdc);
    if (!Number.isFinite(pool) || pool <= 0) e.poolUsdc = 'Set a USDC pool above zero.';
  }
  return e;
}

export interface PartnerManifest {
  schema: typeof SCHEMA;
  name: string;
  origin: string;
  category: Category;
  description: string;
  contact: string;
  rewards: {
    trigger: string;
    xp: number;
    pool?: { asset: 'USDC'; amount: number };
  };
  agent: { webmcp: boolean };
}

/** Build the manifest. Call only with input that passes validatePartner. */
export function buildManifest(p: PartnerInput): PartnerManifest {
  const manifest: PartnerManifest = {
    schema: SCHEMA,
    name: p.name.trim(),
    origin: normaliseOrigin(p.origin) ?? p.origin.trim(),
    category: p.category,
    description: p.description.trim(),
    contact: p.contact.trim(),
    rewards: { trigger: p.trigger.trim(), xp: Math.trunc(Number(p.xp)) || 0 },
    agent: { webmcp: p.webAgent },
  };
  if (p.asset === 'USDC') manifest.rewards.pool = { asset: 'USDC', amount: Number(p.poolUsdc) || 0 };
  return manifest;
}

export const manifestJson = (m: PartnerManifest) => JSON.stringify(m, null, 2);

/** The MCP call an agent makes to submit the manifest. `gami_partner_submit` must exist on the server. */
export function mcpSnippet(m: PartnerManifest): string {
  return `// connect the Gami MCP server, then:\ngami_partner_submit(${JSON.stringify(m, null, 2)})\n// → pending · publish ${m.origin}/.well-known/gami.json to verify`;
}

/** WebMCP registration so a browsing agent on the partner's own site can check the listing. */
export function webMcpSnippet(m: PartnerManifest): string {
  return `// on ${m.origin}, loaded as part of your site
navigator.modelContext?.registerTool({
  name: 'gami_partner_status',
  description: ${JSON.stringify(`Check ${m.name} on the Gami partner registry`)},
  inputSchema: { type: 'object', properties: {} },
  async execute() {
    const res = await fetch('https://api.gamiprotocol.io/v1/partners/' + encodeURIComponent(location.origin));
    return { content: [{ type: 'text', text: await res.text() }] };
  },
});`;
}
