// @author thomasevenepoel
// @date 2022-11-27

import { describe, it, expect } from 'vitest';
import { Detective } from '../keystroke-fingerprinting/imposter.js';

describe('Checks for an imposter', () => {
  it('Compares two maps and indicates that the map is an imposter or not.', () => {
    expect(
      Detective(
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
        ]),
        1,
        0.25,
        0.75
      )
    ).toEqual(true); // TOTAL IS EQUAL TO 1

    expect(
      Detective(
        new Map<string, number>([
          ['he', 150],
          ['el', 170],
        ]),
        new Map<string, number>([
          ['he', 90],
          ['el', 50],
          ['ll', 40],
          ['lo', 60],
        ]),
        1,
        0.25,
        0.75
      )
    );
    expect(
      Detective(
        new Map<string, number>([
          ['he', 90],
          ['el', 50],
          ['ll', 40],
        ]),
        new Map<string, number>([
          ['he', 90],
          ['el', 50],
          ['ll', 80],
        ]),
        1,
        0.25,
        0.75
      )
    );
  });
});
