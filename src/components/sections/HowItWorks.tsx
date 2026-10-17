import { Icon } from '../ui/Icons';
import { Eyebrow, SectionHead } from '../ui/Primitives';

const steps = [
  { n: '01 · PAY', title: 'You pay', icon: Icon.Card, body: 'Link a card in the wallet. Shop anywhere the card works. Nothing changes at checkout.', code: ['event', 'payment.settled'] },
  { n: '02 · VERIFY', title: 'Gami verifies', icon: Icon.Shield, body: 'The settled amount arrives as a verified action. Refunds and chargebacks reverse the XP they earned.', code: ['action', 'card.spend · 186.40 GBP'] },
  { n: '03 · MINT', title: 'XP mints', icon: Icon.Bolt, body: "The MCP core applies the merchant's rule and credits XP to your ledger in real time. Streaks multiply it.", code: ['xp', '+186 · streak 1.2x'] },
  { n: '04 · RAMP', title: 'You ramp', icon: Icon.Ramp, body: 'Hold XP, convert it to GAMI at the live rate, or take rewards as USDC. Wallet and extension both show the balance.', code: ['convert', 'xp → gami @ rate(t)'] },
];

export function HowItWorks() {
  return (
    <section className="sec band" id="how">
      <div className="wrap">
        <SectionHead
          eyebrow="HOW IT WORKS"
          title="From card tap to XP in four steps"
          intro="The card is the input. The protocol never touches the payment itself; it reads the settled event and routes the reward."
        />
        <div className="flow">
          {steps.map((s) => (
            <article className="step" key={s.n}>
              <s.icon className="ic" />
              <div className="n">{s.n}</div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
              <code><b>{s.code[0]}</b> {s.code[1]}</code>
            </article>
          ))}
        </div>

        <div className="dist" aria-label="How a settled payment is distributed">
          <div className="row">
            <div>
              <Eyebrow>DISTRIBUTION · ONE £100 PAYMENT</Eyebrow>
              <div className="amt" style={{ marginTop: 12 }}>£2.00<small>Merchant reward budget · 2% rule</small></div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="amt" style={{ fontSize: 36, lineHeight: '36px' }}>200 XP<small>Minted to the payer</small></div>
            </div>
          </div>
          <div className="splitbar" role="img" aria-label="70 percent to the payer as XP, 20 percent to the quest pool as GAMI, 10 percent to protocol fees in USDC">
            <div className="a">70% · PAYER</div><div className="b">20% · POOL</div><div className="c">10%</div>
          </div>
          <div className="legend">
            <div><b><i style={{ background: '#9c6cff' }} />Payer · XP</b><p>Credited the moment the payment settles. Yours to hold, convert or spend on quests.</p></div>
            <div><b><i style={{ background: '#ffeb55' }} />Quest pool · GAMI</b><p>Funds bonus quests on the same merchant. Paid out to whoever completes them.</p></div>
            <div><b><i style={{ background: '#4ade80' }} />Protocol · USDC</b><p>Routing fee, settled in USDC on Base. Gami holds no client money.</p></div>
          </div>
          <p className="note">Example split. You write the rule; the protocol does the rest.</p>
        </div>
      </div>
    </section>
  );
}
