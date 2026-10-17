import { Icon } from '../ui/Icons';
import { Eyebrow } from '../ui/Primitives';

const rules = [
  { icon: Icon.ShieldPlain, title: 'Gasless for you', body: 'The protocol sponsors gas on Base. Confirming a conversion costs you nothing.' },
  { icon: Icon.Lock, title: 'No seed phrase', body: 'Email code or passkey. The embedded wallet is yours; Gami cannot move it.' },
  { icon: Icon.Crosshair, title: 'Launch-gated token', body: "The convert flow and contract link appear only when the GAMI contract address is published. Check it against Gami's own channels." },
  { icon: Icon.Chart, title: 'Reversible by design', body: 'A refund reverses the XP it minted. The ledger shows both lines.' },
];

export function Settlement() {
  return (
    <section className="sec" id="settlement">
      <div className="wrap">
        <Eyebrow>SETTLEMENT LAYER</Eyebrow>
        <h2 className="h2">Loyalty that settles onchain</h2>
        <div className="settle">
          <div>
            <p className="big">We route. <span>We do not issue.</span></p>
            <p className="intro">Gami holds no client money. Card payments settle with the card network and the merchant as they always have. The protocol reads the settled event, applies the rule and routes the reward on Base.</p>
            <div className="chains">
              <span>Base <small>8453</small></span>
              <span>USDC <small>reward asset</small></span>
              <span>GAMI <small>token · launch gated</small></span>
              <span>Solana <small>balances read</small></span>
            </div>
          </div>
          <div className="rules">
            {rules.map((r) => (
              <div key={r.title}><r.icon /><div><b>{r.title}</b><p>{r.body}</p></div></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
