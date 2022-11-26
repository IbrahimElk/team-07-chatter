// @author: Guust Luyckx
// @date: 2022-10-17
import { expect, describe, it, vi } from 'vitest';
import { cosineDistance, twoNorm } from './find-similar.js';

describe('twoNorm', () => {
  it('calculates correctly', () => {
    expect(twoNorm([0, 0, 0])).toEqual(0);
    expect(twoNorm([1, 0, 0])).toEqual(1);
    expect(twoNorm([2, 0, 0])).toBeCloseTo(2);
  });
});

describe('cosineDistance', () => {
  it('calculates correctly', () => {
    expect(cosineDistance(new Map([['x', 1]]), new Map([['y', 1]]))).toEqual(0);
    expect(
      cosineDistance(
        new Map([
          ['x', 10],
          ['y', 10],
        ]),
        new Map([['x', 10]])
      )
    ).toBeCloseTo(0.7071);
  });
});
