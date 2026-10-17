import { describe, expect, it } from 'vitest';
import { CHAINS, RAISE, amountError, currentTier, dlmmBins, dlmmBuy, quote } from './raise';

describe('quote', () => {
  it('applies the first-tier bonus inside one tier', () => {
    const q = quote(1000, 0);
    expect(q.base).toBeCloseTo(1000 / RAISE.priceUsdc);
    expect(q.bonusPct).toBeCloseTo(20);
    expect(q.total).toBeCloseTo(q.base * 1.2);
    expect(q.effectivePrice).toBeCloseTo(RAISE.priceUsdc / 1.2);
    expect(q.capped).toBe(false);
  });

  it('prices a buy that crosses a tier boundary tier by tier', () => {
    const q = quote(20_000, 240_000);
    expect(q.legs.map((l) => l.tier.id)).toEqual(['t1', 't2']);
    expect(q.legs[0].usdc).toBe(10_000);
    expect(q.legs[1].usdc).toBe(10_000);
    expect(q.bonus).toBeCloseTo((10_000 / RAISE.priceUsdc) * 0.2 + (10_000 / RAISE.priceUsdc) * 0.12);
  });

  it('gives no bonus in the public tier', () => {
    const q = quote(500, 1_600_000);
    expect(q.bonus).toBe(0);
    expect(q.effectivePrice).toBeCloseTo(RAISE.priceUsdc);
  });

  it('trims a buy at the hard cap', () => {
    const q = quote(5000, RAISE.hardCapUsdc - 1000);
    expect(q.accepted).toBe(1000);
    expect(q.capped).toBe(true);
  });

  it('treats bad input as zero', () => {
    expect(quote(NaN).total).toBe(0);
    expect(quote(-5).total).toBe(0);
  });
});

describe('currentTier / amountError', () => {
  it('finds the open tier', () => {
    expect(currentTier(0)?.id).toBe('t1');
    expect(currentTier(250_000)?.id).toBe('t2');
    expect(currentTier(RAISE.hardCapUsdc)).toBeUndefined();
  });
  it('enforces min and max', () => {
    expect(amountError(0)).not.toBeNull();
    expect(amountError(RAISE.minBuyUsdc - 1)).not.toBeNull();
    expect(amountError(RAISE.maxBuyUsdc + 1)).not.toBeNull();
    expect(amountError(RAISE.minBuyUsdc)).toBeNull();
  });
});

describe('dlmmBins', () => {
  const bins = dlmmBins();
  it('seeds exactly the configured amounts', () => {
    expect(bins.reduce((s, b) => s + b.gami, 0)).toBeCloseTo(RAISE.pool.seedGami);
    expect(bins.reduce((s, b) => s + b.usdc, 0)).toBeCloseTo(RAISE.pool.seedUsdc);
  });
  it('compounds price by the bin step and starts at the sale price', () => {
    const step = 1 + RAISE.pool.binStepBps / 10_000;
    const zero = bins.find((b) => b.index === 0)!;
    const one = bins.find((b) => b.index === 1)!;
    expect(zero.price).toBeCloseTo(RAISE.priceUsdc);
    expect(one.price / zero.price).toBeCloseTo(step);
  });
  it('holds USDC only below the open price and GAMI only at or above it', () => {
    for (const b of bins) {
      if (b.index < 0) expect(b.gami).toBe(0);
      else expect(b.usdc).toBe(0);
    }
  });
});

describe('dlmmBuy', () => {
  it('fills at the opening price inside the first bin', () => {
    const first = RAISE.pool.seedGami / RAISE.pool.gamiBins;
    const d = dlmmBuy(100);
    expect(d.gamiOut).toBeCloseTo(100 / RAISE.priceUsdc);
    expect(d.gamiOut).toBeLessThan(first);
    expect(d.impactPct).toBeCloseTo(0);
  });
  it('moves price up as bins are consumed', () => {
    const small = dlmmBuy(1_000);
    const big = dlmmBuy(50_000);
    expect(big.endPrice).toBeGreaterThan(small.endPrice);
    expect(big.impactPct).toBeGreaterThan(small.impactPct);
  });
  it('reports what the pool could not fill', () => {
    const d = dlmmBuy(10_000_000);
    expect(d.unfilled).toBeGreaterThan(0);
    expect(d.gamiOut).toBeCloseTo(RAISE.pool.seedGami);
  });
});

describe('CHAINS', () => {
  it('has unique ids and EVM chain IDs', () => {
    expect(new Set(CHAINS.map((c) => c.id)).size).toBe(CHAINS.length);
    const ids = CHAINS.map((c) => c.chainId).filter((n) => n !== null);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('lists Arc with its native USDC predeploy and Robinhood Chain without a made-up USDC', () => {
    const arc = CHAINS.find((c) => c.id === 'arc')!;
    expect(arc.chainId).toBe(5042);
    expect(arc.usdc).toBe('0x3600000000000000000000000000000000000000');
    const rh = CHAINS.find((c) => c.id === 'robinhood')!;
    expect(rh.chainId).toBe(4663);
    expect(rh.usdc).toBeNull();
  });
  it('uses well-formed EVM addresses', () => {
    for (const c of CHAINS.filter((x) => x.chainId !== null && x.usdc)) expect(c.usdc).toMatch(/^0x[0-9a-fA-F]{40}$/);
  });
});
