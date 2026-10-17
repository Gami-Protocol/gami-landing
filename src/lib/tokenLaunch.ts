/**
 * Launch gate for everything token-facing on the raise page.
 *
 * Mirrors `src/lib/tokenLaunch.ts` in the mobile wallet: there is no placeholder address, and nothing
 * token-facing renders until a well-formed address is set on a supported chain. A pool can be created at
 * any address by anyone, so a page that points at "the GAMI pool" before launch points users at whatever
 * a squatter deployed there.
 */

const env = import.meta.env;

export const SUPPLY_WHOLE = 1_000_000_000;

/** Native USDC on Base, issued by Circle. */
export const BASE_USDC = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
export const BASE_CHAIN_ID = 8453;
export const BASE_CAIP2 = 'eip155:8453' as const;

const ZERO = '0x0000000000000000000000000000000000000000';

export function isValidTokenAddress(raw: string | undefined | null): raw is string {
  const a = (raw ?? '').trim();
  return /^0x[0-9a-fA-F]{40}$/.test(a) && a.toLowerCase() !== ZERO;
}

export interface TokenLaunch {
  live: boolean;
  address: string;
  chain: 'base';
  explorerUrl: string;
  /** Uniswap swap deep link, USDC in → GAMI out, pinned to Base. */
  swapUrl: string;
}

/** Resolve the launch state from the address and chain the build was given. Anything malformed stays pre-launch. */
export function resolveLaunch(address: string | undefined, chain: string | undefined = 'base'): TokenLaunch {
  const chainKey = (chain ?? 'base').trim().toLowerCase();
  if (chainKey !== 'base' || !isValidTokenAddress(address)) {
    return { live: false, address: '', chain: 'base', explorerUrl: '', swapUrl: '' };
  }
  const addr = address.trim();
  return {
    live: true,
    address: addr,
    chain: 'base',
    explorerUrl: `https://basescan.org/token/${addr}`,
    swapUrl: uniswapSwapUrl(addr),
  };
}

/**
 * Points at the swap page rather than a specific pool, so the link stays correct if liquidity moves
 * between v2/v3/v4. Input defaults to USDC because the ramp funds the wallet with USDC.
 */
export function uniswapSwapUrl(tokenAddress: string, input: 'usdc' | 'native' = 'usdc'): string {
  const inputCurrency = input === 'native' ? 'NATIVE' : BASE_USDC;
  return `https://app.uniswap.org/swap?chain=base&inputCurrency=${inputCurrency}&outputCurrency=${tokenAddress}`;
}

export interface SeedPlan {
  gamiWhole: number;
  usdcUnits: number;
  /** USDC per GAMI the pool opens at: SEED_USDC_UNITS / SEED_GAMI_WHOLE, as the forge script computes it. */
  openPrice: number;
  /** Fully diluted valuation at the open price on the fixed 1B supply. */
  fdvUsd: number;
  /** USDC value of both sides of the seed at the open price. */
  depthUsd: number;
  /** Share of the fixed supply placed in the pool. */
  supplyPct: number;
}

/** Same arithmetic as `script/SeedUniswapMainnet.s.sol`: both inputs are whole units; the script applies 1e18 and 1e6. */
export function seedPlan(gamiWhole: number, usdcUnits: number): SeedPlan {
  const g = Math.max(0, gamiWhole);
  const u = Math.max(0, usdcUnits);
  const openPrice = g > 0 ? u / g : 0;
  return { gamiWhole: g, usdcUnits: u, openPrice, fdvUsd: openPrice * SUPPLY_WHOLE, depthUsd: u * 2, supplyPct: (g / SUPPLY_WHOLE) * 100 };
}

const num = (v: string | undefined, fallback: number) => {
  const n = Number((v ?? '').replace(/[,_\s]/g, ''));
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

/** The seed this build describes. Defaults are the runbook's fork-rehearsal numbers; override with the same variables the script reads. */
export const seed = seedPlan(num(env.VITE_SEED_GAMI_WHOLE, 10_000_000), num(env.VITE_SEED_USDC_UNITS, 100_000));

export const launch = resolveLaunch(env.VITE_GAMI_TOKEN_ADDRESS, env.VITE_GAMI_TOKEN_CHAIN);

export const shortAddr = (a: string) => (a ? `${a.slice(0, 6)}…${a.slice(-4)}` : '');
