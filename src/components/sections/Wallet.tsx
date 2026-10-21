import { Hexagon, Icon } from '../ui/Icons';
import { Button, SectionHead } from '../ui/Primitives';
import { links } from '../../lib/links';
import { WalletLedgerMock } from '../mocks/PhoneMock';

const features = [
  { icon: Icon.List, title: 'XP and rewards history', body: 'Every settled payment, quest and conversion as a ledger line. Reversals are shown, not hidden.' },
  { icon: Icon.Swap, title: 'Convert XP to GAMI', body: 'At the live rate the MCP core quotes. The convert floor is 1,000 XP; below it gas and rounding eat the payout.' },
  { icon: Icon.Dollar, title: 'USDC rewards, settled', body: 'Stablecoin rewards land on Base. Solana balances read straight from public RPCs.' },
  { icon: Icon.Wallet, title: 'Card provisioning', body: 'Add the card to your phone wallet from inside the app. Rolling out as issuing partners come online.' },
];

export function Wallet() {
  return (
    <section className="sec" id="wallet">
      <div className="wrap">
        <SectionHead
          eyebrow="GAMI WALLET · iOS AND ANDROID"
          title="One wallet for XP, GAMI and USDC"
          intro="Sign in with an email code or passkey. An embedded wallet on Base is created for you on first sign-in. You never see a seed phrase."
        />
        <div className="pgcta" style={{ marginTop: 32 }}>
          <Button href={links.testFlight}>Test the wallet on TestFlight</Button>
        </div>
        <div className="prod">
          <div className="feat">
            {features.map((f) => (
              <div key={f.title}><f.icon /><div><b>{f.title}</b><p>{f.body}</p></div></div>
            ))}
          </div>
          <div className="art">
            <Hexagon className="ghex" />
            <WalletLedgerMock />
          </div>
        </div>
      </div>
    </section>
  );
}
