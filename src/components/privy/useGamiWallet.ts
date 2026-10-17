import { useAddFunds, usePrivy, useWallets } from '@privy-io/react-auth';
import { useState } from 'react';
import { BASE_CAIP2, BASE_USDC } from '../../lib/tokenLaunch';

export type FundState = 'idle' | 'open' | 'submitted' | 'confirmed';

/**
 * The ramp in one hook: who is signed in, which wallet receives funds, and a `fund` that opens Privy's
 * card / ramp flow for USDC on Base. Must render inside PrivyRoot with an app ID set.
 */
export function useGamiWallet() {
  const { ready, authenticated, login, logout } = usePrivy();
  const { wallets } = useWallets();
  const { addFunds } = useAddFunds();
  const [fundState, setFundState] = useState<FundState>('idle');

  const wallet = wallets.find((w) => w.walletClientType === 'privy') ?? wallets[0];

  async function fund(amountUsdc?: number) {
    if (!wallet) return;
    setFundState('open');
    try {
      const r = await addFunds({
        destination: { address: wallet.address, chain: BASE_CAIP2, asset: BASE_USDC },
        fiat: {
          source: { assets: ['usd', 'gbp', 'eur'], defaultAsset: 'usd' },
          defaultAmount: amountUsdc && Number.isFinite(amountUsdc) && amountUsdc > 0 ? String(amountUsdc) : undefined,
          preferredPaymentMethod: 'CREDIT_DEBIT_CARD',
        },
      });
      setFundState(r.method === 'fiat' && r.status === 'confirmed' ? 'confirmed' : 'submitted');
    } catch {
      // Privy rejects when the user closes the flow or the provider errors; neither is actionable here.
      setFundState('idle');
    }
  }

  return { ready, authenticated, login, logout, wallet, fund, fundState };
}
