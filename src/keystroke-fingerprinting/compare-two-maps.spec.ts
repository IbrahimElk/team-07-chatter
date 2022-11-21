// @author thomasevenepoel
// @date 2022-11-21

import { describe, it, expect } from 'vitest';
import { CompareTwoMaps } from './compare-two-maps.js';

describe('Compare two maps', () => {
  it('Checks if the correct vector is made.', () => {
    expect(
      CompareTwoMaps(
        new Map<string, number>([
          ['he', 90],
          ['el', 50],
          ['ll', 40],
          ['lo', 60],
        ]),
        new Map<string, number>([
          ['he', 30],
          ['el', 60],
          ['ll', 90],
          ['lo', 20],
        ])
      )
    ).toEqual([3, 1, 2, 2]);

    expect(
      CompareTwoMaps(
        new Map<string, number>([
          ['he', 150],
          ['el', 170],
        ]),
        new Map<string, number>([
          ['he', 90],
          ['el', 50],
          ['ll', 40],
          ['lo', 60],
        ])
      )
    ).toEqual([1, 1]);

    expect(CompareTwoMaps(new Map<string, number>([['he', 50]]), new Map<string, number>([['he', 80]]))).toEqual([0]);

    expect(CompareTwoMaps(new Map<string, number>([['he', 50]]), new Map<string, number>([['el', 30]]))).toEqual([]);
  });
});
