// @author dn
// @date 2022-09-29

import { wordCount, sentenceCount } from './count.js';
import { expect, describe, it, vi } from 'vitest';

describe('wordCount', () => {
  it('counts words', () => {
    expect(wordCount('')).toEqual(0);
    expect(wordCount('hi')).toEqual(1);
    expect(wordCount('  hi  ')).toEqual(1);
    expect(wordCount('Hello there good morning!\nHow are you?')).toEqual(7);
  });
});

describe('sentenceCount', () => {
  it('counts sentences', () => {
    expect(sentenceCount('')).toEqual(0);
    expect(sentenceCount('...')).toEqual(0);
    expect(sentenceCount('A bit. Another bit? More!')).toEqual(3);
    expect(sentenceCount('A bit. Another bit? More')).toEqual(3);
    expect(sentenceCount('A bit. Another   bit?More')).toEqual(3);
  });
});
