import { Button, Eyebrow, SectionHead } from '../ui/Primitives';
import { links } from '../../lib/links';
import { launch, shortAddr } from '../../lib/tokenLaunch';
import { useGamiWallet } from './useGamiWallet';

/**
 * The ramp, as three steps the page can show the state of: sign in → fund USDC on Base → swap on Uniswap.
 * Swapping happens on Uniswap, not here. The swap button only exists once the token address is published.
 */
export function RampOnboarding() {
  return (
    <section className="sec band" id="ramp-onboarding">
      <div className="wrap">
        <SectionHead
          eyebrow="RAMP ONBOARDING · CARD TO GAMI"
          title="Sign in. Fund USDC. Swap on Uniswap."
          intro="One Privy account across the wallet, the extension and this page. Card and bank funding is run by the ramp provider inside Privy and lands as USDC on Base in your own wallet. The swap itself happens on Uniswap."
        />
        {links.privyAppId ? <Steps /> : <StepsStatic />}
      </div>
    </section>
  );
}

function Steps() {
  const { ready, authenticated, login, logout, wallet, fund, fundState } = useGamiWallet();
  const funded = fundState === 'submitted' || fundState === 'confirmed';
  return (
    <div className="onb" aria-live="polite">
      <Step n="01" title="Sign in" done={authenticated} active={!authenticated}>
        {!ready ? <p className="note">Loading…</p> : authenticated ? (
          <>
            <p className="note">Wallet on Base <span className="mono">{wallet ? shortAddr(wallet.address) : 'creating…'}</span></p>
            <button type="button" className="linklike" onClick={() => void logout()}>Log out</button>
          </>
        ) : (
          <>
            <button type="button" className="btn" onClick={login}>Sign in with Privy</button>
            <p className="note">Email code, passkey, Google or an existing wallet. No seed phrase.</p>
          </>
        )}
      </Step>
      <Step n="02" title="Fund USDC on Base" done={funded} active={authenticated && !funded}>
        <button type="button" className="btn" onClick={() => void fund()} disabled={!authenticated || !wallet || fundState === 'open'}>
          {fundState === 'open' ? 'Funding…' : 'Add USDC with card or ramp'}
        </button>
        <p className="note">
          {fundState === 'confirmed' ? 'Confirmed. USDC is in your wallet.' : fundState === 'submitted' ? 'Submitted. Allow a few minutes.' : 'Card, Apple Pay, Google Pay or bank, via the ramp provider. They run their own checks.'}
        </p>
      </Step>
      <Step n="03" title="Swap on Uniswap" done={false} active={funded}>
        <SwapButton />
      </Step>
    </div>
  );
}

function StepsStatic() {
  return (
    <div className="onb">
      <Step n="01" title="Sign in" active><p className="note">Privy sign-in is switched on once the app ID is configured for this site.</p></Step>
      <Step n="02" title="Fund USDC on Base"><p className="note">Card and bank funding through the ramp provider inside Privy.</p></Step>
      <Step n="03" title="Swap on Uniswap"><SwapButton /></Step>
    </div>
  );
}

export function SwapButton({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  if (!launch.live) {
    return (
      <>
        <Button size={size} variant="outline" href="#liquidity" aria-disabled="true" onClick={(e) => e.preventDefault()}>Swap opens at launch</Button>
        <p className="note">The contract address is published on Gami's official channels first. This button only appears once it is set here.</p>
      </>
    );
  }
  return (
    <>
      <Button size={size} href={launch.swapUrl}>Swap USDC → GAMI on Uniswap</Button>
      <p className="note">
        Opens Uniswap on Base with GAMI preselected. Verify the address <a className="mono" href={launch.explorerUrl} target="_blank" rel="noopener noreferrer">{shortAddr(launch.address)}</a> against Gami's own channels before you swap.
      </p>
    </>
  );
}

function Step({ n, title, done, active, children }: { n: string; title: string; done?: boolean; active?: boolean; children: React.ReactNode }) {
  return (
    <div className={`onbs${done ? ' done' : ''}${active ? ' active' : ''}`}>
      <Eyebrow>{n} · {done ? 'DONE' : active ? 'NOW' : 'NEXT'}</Eyebrow>
      <h3>{title}</h3>
      <div className="onbb">{children}</div>
    </div>
  );
}
