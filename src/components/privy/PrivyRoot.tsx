import { PrivyProvider } from '@privy-io/react-auth';
import type { ReactNode } from 'react';
import { base } from 'viem/chains';
import { links } from '../../lib/links';

/**
 * One Privy provider for the whole raise page, loaded lazily so the SDK stays out of the main bundle.
 *
 * Same Privy app as the wallet and the extension. Sign-in is email code, passkey or an existing wallet; an
 * embedded wallet on Base is created on first sign-in. The custom auth domain (privy.gamiprotocol.io) and the
 * allowed origins are set in the Privy dashboard, not here: raise.gamiprotocol.io must be on that list.
 */
export default function PrivyRoot({ children }: { children: ReactNode }) {
  if (!links.privyAppId) return <>{children}</>;
  return (
    <PrivyProvider
      appId={links.privyAppId}
      config={{
        loginMethods: ['email', 'passkey', 'google', 'wallet'],
        embeddedWallets: { ethereum: { createOnLogin: 'users-without-wallets' } },
        defaultChain: base,
        supportedChains: [base],
        appearance: { theme: 'dark', accentColor: '#6e3cfb', logo: '/gami-mark.svg' },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
