import { describe, expect, it } from 'vitest';
import { BASE_USDC, SUPPLY_WHOLE, isValidTokenAddress, resolveLaunch, seedPlan, uniswapSwapUrl } from './tokenLaunch';

const ADDR = '0x1111111111111111111111111111111111111111';

describe('launch gate', () => {
  it('is pre-launch with no address', () => {
    const l = resolveLaunch(undefined);
    expect(l.live).toBe(false);
    expect(l.swapUrl).toBe('');
    expect(l.explorerUrl).toBe('');
  });
  it.each([
    ['', 'empty'],
    ['0x0000000000000000000000000000000000000000', 'zero address'],
    ['0x1234', 'short'],
    ['1111111111111111111111111111111111111111', 'no 0x'],
    ['0xZZ11111111111111111111111111111111111111', 'non-hex'],
  ])('rejects %s (%s)', (addr) => {
    expect(isValidTokenAddress(addr)).toBe(false);
    expect(resolveLaunch(addr).live).toBe(false);
  });
  it('tolerates surrounding whitespace', () => {
    expect(resolveLaunch(`  ${ADDR}\n`).address).toBe(ADDR);
  });
  it('refuses a chain other than base', () => {
    expect(resolveLaunch(ADDR, 'solana').live).toBe(false);
    expect(resolveLaunch(ADDR, 'BASE').live).toBe(true);
  });
  it('builds a swap link pinned to Base with USDC in and GAMI out', () => {
    const l = resolveLaunch(ADDR);
    expect(l.live).toBe(true);
    expect(l.swapUrl).toBe(`https://app.uniswap.org/swap?chain=base&inputCurrency=${BASE_USDC}&outputCurrency=${ADDR}`);
    expect(l.explorerUrl).toBe(`https://basescan.org/token/${ADDR}`);
    expect(uniswapSwapUrl(ADDR, 'native')).toContain('inputCurrency=NATIVE');
  });
});

describe('seedPlan', () => {
  it('matches the runbook rehearsal: 10,000,000 GAMI + 100,000 USDC opens at $0.01', () => {
    const s = seedPlan(10_000_000, 100_000);
    expect(s.openPrice).toBeCloseTo(0.01, 12);
    expect(s.fdvUsd).toBeCloseTo(0.01 * SUPPLY_WHOLE, 6);
    expect(s.depthUsd).toBe(200_000);
    expect(s.supplyPct).toBeCloseTo(1, 12);
  });
  it('more USDC at the same GAMI raises the open; more GAMI lowers it', () => {
    expect(seedPlan(10_000_000, 250_000).openPrice).toBeCloseTo(0.025, 12);
    expect(seedPlan(20_000_000, 100_000).openPrice).toBeCloseTo(0.005, 12);
  });
  it('never divides by zero', () => {
    expect(seedPlan(0, 100_000).openPrice).toBe(0);
  });
});
