import { Suspense, lazy, useMemo, useState } from 'react';
import { Button, Eyebrow, SectionHead } from '../components/ui/Primitives';
import { links } from '../lib/links';
import { launch, seed, shortAddr } from '../lib/tokenLaunch';
import { RampOnboarding, SwapButton } from '../components/privy/RampOnboarding';
import {
  CHAINS,
  RAISE,
  amountError,
  currentTier,
  dlmmBins,
  dlmmBuy,
  fmtNum,
  fmtUsd,
  quote,
  type Chain,
} from '../lib/raise';

// Privy is large, so the provider and everything that uses it load only with this page.
const PrivyRoot = lazy(() => import('../components/privy/PrivyRoot'));
const FundWallet = lazy(() => import('../components/FundWallet'));

const PRESETS = [100, 500, 1000, 5000];

const steps = [
  ['01', 'Get the wallet', 'Create a Gami wallet or connect your own. Early buyers are tied to a wallet, not an email.'],
  ['02', 'Hold USDC', 'Bring USDC on Base, Solana, Arc or Robinhood Chain. Stablecoin only, so what you commit is what you see.'],
  ['03', 'Reserve at a tier', 'Your spot is priced in the tier that is open when you commit. Earlier tiers carry a bigger bonus.'],
  ['04', 'Claim at launch', `Base tokens unlock at launch. Bonus tokens vest over ${RAISE.bonusVestDays} days, then trade in the pools below.`],
];

export function Raise() {
  return (
    <main id="top">
      <Suspense fallback={<RaiseHero />}>
        <PrivyRoot>
          <RaiseHero />
          <RampOnboarding />
          <Tiers />
          <Reserve />
        </PrivyRoot>
      </Suspense>
      <section className="sec">
        <div className="wrap">
          <SectionHead
            eyebrow="HOW TO GET IN EARLY"
            title="Four steps, stablecoin only"
            intro="Early means a lower effective price. You pay the same sale price as everyone and get more tokens for it while the cheaper tiers are open."
          />
          <div className="pipe four" style={{ marginTop: 48 }}>
            {steps.map(([n, t, b]) => (
              <div key={n}><small>{n}</small><b>{t}</b><p>{b}</p></div>
            ))}
          </div>
        </div>
      </section>
      <Liquidity />
      <FinePrint />
    </main>
  );
}

function RaiseHero() {
  const filledPct = Math.min(100, (RAISE.filledUsdc / RAISE.hardCapUsdc) * 100);
  const tier = currentTier();
  return (
    <section className="pghead hexbg">
      <div className="wrap pgrid">
        <div>
          <Eyebrow>TOKEN RAISE · PRE-LAUNCH</Eyebrow>
          <h1>Get in early. Buy with USDC. Get more at launch.</h1>
          <p className="intro">
            The raise is tiered: the earlier you commit, the more bonus tokens you get on the same sale price. Liquidity opens at that price on
            Meteora and Uniswap, so what you buy is what the pools start at.
          </p>
          <div className="pgcta">
            <Button size="lg" href="#ramp-onboarding">Start the ramp</Button>
            {launch.live ? (
              <Button size="lg" variant="outline" href={launch.swapUrl}>Swap on Uniswap</Button>
            ) : (
              <Button size="lg" variant="outline" href="#reserve">Reserve an allocation</Button>
            )}
          </div>
        </div>
        <aside className="status" aria-label="Round status">
          <div className="row"><span>Status</span><b className="pill">{launch.live ? '● Live on Base' : 'Opens soon'}</b></div>
          <div className="row"><span>Contract</span><b className="mono" style={{ textTransform: 'none' }}>{launch.live ? <a href={launch.explorerUrl} target="_blank" rel="noopener noreferrer">{shortAddr(launch.address)}</a> : 'Not yet published'}</b></div>
          <div className="row"><span>Sale price</span><b>{fmtUsd(RAISE.priceUsdc, 3)} / GAMI</b></div>
          <div className="row"><span>Open tier</span><b>{tier ? `${tier.label} · +${tier.bonusBps / 100}%` : 'Closed'}</b></div>
          <div className="bar" role="img" aria-label={`${filledPct.toFixed(0)} percent of the cap committed`}><i style={{ width: `${filledPct}%` }} /></div>
          <div className="row"><span>Committed</span><b>{fmtUsd(RAISE.filledUsdc)} of {fmtUsd(RAISE.hardCapUsdc)}</b></div>
          <p className="note">Terms shown are placeholders until the round is cleared to open. No funds are taken on this page.</p>
        </aside>
      </div>
    </section>
  );
}

function Tiers() {
  let prev = 0;
  return (
    <section className="sec band" id="tiers">
      <div className="wrap">
        <SectionHead
          eyebrow="EARLY-BIRD TIERS"
          title="The sooner you commit, the more you get"
          intro="Each tier closes when its USDC is committed. A purchase that spans two tiers is priced tier by tier."
        />
        <div className="tiers">
          {RAISE.tiers.map((t) => {
            const size = t.upToUsdc - prev;
            const from = prev;
            prev = t.upToUsdc;
            const filled = Math.max(0, Math.min(size, RAISE.filledUsdc - from));
            const open = currentTier()?.id === t.id;
            return (
              <div key={t.id} className={`tier${open ? ' open' : ''}`}>
                <small>{t.label}{open ? ' · OPEN FIRST' : ''}</small>
                <div className="bonus">{t.bonusBps ? `+${t.bonusBps / 100}%` : 'Base'}</div>
                <p>{t.bonusBps ? 'bonus tokens' : 'no bonus'}</p>
                <div className="bar sm" role="img" aria-label={`${fmtUsd(filled)} of ${fmtUsd(size)} committed`}><i style={{ width: `${(filled / size) * 100}%` }} /></div>
                <p className="cap">{fmtUsd(size)} · {fmtUsd(from)}–{fmtUsd(t.upToUsdc)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Reserve() {
  const [chain, setChain] = useState<Chain>('base');
  const [text, setText] = useState('1000');
  const amount = Number(text.replace(/,/g, ''));
  const error = amountError(amount);
  const q = useMemo(() => quote(error ? 0 : amount), [amount, error]);
  const chainInfo = CHAINS.find((c) => c.id === chain)!;

  const mailto = `mailto:${links.contact}?subject=${encodeURIComponent('GAMI allocation request')}&body=${encodeURIComponent(
    `Amount: ${amount} USDC\nChain: ${chainInfo.label}${chainInfo.chainId ? ` (${chainInfo.chainId})` : ''}\nWallet: \n`,
  )}`;
  const href = error ? '#reserve' : links.raise || mailto;

  return (
    <section className="sec" id="reserve">
      <div className="wrap">
        <SectionHead
          eyebrow="RESERVE"
          title="Pick a chain, set a USDC amount"
          intro="The quote below is exactly what the tiers pay at today's fill. Reserving does not move funds."
          size="md"
        />
        <div className="buy">
          <div className="cd">
            <fieldset className="chains">
              <legend>Pay with USDC on</legend>
              {CHAINS.map((c) => (
                <label key={c.id} className={chain === c.id ? 'on' : ''}>
                  <input type="radio" name="chain" value={c.id} checked={chain === c.id} onChange={() => setChain(c.id)} />
                  {c.label}
                </label>
              ))}
            </fieldset>
            <p className="note">{chainInfo.note}</p>
            <dl className="facts chainfacts">
              <div><dt>Network</dt><dd>{chainInfo.chainId ? `${chainInfo.label} · ${chainInfo.chainId}` : chainInfo.label}</dd></div>
              <div>
                <dt>USDC</dt>
                <dd className={chainInfo.usdc ? 'mono' : ''}>
                  {chainInfo.usdc ? (
                    <a href={`${chainInfo.explorer}/${chainInfo.id === 'solana' ? 'token' : 'address'}/${chainInfo.usdc}`} target="_blank" rel="noopener noreferrer">
                      {chainInfo.usdc.slice(0, 6)}…{chainInfo.usdc.slice(-4)}
                    </a>
                  ) : (
                    'Not confirmed yet'
                  )}
                </dd>
              </div>
              <div><dt>Get USDC</dt><dd>{chainInfo.getUsdc}</dd></div>
            </dl>

            <label className="fld" htmlFor="amt">Amount (USDC)</label>
            <input
              id="amt"
              className="inp"
              inputMode="decimal"
              value={text}
              onChange={(e) => setText(e.target.value)}
              aria-invalid={!!error}
              aria-describedby="amt-msg"
            />
            <div className="presets">
              {PRESETS.map((p) => <button key={p} type="button" onClick={() => setText(String(p))}>{fmtUsd(p)}</button>)}
            </div>
            <p id="amt-msg" className={error ? 'err' : 'note'}>
              {error ?? `Between ${fmtUsd(RAISE.minBuyUsdc)} and ${fmtUsd(RAISE.maxBuyUsdc)} per wallet.`}
            </p>

            <div className="fundbox">
              <Eyebrow>NO USDC YET?</Eyebrow>
              <p className="note">Buy USDC with a card or bank through a ramp provider. It lands in your own wallet, and you reserve separately.</p>
              <Suspense fallback={<p className="note">Loading…</p>}>
                <FundWallet amount={error ? 0 : amount} chain={chain} />
              </Suspense>
            </div>
          </div>

          <div className="cd quote" aria-live="polite">
            <Eyebrow>YOUR ALLOCATION</Eyebrow>
            <div className="big">{fmtNum(q.total)} <span>GAMI</span></div>
            <dl>
              <div><dt>Base tokens</dt><dd>{fmtNum(q.base)}</dd></div>
              <div><dt>Early-bird bonus</dt><dd className="g">+{fmtNum(q.bonus)} ({q.bonusPct.toFixed(1)}%)</dd></div>
              <div><dt>Effective price</dt><dd>{fmtUsd(q.effectivePrice, 4)}</dd></div>
              <div><dt>Bonus vests over</dt><dd>{RAISE.bonusVestDays} days</dd></div>
            </dl>
            {q.legs.length > 1 ? (
              <p className="note">Spans {q.legs.map((l) => `${l.tier.label} ${fmtUsd(l.usdc)}`).join(' + ')}.</p>
            ) : null}
            <Button
              size="lg"
              href={href}
              aria-disabled={!!error}
              onClick={(e) => { if (error) e.preventDefault(); }}
            >
              {links.raise ? 'Continue to the sale' : 'Request this allocation'}
            </Button>
            <p className="note">{links.raise ? 'Opens the sale app.' : `The sale app is not open yet. This emails ${links.contact} with your amount and chain.`}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Liquidity() {
  const bins = useMemo(() => dlmmBins(), []);
  const [buy, setBuy] = useState(5000);
  const depth = useMemo(() => dlmmBuy(buy, bins), [buy, bins]);

  const W = 720, H = 220, PAD = 8;
  const value = (b: (typeof bins)[number]) => b.usdc + b.gami * b.price;
  const max = Math.max(...bins.map(value));
  const bw = (W - PAD * 2) / bins.length;

  return (
    <section className="sec band" id="liquidity">
      <div className="wrap">
        <SectionHead
          eyebrow="LAUNCH LIQUIDITY · METEORA + UNISWAP"
          title="Two pools open at the sale price"
          intro="Meteora carries the concentrated order book on Solana. Uniswap v3 carries the Base pool. Both start at the same price as the raise, and the Base liquidity position is locked."
        />

        <div className="pool">
          <div className="cd">
            <div className="ptop">
              <div><Eyebrow>METEORA DLMM · SOLANA</Eyebrow><h3>GAMI / USDC</h3></div>
              <span className="pill">Bin step {RAISE.pool.binStepBps / 100}%</span>
            </div>
            <svg viewBox={`0 0 ${W} ${H + 28}`} role="img" aria-label="Liquidity by price bin. USDC sits below the opening price and GAMI above it." className="binchart">
              {bins.map((b, i) => {
                const h = Math.max(2, (value(b) / max) * (H - 16));
                const cls = b.index === 0 ? 'open' : b.index < 0 ? 'usdc' : 'gami';
                return (
                  <rect key={b.index} className={cls} x={PAD + i * bw + 1} y={H - h} width={Math.max(1, bw - 2)} height={h}>
                    <title>{`${fmtUsd(b.price, 4)} · ${b.gami ? `${fmtNum(b.gami)} GAMI` : `${fmtNum(b.usdc)} USDC`}`}</title>
                  </rect>
                );
              })}
              <line x1={PAD} x2={W - PAD} y1={H} y2={H} className="axis" />
              <text x={PAD} y={H + 18} className="tick">{fmtUsd(bins[0].price, 4)}</text>
              <text x={PAD + RAISE.pool.usdcBins * bw} y={H + 18} className="tick mid" textAnchor="middle">{fmtUsd(RAISE.priceUsdc, 4)} open</text>
              <text x={W - PAD} y={H + 18} className="tick" textAnchor="end">{fmtUsd(bins[bins.length - 1].price, 4)}</text>
            </svg>
            <div className="legend2">
              <span><i className="usdc" />USDC below the open price</span>
              <span><i className="open" />Active bin</span>
              <span><i className="gami" />GAMI above it</span>
            </div>
            <dl className="facts">
              <div><dt>Seed</dt><dd>{fmtNum(RAISE.pool.seedGami)} GAMI + {fmtUsd(RAISE.pool.seedUsdc)} USDC</dd></div>
              <div><dt>Shape</dt><dd>Spot, even per bin</dd></div>
              <div><dt>Range</dt><dd>{fmtUsd(bins[0].price, 4)} to {fmtUsd(bins[bins.length - 1].price, 4)}</dd></div>
            </dl>
          </div>

          <div className="cd">
            <Eyebrow>TRY THE DEPTH</Eyebrow>
            <h3>Buy against the pool</h3>
            <label className="fld" htmlFor="depth">Buy with {fmtUsd(buy)} USDC</label>
            <input id="depth" type="range" min={500} max={100000} step={500} value={buy} onChange={(e) => setBuy(Number(e.target.value))} />
            <dl className="facts">
              <div><dt>GAMI out</dt><dd>{fmtNum(depth.gamiOut)}</dd></div>
              <div><dt>Average price</dt><dd>{fmtUsd(depth.avgPrice, 4)}</dd></div>
              <div><dt>Price after</dt><dd>{fmtUsd(depth.endPrice, 4)}</dd></div>
              <div><dt>Impact</dt><dd className={depth.impactPct > 5 ? 'warn' : ''}>{depth.impactPct.toFixed(2)}%</dd></div>
            </dl>
            {depth.unfilled > 0 ? <p className="err">The seeded GAMI runs out. {fmtUsd(depth.unfilled)} would go unfilled.</p> : null}
            <p className="note">Walks the seeded bins upward at their fixed prices. Pool fees and the dynamic fee are not included.</p>
          </div>
        </div>

        <div className="uni cd" id="uniswap">
          <div>
            <Eyebrow>UNISWAP v3 · BASE · HOME CHAIN</Eyebrow>
            <h3>GAMI / USDC, seeded and locked in one broadcast</h3>
            <p>
              The opening price is the ratio of the two seed amounts, exactly as the seed script computes it. The position NFT goes into the liquidity
              locker for four years in the same transaction. Trading fees go to the foundation and the principal cannot move.
            </p>
            <div className="swapbox"><SwapButton /></div>
          </div>
          <dl className="facts">
            <div><dt>Seed</dt><dd>{fmtNum(seed.gamiWhole)} GAMI + {fmtUsd(seed.usdcUnits)} USDC</dd></div>
            <div><dt>Opens at</dt><dd>{fmtUsd(seed.openPrice, 4)} / GAMI</dd></div>
            <div><dt>FDV at open</dt><dd>{fmtUsd(seed.fdvUsd)} · {seed.supplyPct.toFixed(1)}% of supply in pool</dd></div>
            <div><dt>Depth</dt><dd>{fmtUsd(seed.depthUsd)} both sides</dd></div>
            <div><dt>Chain</dt><dd>Base · 8453</dd></div>
            <div><dt>Position manager</dt><dd className="mono">0x03a5…34f1</dd></div>
            <div><dt>Lock</dt><dd>4 years</dd></div>
            <div>
              <dt>Token address</dt>
              <dd className={launch.live ? 'mono' : ''}>
                {launch.live ? <a href={launch.explorerUrl} target="_blank" rel="noopener noreferrer">{shortAddr(launch.address)}</a> : 'Published at launch'}
              </dd>
            </div>
          </dl>
          {Math.abs(seed.openPrice - RAISE.priceUsdc) > 1e-9 ? (
            <p className="err" role="note">
              Pool opens at {fmtUsd(seed.openPrice, 4)} but the sale price is {fmtUsd(RAISE.priceUsdc, 4)}. Align SEED_GAMI_WHOLE / SEED_USDC_UNITS with the sale price before launch day.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function FinePrint() {
  return (
    <section className="sec">
      <div className="wrap">
        <div className="fine">
          <Eyebrow>READ THIS</Eyebrow>
          <ul>
            <li>This is not an offer or a solicitation. The token contracts are on testnet and mainnet launch is gated on audit and legal sign-off.</li>
            <li>Every number on this page is a placeholder in one config file. Final price, caps, tiers, bonus and vesting will be published before the round opens.</li>
            <li>Participation will exclude restricted regions and may require identity checks. Do not send funds to any address from this page.</li>
            <li>Pool figures show the planned seed, not live liquidity. Token prices can fall as well as rise.</li>
            <li>Swapping happens on Uniswap, a third-party application. Gami does not operate the pool, custody funds or set the price you get. Always verify the GAMI contract address against Gami's official channels before swapping; name-squatted tokens are the normal failure mode on launch day.</li>
            <li>Card and bank funding is provided by the ramp provider inside Privy, which applies its own identity checks, limits and fees. GAMI is a utility token for the Gami Protocol; nothing here is investment advice.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
