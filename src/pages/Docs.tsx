import { GamiMark } from '../components/ui/Icons';
import { Button, Eyebrow, TrustBadge } from '../components/ui/Primitives';
import { links } from '../lib/links';
import { raiseHref } from '../lib/site';
import { CONVERT_FLOOR_XP } from '../lib/economics';
import { SCHEMA } from '../lib/partners';

const sections = [
  ['overview', 'Overview'],
  ['connect', 'Connect the MCP server'],
  ['manifest', 'Publish your manifest'],
  ['verify', 'How events are verified'],
  ['xp', 'XP and conversion'],
  ['token', 'The GAMI token'],
  ['security', 'Security model'],
] as const;

const example = `{
  "schema": "${SCHEMA}",
  "name": "Yourgame",
  "origin": "https://yourgame.com",
  "category": "Game",
  "description": "A browser game that pays players for finishing missions.",
  "contact": "dev@yourgame.com",
  "rewards": {
    "trigger": "mission.completed",
    "xp": 100,
    "pool": { "asset": "USDC", "amount": 5000 }
  },
  "agent": { "webmcp": true }
}`;

const fields: Array<[string, string, string]> = [
  ['schema', 'string', `Always "${SCHEMA}".`],
  ['name', 'string', '2 to 60 characters.'],
  ['origin', 'string', 'Public https origin with no path. Localhost, IP addresses and .local hosts are refused.'],
  ['category', 'string', 'Game, Store, Web app, Mobile app, Community or Other.'],
  ['description', 'string', '20 to 280 characters.'],
  ['contact', 'string', 'An email address the team can reach.'],
  ['rewards.trigger', 'string', 'Dotted event name, for example mission.completed.'],
  ['rewards.xp', 'integer', 'XP per completion, 1 to 10,000.'],
  ['rewards.pool', 'object', 'Optional. { "asset": "USDC", "amount": n } for USDC rewards.'],
  ['agent.webmcp', 'boolean', 'Whether the Gami web agent may detect quests on your pages.'],
];

export function Docs() {
  return (
    <main id="top">
      <section className="pghead hexbg">
        <div className="wrap">
          <div className="dbrand">
            <GamiMark className="dlogo" aria-hidden="true" />
            <div>
              <Eyebrow>DOCUMENTATION</Eyebrow>
              <h1>Gami Docs</h1>
            </div>
          </div>
          <p className="intro">How to connect a site, game or store, what the protocol checks before it pays, and how XP turns into GAMI and USDC.</p>
          <div className="pgcta">
            <Button size="lg" href="/partners">List your project</Button>
            <Button size="lg" variant="outline" href="#connect">Connect the MCP server</Button>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap docs">
          <nav className="toc" aria-label="On this page">
            <b>On this page</b>
            <ul>{sections.map(([id, label]) => <li key={id}><a href={`#${id}`}>{label}</a></li>)}</ul>
          </nav>

          <article>
            <h2 id="overview">Overview</h2>
            <p>Gami routes rewards. It does not issue them. A card payment settles with the card network and the merchant as it always has; the protocol reads the settled event, applies your rule and routes the reward on Base.</p>
            <ol className="steps">
              <li><b>Event</b> A payment settles, a mission completes or a task matures.</li>
              <li><b>Verify</b> Signature, origin, nonce, window and geofence. The nonce burns last.</li>
              <li><b>Decide</b> The council applies your rule and the caps. The same input gives the same hash.</li>
              <li><b>Route</b> XP goes to the ledger. USDC is quoted and batched on Base.</li>
              <li><b>Pay</b> A separate signer with separate keys broadcasts. NOVA only reads.</li>
            </ol>

            <h2 id="connect">Connect the MCP server</h2>
            <p>Gami ships as a stateless HTTP MCP server with two profiles. Add it to any MCP client (Claude, Cursor or your own agent), then call the tools below.</p>
            <pre className="code">{`gami_quest_design({ trigger, xp, pool, cap_per_user, window_days })
gami_scan_verify(signedResult)             // games, stores, apps
gami_web_verify_webmcp_result(result)      // web agent, origin-checked
gami_reward_route_quote({ to, asset })
gami_reward_authorize_payout(quote)        // emits a signed authorisation
gami_partner_submit(manifest)              // planned: list your project`}</pre>
            <p className="dnote">The public server endpoint is not listed here yet. Ask <a href={`mailto:${links.contact}`}>{links.contact}</a> for access. <code>gami_partner_submit</code> is planned; until it ships, use the <a href="/partners">partner form</a>.</p>

            <h2 id="manifest">Publish your manifest</h2>
            <p>Every listing is bound to an origin. Publish a <code>gami.json</code> at <code>/.well-known/gami.json</code> on your own site. The registry fetches it and checks it against what you submitted.</p>
            <pre className="code">{example}</pre>
            <div className="dtable" role="table" aria-label="Manifest fields">
              <div role="row" className="h"><span role="columnheader">Field</span><span role="columnheader">Type</span><span role="columnheader">Rule</span></div>
              {fields.map(([f, t, r]) => (
                <div role="row" key={f}><code role="cell">{f}</code><span role="cell">{t}</span><span role="cell">{r}</span></div>
              ))}
            </div>
            <p>The <a href="/partners">partner page</a> builds this file for you and also outputs the MCP call and a WebMCP tool.</p>

            <h2 id="verify">How events are verified</h2>
            <p>Detection never credits XP, because scraped page content is attacker-controlled. Only a result signed by your own origin records a completion, and an origin mismatch is refused even when the signature is valid.</p>
            <div className="trusts">
              <div><TrustBadge level="unverified">unverified</TrustBadge><p>Submitted. Quests can run in a sandbox with no payouts.</p></div>
              <div><TrustBadge level="attested">attested</TrustBadge><p>The registry fetched your manifest from your origin and the fields agree. XP quests go live.</p></div>
              <div><TrustBadge level="verified">verified</TrustBadge><p>Reviewed by a person. USDC rewards and the directory listing.</p></div>
            </div>

            <h2 id="xp">XP and conversion</h2>
            <ul>
              <li>The base rate is 1 XP per £1 settled. Streaks lift it. A refund reverses the XP it minted, and the ledger shows both lines.</li>
              <li>XP converts to GAMI at a live rate that falls as outstanding XP supply grows: R(t) = R0 · (S_target / S(t))^α. Four times the supply halves the rate when α is 0.5.</li>
              <li>Only XP above the convert floor converts. The floor is {CONVERT_FLOOR_XP.toLocaleString('en-US')} XP; below it, gas and rounding eat the payout.</li>
              <li>USDC rewards are a merchant rule on settled spend, not a market. Same rule, same spend, same payout.</li>
            </ul>
            <p className="dnote">The constants on the XP economics chart are illustrative. The wallet quotes the real rate.</p>

            <h2 id="token">The GAMI token</h2>
            <p>GAMI is a fixed-supply ERC-20 with Base as its home chain and LayerZero bridges to other chains. It is on testnet only. The convert flow and the contract link appear only when the contract address is published, so check any address against Gami's own channels before you use it.</p>
            <p>The early-bird raise and the launch pools are on the <a href={raiseHref()}>raise page</a>. Every number there is a placeholder until the round is cleared to open.</p>

            <h2 id="security">Security model</h2>
            <ul>
              <li>Gami holds no client money. Payouts are signed by a separate signer with separate keys.</li>
              <li>The embedded wallet is yours. Sign-in is by email code, passkey, Google or an existing wallet, and there is no seed phrase.</li>
              <li>No secret ever goes in browser code. Only public identifiers, such as a Privy app ID, are shipped to the page.</li>
              <li>Report a security problem to <a href={`mailto:${links.contact}`}>{links.contact}</a>.</li>
            </ul>
          </article>
        </div>
      </section>
    </main>
  );
}
