// @author Barteld Van Nieuwenhove
// @date 2022-10-10
import { expect, describe, it, vi } from 'vitest';
import { lowerCase, normalizeSpaces, removeCommonWords, removePunctuation } from './filters.js';

describe('lowerCase', () => {
  it('works', () => {
    expect(lowerCase('SOme STRIng')).toEqual('some string');
  });
});

describe('normalizeSpaces', () => {
  it('works', () => {
    expect(normalizeSpaces('    SOme      STRIng   ')).toEqual(' SOme STRIng ');
  });
});

describe('removeCommonWords (stop words)', () => {
  // We need to check which stop words we want to remove...
  // But we use this as our current minimal assumption:
  it('works on lowercase common words', () => {
    expect(removeCommonWords('Hell is where we belong and Heaven Is Where We Are')).toEqual(
      'Hell belong Heaven Is Where We Are'
    );
  });
});

describe('removePunctuation', () => {
  it('works', () => {
    expect(removePunctuation('Hi, Billy! ::')).toEqual('Hi Billy ');
  });
});
