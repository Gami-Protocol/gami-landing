import { describe, expect, it } from 'vitest';
import {
  ALPHA,
  CONVERT_FLOOR_XP,
  MONTHS,
  R0_GAMI_PER_XP,
  conversionRate,
  gamiConverted,
  niceMax,
  rampSeries,
  usdcSettled,
  xpEarned,
} from './economics';

describe('conversionRate', () => {
  it('starts at R0 and falls monotonically', () => {
    expect(conversionRate(0)).toBeCloseTo(R0_GAMI_PER_XP, 10);
    for (let m = 1; m <= MONTHS; m++) expect(conversionRate(m)).toBeLessThan(conversionRate(m - 1));
  });
  it('halves when supply quadruples (alpha = 0.5)', () => {
    expect(ALPHA).toBe(0.5);
    // supply ratio = 1 + 0.08m; quadruple at m = 37.5
    expect(conversionRate(37.5)).toBeCloseTo(R0_GAMI_PER_XP / 2, 10);
  });
  it('clamps negative months to month zero', () => {
    expect(conversionRate(-3)).toBe(conversionRate(0));
  });
});

describe('xpEarned', () => {
  it('is zero at month zero and strictly increasing', () => {
    expect(xpEarned(0, 800, 1500)).toBe(0);
    for (let m = 1; m <= MONTHS; m++) expect(xpEarned(m, 800, 1500)).toBeGreaterThan(xpEarned(m - 1, 800, 1500));
  });
  it('treats card and play XP as one ledger', () => {
    expect(xpEarned(6, 1000, 0)).toBe(xpEarned(6, 0, 1000));
  });
});

describe('gamiConverted', () => {
  it('pays nothing at or below the convert floor', () => {
    expect(gamiConverted(CONVERT_FLOOR_XP, 1, 0)).toBe(0);
    expect(gamiConverted(CONVERT_FLOOR_XP - 1, 1, 0)).toBe(0);
  });
  it('converts only the chosen share of XP above the floor', () => {
    const xp = CONVERT_FLOOR_XP + 2000;
    expect(gamiConverted(xp, 0.5, 0)).toBeCloseTo(1000 * R0_GAMI_PER_XP, 10);
    expect(gamiConverted(xp, 0, 0)).toBe(0);
  });
  it('clamps the share into 0–1', () => {
    const xp = CONVERT_FLOOR_XP + 100;
    expect(gamiConverted(xp, 7, 0)).toBe(gamiConverted(xp, 1, 0));
    expect(gamiConverted(xp, -1, 0)).toBe(0);
  });
});

describe('usdcSettled', () => {
  it('is linear in spend, months and rule', () => {
    expect(usdcSettled(12, 800, 0.01)).toBeCloseTo(96, 10);
    expect(usdcSettled(6, 800, 0.01)).toBeCloseTo(48, 10);
    expect(usdcSettled(12, 800, 0)).toBe(0);
  });
});

describe('rampSeries', () => {
  it('returns 13 points per series (month 0 through 12)', () => {
    const s = rampSeries({ monthlySpend: 800, monthlyPlayXp: 1500, convertShare: 0.5, merchantRule: 0.01 });
    expect(s.xp).toHaveLength(MONTHS + 1);
    expect(s.gami).toHaveLength(MONTHS + 1);
    expect(s.usdc).toHaveLength(MONTHS + 1);
  });
  it('never produces negative values', () => {
    const s = rampSeries({ monthlySpend: 0, monthlyPlayXp: 0, convertShare: 1, merchantRule: 0.03 });
    [...s.xp, ...s.gami, ...s.usdc].forEach((v) => expect(v).toBeGreaterThanOrEqual(0));
  });
});

describe('niceMax', () => {
  it('rounds up to 1, 2, 5 × 10^n', () => {
    expect(niceMax(0)).toBe(1);
    expect(niceMax(7)).toBe(10);
    expect(niceMax(14)).toBe(20);
    expect(niceMax(42)).toBe(50);
    expect(niceMax(500)).toBe(500);
    expect(niceMax(12345)).toBe(20000);
  });
});
