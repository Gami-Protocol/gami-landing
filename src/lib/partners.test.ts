import { describe, expect, it } from 'vitest';
import { EMPTY_PARTNER, SCHEMA, buildManifest, normaliseOrigin, validatePartner, type PartnerInput } from './partners';

const valid: PartnerInput = {
  ...EMPTY_PARTNER,
  name: 'Yourgame',
  origin: 'yourgame.com',
  description: 'A browser game that pays players for finishing missions.',
  contact: 'dev@yourgame.com',
};

describe('normaliseOrigin', () => {
  it('adds https and strips the path', () => {
    expect(normaliseOrigin('YourGame.com/play?x=1')).toBe('https://yourgame.com');
  });
  it('rejects http, localhost, IPs and bare hosts', () => {
    for (const bad of ['http://yourgame.com', 'localhost:3000', 'https://10.0.0.1', 'intranet', 'https://box.local', '']) {
      expect(normaliseOrigin(bad)).toBeNull();
    }
  });
});

describe('validatePartner', () => {
  it('accepts a complete listing', () => {
    expect(validatePartner(valid)).toEqual({});
  });
  it('flags each bad field', () => {
    const e = validatePartner({ ...valid, name: 'x', origin: 'nope', description: 'short', contact: 'a@b', trigger: 'Mission', xp: '0' });
    expect(Object.keys(e).sort()).toEqual(['contact', 'description', 'name', 'origin', 'trigger', 'xp']);
  });
  it('requires a pool only for USDC rewards', () => {
    expect(validatePartner({ ...valid, asset: 'USDC', poolUsdc: '' }).poolUsdc).toBeDefined();
    expect(validatePartner({ ...valid, asset: 'USDC', poolUsdc: '5000' }).poolUsdc).toBeUndefined();
  });
});

describe('buildManifest', () => {
  it('normalises the origin and omits the pool for XP-only rewards', () => {
    const m = buildManifest(valid);
    expect(m.schema).toBe(SCHEMA);
    expect(m.origin).toBe('https://yourgame.com');
    expect(m.rewards.pool).toBeUndefined();
  });
  it('includes the USDC pool', () => {
    expect(buildManifest({ ...valid, asset: 'USDC', poolUsdc: '5000' }).rewards.pool).toEqual({ asset: 'USDC', amount: 5000 });
  });
});
