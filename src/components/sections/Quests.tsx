import { Icon } from '../ui/Icons';
import { Eyebrow, SectionHead, TrustBadge } from '../ui/Primitives';
import { MissionCard } from '../mocks/MissionCard';

const sources = [
  { icon: Icon.Qr, n: 'SOURCE · QUESTS', title: 'Quests in apps and stores', body: 'Scan a signed code, finish an in-app action, hit a spend target. The wallet verifies the scan: target-bound, single-use, time-boxed, geofenced.', trust: 'verified' as const, label: 'Verified · XP + USDC' },
  { icon: Icon.Gamepad, n: 'SOURCE · GAMES', title: 'Missions inside games', body: "Studios ship missions in their games. Finish one, the studio's game server confirms it and signs the result. The wallet shows it the moment the signature lands.", trust: 'attested' as const, label: 'Attested · XP + USDC, bounded' },
  { icon: Icon.Timer, n: 'SOURCE · YIELD TASKS', title: 'Tasks that mature', body: 'Keep a streak, hold a position, stay subscribed for the month. Yield tasks pay XP as they mature instead of all at once, and reverse if you drop out.', trust: 'attested' as const, label: 'Attested · XP + USDC, bounded' },
];

const trustRows = [
  { level: 'Verified', proof: 'Signed by the protocol, scanned in the mobile wallet. Target-bound, single-use, time-boxed, geofenced.', xp: ['yes', '● Yes'], usdc: ['yes', '● Yes'] },
  { level: 'Attested', proof: 'Signed by the partner on their own server or origin. Game servers, storefronts, web apps.', xp: ['yes', '● Yes'], usdc: ['bnd', '● Bounded by partner standing'] },
  { level: 'Unverified', proof: 'A bare code or a client-side event. A signing key inside a game binary proves possession of the binary, not that the event happened.', xp: ['yes', '● Yes'], usdc: ['no', '● Never'] },
];

export function Quests() {
  return (
    <section className="sec" id="quests">
      <div className="wrap">
        <SectionHead
          eyebrow="QUESTS · GAMES · YIELD TASKS"
          title="Play. Quest. Earn the same XP."
          intro="Card spend is one source. Quests in partner apps, missions inside games and time-boxed yield tasks all pay into the same XP ledger. XP is soulbound: it is yours, it cannot be bought or transferred, and every line can be traced to the action that earned it."
        />

        <div className="src">
          {sources.map((s) => (
            <article className="step" key={s.n}>
              <s.icon className="ic" />
              <div className="n">{s.n}</div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
              <TrustBadge level={s.trust}>{s.label}</TrustBadge>
            </article>
          ))}
        </div>

        <div className="studio">
          <MissionCard />
          <div className="camp">
            <Eyebrow>FOR GAMING STUDIOS</Eyebrow>
            <h3 style={{ marginTop: 12 }}>Advert budget becomes missions</h3>
            <p>Instead of buying impressions, a studio funds a mission pool. The pool only pays out when a player actually plays, so every unit of spend buys a confirmed session, not a view.</p>
            <div className="flowline"><span>Ad budget</span><em>→</em><span>Mission pool</span><em>→</em><span>Confirmed play</span><em>→</em><span>XP + USDC to player</span></div>
            <div className="nums">
              <div><b>5,000</b><small>USDC pool · example</small></div>
              <div><b>16,666</b><small>Missions completed</small></div>
              <div><b>0.30</b><small>USDC per confirmed mission</small></div>
            </div>
            <p>The studio sets the cap per player and the window. The economist agent caps the pool; the risk agent gates anyone farming it. Most-restrictive wins.</p>
          </div>
        </div>

        <div className="ttable" aria-label="Trust levels and what they unlock">
          <table>
            <thead><tr><th>Trust level</th><th>What proves it</th><th>Earns XP</th><th>Unlocks USDC</th></tr></thead>
            <tbody>
              {trustRows.map((r) => (
                <tr key={r.level}>
                  <td>{r.level}</td>
                  <td>{r.proof}</td>
                  <td><b className={r.xp[0]}>{r.xp[1]}</b></td>
                  <td><b className={r.usdc[0]}>{r.usdc[1]}</b></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
