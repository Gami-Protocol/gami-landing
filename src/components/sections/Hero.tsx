import { Hexagon } from '../ui/Icons';
import { Button, Eyebrow, LiveBadge } from '../ui/Primitives';
import { PhoneMock } from '../mocks/PhoneMock';
import { links } from '../../lib/links';

export function Hero() {
  return (
    <section className="hero hexbg">
      <div className="wrap grid">
        <div className="stage" aria-label="Gami Wallet showing XP balance, with XP, GAMI, USDC and card badges">
          <div className="hexfill" />
          <Hexagon className="bighex" />
          <div className="square" />
          <PhoneMock />
          <div className="coin xp">XP<span>+186</span></div>
          <div className="coin gami">GAMI<span>TOKEN</span></div>
          <div className="coin usdc">USDC<span>ON BASE</span></div>
          <div className="coin card">CARD<span>•• 4417</span></div>
        </div>
        <div>
          <Eyebrow>WALLET · EXTENSION · CARD · QUESTS</Eyebrow>
          <h1 style={{ marginTop: 16 }}>Every card payment <span className="p">earns</span> onchain.</h1>
          <p className="lead">
            Pay with your card, play a mission, finish a quest. The protocol verifies the action, mints XP to your wallet in real time,
            and lets you ramp XP into GAMI or settle rewards in USDC on Base. No gas. No seed phrase.
          </p>
          <div className="cta">
            <Button size="lg" href="#cta">Get the wallet</Button>
            <Button size="lg" variant="outline" href={links.chromeStore}>Add the extension</Button>
          </div>
          <div className="stats">
            <div className="stat"><div className="v">1<em>:</em>1</div><div className="l">XP per £1 settled · base rate</div></div>
            <div className="stat"><div className="v">8453</div><div className="l">Base chain ID · gasless for you</div></div>
          </div>
          <div style={{ marginTop: 32 }}><LiveBadge /></div>
        </div>
      </div>
    </section>
  );
}
