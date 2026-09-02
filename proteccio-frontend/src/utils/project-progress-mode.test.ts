import { describe, expect, it } from 'vitest';
import { normalizeProjectProgressMode } from './project-progress-mode';

describe('normalizeProjectProgressMode', () => {
  it('keeps the selected mode when only one is true', () => {
    expect(
      normalizeProjectProgressMode({
        use_manual_progress: true,
        use_weighted_progress: false,
        use_time_progress: false,
      })
    ).toEqual({
      use_manual_progress: true,
      use_weighted_progress: false,
      use_time_progress: false,
    });
  });

  it('prioritizes the first enabled mode when multiple are true', () => {
    expect(
      normalizeProjectProgressMode({
        use_manual_progress: true,
        use_weighted_progress: true,
        use_time_progress: true,
      })
    ).toEqual({
      use_manual_progress: true,
      use_weighted_progress: false,
      use_time_progress: false,
    });
  });

  it('clears all modes when nothing is selected', () => {
    expect(
      normalizeProjectProgressMode({
        use_manual_progress: false,
        use_weighted_progress: false,
        use_time_progress: false,
      })
    ).toEqual({
      use_manual_progress: false,
      use_weighted_progress: false,
      use_time_progress: false,
    });
  });
});
