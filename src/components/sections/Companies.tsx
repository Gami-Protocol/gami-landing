import { Button, Eyebrow, SectionHead } from '../ui/Primitives';
import { links } from '../../lib/links';

const pipeline = [
  ['01', 'Event', 'A payment settles, a mission completes, a task matures.'],
  ['02', 'Verify', 'Signature, origin, nonce, window and geofence. Nonce burns last.'],
  ['03', 'Decide', 'The council applies your rule and the caps. Same input, same hash.'],
  ['04', 'Route', 'XP to the ledger. USDC quoted and batched on Base.'],
  ['05', 'Pay', 'A separate signer with separate keys broadcasts. NOVA only reads.'],
];

export function Companies() {
  return (
    <section className="sec band" id="companies">
      <div className="wrap">
        <SectionHead
          eyebrow="FOR COMPANIES · MCP SERVER + AGENTIC WEB TOOL"
          title="Plug in. Rewards run themselves."
          intro="Gami ships as an MCP server and a web agent. You describe the reward in plain language or one JSON rule. Three policy agents design, verify and settle it, and NOVA reports back without ever holding a key."
        />

        <div className="pgcta" style={{ marginTop: 32 }}>
          <Button href="/partners">List your project</Button>
          <Button variant="outline" href={links.docs}>Read the docs</Button>
        </div>

        <div className="co">
          <div className="term">
            <div className="tb">gami-mcp · 26 tools <span>stateless http · two profiles</span></div>
            <pre>{''}<span className="c">{'// 1. publish the manifest on your own origin'}</span>{'\n'}
<span className="k">GET</span>{' https://yourgame.com/.well-known/gami.json\n\n'}
<span className="c">{'// 2. connect the MCP server, then write the rule'}</span>{'\n'}
<span className="k">gami_quest_design</span>{'({\n  '}<span className="s">"trigger"</span>{': '}<span className="s">"mission.completed"</span>{',\n  '}<span className="s">"xp"</span>{': 300,\n  '}<span className="s">"pool"</span>{': { '}<span className="s">"asset"</span>{': '}<span className="s">"USDC"</span>{', '}<span className="s">"amount"</span>{': 5000 },\n  '}<span className="s">"cap_per_user"</span>{': 3,\n  '}<span className="s">"window_days"</span>{': 30\n})\n'}
<span className="g">{'→ verdict: approved · decisionHash 0x3f9a…c21'}</span>{'\n\n'}
<span className="c">{'// 3. your server confirms the event and signs it'}</span>{'\n'}
<span className="k">gami_scan_verify</span>{'(signedResult)        '}<span className="c">{'// games, stores, apps'}</span>{'\n'}
<span className="k">gami_web_verify_webmcp_result</span>{'(result) '}<span className="c">{'// web agent · origin-checked'}</span>{'\n\n'}
<span className="c">{'// 4. the reward layer routes; a separate signer pays'}</span>{'\n'}
<span className="k">gami_reward_route_quote</span>{'({ to: player, asset: '}<span className="s">"USDC"</span>{' })\n'}
<span className="k">gami_reward_authorize_payout</span>{'(quote)   '}<span className="c">{'// emits a signed authorisation'}</span>{'\n'}
<span className="g">{'→ settled · base:8453 · xp +300 · usdc 0.30'}</span></pre>
          </div>

          <div className="council">
            <div className="cd">
              <Eyebrow>QUEST COUNCIL</Eyebrow>
              <h3 style={{ marginTop: 12 }}>Three agents, one verdict</h3>
              <p>No model in the loop. The agents encode policy, so the same brief returns the same verdict and the same hash, and settlement is checked against that hash later.</p>
              <div className="agents">
                <div><b>Designer</b>Shapes the mission and its steps</div>
                <div><b>Economist</b>Caps pool, rate and per-user payout</div>
                <div><b>Risk</b>Gates farming, replay and anomalies</div>
              </div>
              <div className="arb">Arbiter <span>MOST-RESTRICTIVE WINS</span></div>
            </div>
            <div className="cd">
              <Eyebrow>AGENTIC WEB TOOL</Eyebrow>
              <h3 style={{ marginTop: 12 }}>Reads the page, credits nothing</h3>
              <p>The web agent detects quests on any site your users visit. Detection never credits XP, because scraped DOM is attacker-controlled. Only a signed result from your origin records a completion, and an origin mismatch is refused even with a valid signature.</p>
            </div>
          </div>
        </div>

        <div className="pipe" aria-label="Automated rewarding pipeline">
          {pipeline.map(([n, t, b]) => (
            <div key={n}><small>{n}</small><b>{t}</b><p>{b}</p></div>
          ))}
        </div>

        <div className="adapt">
          <span>Storefronts</span><span>Game servers</span><span>Web apps</span><span>Discord</span><span>Telegram</span><span>Mobile SDKs</span>
          <span className="note">11 platform adapters · ordered setup · hooks</span>
        </div>
      </div>
    </section>
  );
}
