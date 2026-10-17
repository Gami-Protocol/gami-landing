import { PrivyProvider, useAddFunds, usePrivy, useWallets } from '@privy-io/react-auth';
import { useState } from 'react';
import { links } from '../lib/links';

/**
 * Wallet login and card / ramp funding through Privy. Loaded lazily from /raise so the SDK stays out of the main bundle.
 *
 * Funds the buyer's own wallet with USDC on Base. It does not pay for an allocation: reserving stays a separate step
 * until the sale is cleared. Card and ramp providers are enabled in the Privy dashboard, and they run their own checks.
 */

/** Native USDC on Base, issued by Circle. */
const BASE_USDC = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
const BASE_CAIP2 = 'eip155:8453';

export default function FundWallet({ amount, chain }: { amount: number; chain: string }) {
  if (!links.privyAppId) {
    return <p className="note">Card funding is not configured yet. Bring USDC to your wallet from an exchange or another chain.</p>;
  }
  return (
    <PrivyProvider
      appId={links.privyAppId}
      config={{
        loginMethods: ['email', 'google', 'wallet'],
        embeddedWallets: { ethereum: { createOnLogin: 'users-without-wallets' } },
        appearance: { theme: 'dark', accentColor: '#6e3cfb' },
      }}
    >
      <Funding amount={amount} chain={chain} />
    </PrivyProvider>
  );
}

function Funding({ amount, chain }: { amount: number; chain: string }) {
  const { ready, authenticated, login, logout } = usePrivy();
  const { wallets } = useWallets();
  const { addFunds } = useAddFunds();
  const [state, setState] = useState<'idle' | 'open' | 'done'>('idle');

  const wallet = wallets.find((w) => w.walletClientType === 'privy') ?? wallets[0];
  const onBase = chain === 'base';

  async function fund() {
    if (!wallet) return;
    setState('open');
    try {
      await addFunds({
        destination: { address: wallet.address, chain: BASE_CAIP2, asset: BASE_USDC },
        fiat: { source: { assets: ['usd'], defaultAsset: 'usd' }, defaultAmount: Number.isFinite(amount) && amount > 0 ? String(amount) : undefined },
      });
      setState('done');
    } catch {
      // Privy rejects when the user closes the flow or the provider errors; neither is actionable here.
      setState('idle');
    }
  }

  if (!ready) return <p className="note">Loading wallet…</p>;

  if (!authenticated) {
    return (
      <div className="fund">
        <button type="button" className="btn sm outline" onClick={login}>Log in to buy USDC with a card</button>
        <p className="note">Email, Google or an existing wallet. A wallet is created for you if you don't have one.</p>
      </div>
    );
  }

  return (
    <div className="fund">
      <p className="note">Wallet <span className="mono">{wallet ? `${wallet.address.slice(0, 6)}…${wallet.address.slice(-4)}` : 'creating…'}</span></p>
      <button type="button" className="btn sm" onClick={() => void fund()} disabled={!wallet || !onBase || state === 'open'}>
        {state === 'open' ? 'Funding…' : 'Add USDC with card or ramp'}
      </button>
      {!onBase ? <p className="note">Card funding delivers USDC on Base. Switch the chain above to Base to use it.</p> : null}
      {state === 'done' ? <p className="note" role="status">Submitted. Funds can take a few minutes to arrive in your wallet.</p> : null}
      <button type="button" className="linklike" onClick={() => void logout()}>Log out</button>
    </div>
  );
}
