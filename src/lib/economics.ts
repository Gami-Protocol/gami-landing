/**
 * Illustrative XP → GAMI / USDC ramp used by the landing-page chart.
 *
 * These are the same shapes the wallet's `lib/conversion.ts` describes:
 *   - the conversion rate falls as outstanding XP supply grows,
 *     R(t) = R0 · (S_target / S(t))^alpha, so four times the supply halves the rate
 *   - only XP above the convert floor converts
 *   - USDC rewards are a merchant rule on settled spend, not a market
 *
 * The constants here are placeholders for marketing. When the ledger exposes
 * `conversionRate()` and `xpForLevel()`, drive the chart from those instead.
 */

export const MONTHS = 12;
export const CONVERT_FLOOR_XP = 1000;
export const R0_GAMI_PER_XP = 0.01;
export const ALPHA = 0.5;
export const SUPPLY_GROWTH_PER_MONTH = 0.08;
export const STREAK_LIFT_PER_MONTH = 0.015;

export interface RampInputs {
  /** Monthly card spend in GBP. 1 XP per £1 settled at the base rate. */
  monthlySpend: number;
  /** XP per month from quests, missions and yield tasks. */
  monthlyPlayXp: number;
  /** Share (0–1) of convertible XP the user converts to GAMI. */
  convertShare: number;
  /** Merchant USDC rule as a share of settled spend (0–1). */
  merchantRule: number;
}

export interface RampSeries {
  xp: number[];
  gami: number[];
  usdc: number[];
}

/** Conversion rate at month m, given supply growing at a steady monthly rate. */
export function conversionRate(month: number): number {
  const supplyRatio = 1 + SUPPLY_GROWTH_PER_MONTH * Math.max(0, month);
  return R0_GAMI_PER_XP * Math.pow(1 / supplyRatio, ALPHA);
}

/** Cumulative XP after `month` months, with a small streak lift that grows over time. */
export function xpEarned(month: number, monthlySpend: number, monthlyPlayXp: number): number {
  const m = Math.max(0, month);
  return (monthlySpend + monthlyPlayXp) * m * (1 + STREAK_LIFT_PER_MONTH * m);
}

/** GAMI received for converting `share` of the XP above the floor at month `month`. */
export function gamiConverted(xp: number, share: number, month: number): number {
  const convertible = Math.max(0, xp - CONVERT_FLOOR_XP);
  return clamp01(share) * convertible * conversionRate(month);
}

/** Cumulative USDC settled by the merchant rule after `month` months. */
export function usdcSettled(month: number, monthlySpend: number, rule: number): number {
  return monthlySpend * Math.max(0, month) * Math.max(0, rule);
}

export function rampSeries(input: RampInputs): RampSeries {
  const xp: number[] = [];
  const gami: number[] = [];
  const usdc: number[] = [];
  for (let m = 0; m <= MONTHS; m++) {
    const e = xpEarned(m, input.monthlySpend, input.monthlyPlayXp);
    xp.push(e);
    gami.push(gamiConverted(e, input.convertShare, m));
    usdc.push(usdcSettled(m, input.monthlySpend, input.merchantRule));
  }
  return { xp, gami, usdc };
}

/** Round an axis maximum up to 1, 2, 5 × 10^n. */
export function niceMax(value: number): number {
  if (!(value > 0)) return 1;
  const p = Math.pow(10, Math.floor(Math.log10(value)));
  const f = value / p;
  const n = f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10;
  return n * p;
}

function clamp01(v: number): number {
  return Math.min(1, Math.max(0, v));
}
