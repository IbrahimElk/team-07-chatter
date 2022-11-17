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
    ).toEqual(new Map<string, number>([['he', 90]]));

    expect(
      calculateDelta(
        [
          ['h', 0],
          ['o', 50],
        ],
        2
      )
    ).toEqual(new Map<string, number>([['ho', 50]]));

    expect(
      calculateDelta(
        [
          ['h', 0],
          ['e', 90],
          ['l', 140],
          ['l', 190],
          ['o', 220],
        ],
        2
      )
    ).toEqual(
      new Map<string, number>([
        ['he', 90],
        ['el', 50],
        ['ll', 50],
        ['lo', 30],
      ])
    );

    expect(
      calculateDelta(
        [
          ['h', 0],
          ['e', 90],
          ['h', 140],
          ['e', 190],
        ],
        2
      )
    ).toEqual(
      new Map<string, number>([
        ['he', 70], // The average of (90-0) and (190-140)  is equal to 70
        ['eh', 50],
      ])
    );
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
    ).toEqual(new Map<string, number>([['hel', 150]]));
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
    ).toEqual(new Map<string, number>([['hell', 250]]));
  });
});
