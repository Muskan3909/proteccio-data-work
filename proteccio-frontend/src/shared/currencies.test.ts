import { describe, expect, it } from 'vitest';
import { normalizeCurrency } from './currencies';

describe('normalizeCurrency', () => {
  it('normalizes uppercase values to the lowercase option format', () => {
    expect(normalizeCurrency('USD')).toBe('usd');
    expect(normalizeCurrency('usd')).toBe('usd');
    expect(normalizeCurrency('EUR')).toBe('eur');
  });

  it('falls back to default when the value is empty', () => {
    expect(normalizeCurrency('')).toBe('usd');
    expect(normalizeCurrency(undefined as any)).toBe('usd');
  });
});
