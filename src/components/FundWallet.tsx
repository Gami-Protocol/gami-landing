import { links } from '../lib/links';
import { useGamiWallet } from './privy/useGamiWallet';

/**
 * Card / ramp funding inside the reserve box. Renders inside PrivyRoot (mounted once by the raise page).
 * Funds the buyer's own wallet with USDC on Base. It does not pay for an allocation.
 */
export default function FundWallet({ amount, chain }: { amount: number; chain: string }) {
  if (!links.privyAppId) {
    return <p className="note">Card funding is not configured yet. Bring USDC to your wallet from an exchange or another chain.</p>;
  }
  return <Funding amount={amount} chain={chain} />;
}

function Funding({ amount, chain }: { amount: number; chain: string }) {
  const { ready, authenticated, login, logout, wallet, fund, fundState } = useGamiWallet();
  const onBase = chain === 'base';

  if (!ready) return <p className="note">Loading wallet…</p>;

  if (!authenticated) {
    return (
      <div className="fund">
        <button type="button" className="btn sm outline" onClick={login}>Log in to buy USDC with a card</button>
        <p className="note">Email code, passkey, Google or an existing wallet. A wallet on Base is created for you if you don't have one.</p>
      </div>
    );
  }

  return (
    <div className="fund">
      <p className="note">Wallet <span className="mono">{wallet ? `${wallet.address.slice(0, 6)}…${wallet.address.slice(-4)}` : 'creating…'}</span></p>
      <button type="button" className="btn sm" onClick={() => void fund(amount)} disabled={!wallet || !onBase || fundState === 'open'}>
        {fundState === 'open' ? 'Funding…' : 'Add USDC with card or ramp'}
      </button>
      {!onBase ? <p className="note">Card funding delivers USDC on Base. Switch the chain above to Base to use it.</p> : null}
      {fundState === 'submitted' ? <p className="note" role="status">Submitted. Funds can take a few minutes to arrive in your wallet.</p> : null}
      {fundState === 'confirmed' ? <p className="note" role="status">Confirmed. USDC is in your wallet on Base.</p> : null}
      <button type="button" className="linklike" onClick={() => void logout()}>Log out</button>
    </div>
  );
}
