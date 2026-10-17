/**
 * Token raise model: early-bird USDC tiers and the Meteora DLMM launch pool.
 *
 * Every number in RAISE is an illustrative placeholder. The token contracts are testnet only and any sale
 * is gated (G1-G5 in the gami-token repo), so nothing here moves funds. Replace RAISE with the final terms
 * and the page, the quote and the pool depth all follow.
 */

export interface Tier {
  id: string;
  label: string;
  /** Cumulative USDC raised at which this tier closes. */
  upToUsdc: number;
  /** Bonus tokens as basis points of the tokens bought in this tier. */
  bonusBps: number;
}

export const RAISE = {
  illustrative: true,
  /** Sale price and pool opening price, USDC per GAMI. */
  priceUsdc: 0.05,
  hardCapUsdc: 2_000_000,
  filledUsdc: 0,
  minBuyUsdc: 50,
  maxBuyUsdc: 25_000,
  bonusVestDays: 90,
  tiers: [
    { id: 't1', label: 'Genesis', upToUsdc: 250_000, bonusBps: 2000 },
    { id: 't2', label: 'Early', upToUsdc: 750_000, bonusBps: 1200 },
    { id: 't3', label: 'Builder', upToUsdc: 1_500_000, bonusBps: 600 },
    { id: 't4', label: 'Public', upToUsdc: 2_000_000, bonusBps: 0 },
  ] satisfies Tier[],
  pool: {
    /** Meteora DLMM bin step in basis points: each bin is 0.20% above the last. */
    binStepBps: 20,
    gamiBins: 40,
    usdcBins: 20,
    seedGami: 4_000_000,
    seedUsdc: 100_000,
  },
};

export type Chain = 'base' | 'solana' | 'arc';
export const CHAINS: Array<{ id: Chain; label: string; note: string }> = [
  { id: 'base', label: 'Base', note: 'Home chain. USDC on Base, Uniswap v3 pool.' },
  { id: 'solana', label: 'Solana', note: 'LayerZero OFT. USDC on Solana, Meteora DLMM pool.' },
  { id: 'arc', label: 'Arc', note: "Circle's stablecoin L1. Gas is paid in USDC." },
];

export interface Quote {
  /** USDC actually accepted after the hard cap. */
  accepted: number;
  base: number;
  bonus: number;
  total: number;
  /** USDC per GAMI including the bonus. */
  effectivePrice: number;
  bonusPct: number;
  /** True when the request was trimmed by the hard cap. */
  capped: boolean;
  /** Tier boundaries crossed, in order. */
  legs: Array<{ tier: Tier; usdc: number; base: number; bonus: number }>;
}

/** Quote a USDC purchase when `filled` USDC has already been raised. A buy that spans tiers is priced tier by tier. */
export function quote(amountUsdc: number, filled: number = RAISE.filledUsdc, tiers: Tier[] = RAISE.tiers, price: number = RAISE.priceUsdc): Quote {
  const want = Math.max(0, Number.isFinite(amountUsdc) ? amountUsdc : 0);
  let cursor = Math.max(0, filled);
  let left = want;
  const legs: Quote['legs'] = [];
  for (const tier of tiers) {
    if (left <= 0) break;
    if (cursor >= tier.upToUsdc) continue;
    const usdc = Math.min(left, tier.upToUsdc - cursor);
    const base = usdc / price;
    legs.push({ tier, usdc, base, bonus: (base * tier.bonusBps) / 10_000 });
    cursor += usdc;
    left -= usdc;
  }
  const accepted = want - left;
  const base = legs.reduce((s, l) => s + l.base, 0);
  const bonus = legs.reduce((s, l) => s + l.bonus, 0);
  const total = base + bonus;
  return {
    accepted,
    base,
    bonus,
    total,
    effectivePrice: total > 0 ? accepted / total : price,
    bonusPct: base > 0 ? (bonus / base) * 100 : 0,
    capped: left > 1e-9,
    legs,
  };
}

/** The tier open at `filled` USDC raised, or undefined once the round is full. */
export function currentTier(filled: number = RAISE.filledUsdc, tiers: Tier[] = RAISE.tiers): Tier | undefined {
  return tiers.find((t) => filled < t.upToUsdc);
}

/** Why an amount can't be reserved, or null when it can. */
export function amountError(amountUsdc: number): string | null {
  if (!Number.isFinite(amountUsdc) || amountUsdc <= 0) return 'Enter an amount in USDC.';
  if (amountUsdc < RAISE.minBuyUsdc) return `Minimum is ${RAISE.minBuyUsdc} USDC.`;
  if (amountUsdc > RAISE.maxBuyUsdc) return `Maximum per wallet is ${RAISE.maxBuyUsdc.toLocaleString('en-US')} USDC.`;
  return null;
}

export interface Bin {
  /** Signed offset from the active bin. Positive bins hold GAMI, negative bins hold USDC. */
  index: number;
  price: number;
  gami: number;
  usdc: number;
}

/**
 * Meteora DLMM bins for the launch seed. Price compounds by the bin step per bin, so bin i sits at
 * P0 · (1 + step)^i. GAMI is spread evenly by amount across the bins from P0 upward and USDC evenly
 * across the bins below it, which is Meteora's "Spot" shape. Within a bin the price is constant.
 */
export function dlmmBins(p = RAISE.pool, startPrice = RAISE.priceUsdc): Bin[] {
  const step = 1 + p.binStepBps / 10_000;
  const bins: Bin[] = [];
  for (let i = -p.usdcBins; i < 0; i++) {
    bins.push({ index: i, price: startPrice * Math.pow(step, i), gami: 0, usdc: p.seedUsdc / p.usdcBins });
  }
  for (let i = 0; i < p.gamiBins; i++) {
    bins.push({ index: i, price: startPrice * Math.pow(step, i), gami: p.seedGami / p.gamiBins, usdc: 0 });
  }
  return bins;
}

export interface Depth {
  gamiOut: number;
  usdcSpent: number;
  avgPrice: number;
  endPrice: number;
  /** Average fill price against the opening price, as a percentage. */
  impactPct: number;
  /** USDC left over when the seeded GAMI ran out. */
  unfilled: number;
}

/** Buy GAMI with USDC against the GAMI side of the pool, walking the bins upward. Fees are not modelled. */
export function dlmmBuy(usdc: number, bins: Bin[] = dlmmBins(), startPrice = RAISE.priceUsdc): Depth {
  let left = Math.max(0, usdc);
  let out = 0;
  let spent = 0;
  let endPrice = startPrice;
  for (const b of bins.filter((x) => x.gami > 0).sort((a, c) => a.price - c.price)) {
    if (left <= 0) break;
    const take = Math.min(left, b.gami * b.price);
    out += take / b.price;
    spent += take;
    left -= take;
    endPrice = b.price;
  }
  const avgPrice = out > 0 ? spent / out : startPrice;
  return { gamiOut: out, usdcSpent: spent, avgPrice, endPrice, impactPct: (avgPrice / startPrice - 1) * 100, unfilled: left };
}

export const fmtUsd = (n: number, digits = 0) => '$' + n.toLocaleString('en-US', { maximumFractionDigits: digits, minimumFractionDigits: digits });
export const fmtNum = (n: number, digits = 0) => n.toLocaleString('en-US', { maximumFractionDigits: digits });
