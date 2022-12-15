// @author thomasevenepoel
// @date 2022-11-21

import { describe, it, expect } from 'vitest';
import { aMeasure, rMeasure } from '../keystroke-fingerprinting/imposter.js';

describe('Calculate the R-measure', () => {
  it('Calculates the R-measure of a given ordering vector', () => {
    expect(rMeasure([0, 1, 1, 0])).toEqual(1 / 4); // even case
    expect(rMeasure([3, 1, 2, 2])).toEqual(1); // even case
    expect(rMeasure([3, 1, 2])).toBeCloseTo(6 / 4); // odd case
    expect(rMeasure([1, 2, 3, 4, 5])).toBeCloseTo(15 / 12); // odd case
    expect(rMeasure([])).toEqual(NaN);
    expect(rMeasure([0, 0, 0, 0]));
  });
});

describe('A-measure', () => {
  it('Calculates the A-measure of 2 maps', () => {
    expect(
      aMeasure(
        new Map<string, number>([
          ['he', 90],
          ['el', 50],
        ]),
        new Map<string, number>([
          ['he', 90],
          ['el', 70],
          ['ll', 50],
        ])
      )
    ).toEqual(1 / 2);

    expect(
      aMeasure(
        new Map<string, number>([
          ['he', 90],
          ['el', 50],
          ['ll', 40],
        ]),
        new Map<string, number>([
          ['he', 90],
          ['el', 50],
          ['ll', 80],
        ])
      )
    ).toBeCloseTo(1 / 3);

    expect(
      aMeasure(
        new Map<string, number>([
          ['he', 50],
          ['el', 60],
          ['ll', 70],
          ['lo', 50],
          ['o!', 40],
        ]),
        new Map<string, number>([
          ['he', 50],
          ['el', 60],
          ['ll', 50],
          ['lo', 60],
        ])
      )
    ).toBeCloseTo(1 / 2);
  });
});
