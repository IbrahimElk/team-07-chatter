// @author : thomasevenepoel
// @date: 2022-11-14

import { describe, it, expect } from 'vitest';
import { orderDelta } from './delta-order.js';

describe('order-delta', () => {
  it('Order a map by ascending order of the values', () => {
    expect(
      orderDelta(
        new Map<string, number>([
          ['he', 90],
          ['el', 100],
          ['ll', 50],
          ['lo', 30],
        ])
      )
    ).toEqual(
      new Map<string, number>([
        ['el', 100],
        ['he', 90],
        ['ll', 50],
        ['lo', 30],
      ])
    );

    expect(
      orderDelta(
        new Map<string, number>([
          ['he', 90],
          ['el', 20],
          ['ll', 20],
          ['lo', 30],
        ])
      )
    ).toEqual(
      new Map<string, number>([
        ['he', 90],
        ['lo', 30],
        ['el', 20],
        ['ll', 20],
      ])
    );
  });
});
