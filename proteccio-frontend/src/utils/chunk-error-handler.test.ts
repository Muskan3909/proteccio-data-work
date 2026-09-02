import { describe, expect, it } from 'vitest';
import { shouldTriggerChunkReload, isChunkLoadFailureError } from './chunk-error-handler';

describe('chunk error recovery detection', () => {
  it('treats real JS chunk failures as recoverable', () => {
    expect(
      shouldTriggerChunkReload('Failed to fetch dynamically imported module: /assets/js/HomePage.js')
    ).toBe(true);

    expect(shouldTriggerChunkReload('Loading chunk 1234 failed.')).toBe(true);
    expect(shouldTriggerChunkReload('Loading CSS chunk 1234 failed.')).toBe(true);
  });

  it('ignores Vite CSS preload warnings that are not fatal module failures', () => {
    expect(
      shouldTriggerChunkReload('Unable to preload CSS for /assets/css/HomePage-CQvbr0h_.css')
    ).toBe(false);

    expect(isChunkLoadFailureError(new Error('Unable to preload CSS for /assets/css/HomePage.css'))).toBe(false);
  });
});
