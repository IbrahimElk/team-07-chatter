// Author : Thomas Evenepoel
// Date: 2022-11-14

import { describe, it, expect } from 'vitest';
import { calculateDelta } from './calculate-delta.js';

describe('calculate-delta', () => {
  it('calculates the delta-time for a 2-gram', () => {
    expect(
      calculateDelta(
        [
          ['h', 0],
          ['e', 90],
        ],
        2
      )
    ).toEqual([['he', 90]]);

    expect(
      calculateDelta(
        [
          ['h', 0],
          ['o', 50],
        ],
        2
      )
    ).toEqual([['ho', 50]]);
  });

  it('calculates the delta-time of a 3-gram', () => {
    expect(
      calculateDelta(
        [
          ['h', 0],
          ['e', 50],
          ['l', 150],
        ],
        3
      )
    ).toEqual([['hel', 150]]);
  });

  it('calculates the delta-time of a 4-gram', () => {
    expect(
      calculateDelta(
        [
          ['h', 0],
          ['e', 50],
          ['l', 150],
          ['l', 250],
        ],
        4
      )
    ).toEqual([['hell', 250]]);
  });
});
