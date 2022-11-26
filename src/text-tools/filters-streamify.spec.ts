// @author Barteld Van Nieuwenhove
// @date 2022-10-22
import { expect, describe, it, vi } from 'vitest';
import { Readable } from 'stream';
import { lowerCase, normalizeSpaces, removeCommonWords, removePunctuation } from './filters-streamify.js';

describe('lowerCase', () => {
  it('works', async () => {
    const a = lowerCase(Readable.from([['SOme STRIng', 'SOme STRIng']]));
    const b = new Array<[string, string]>();
    for await (const [word, description] of a) {
      b.push([word, description]);
    }
    expect(b).toEqual([['some string', 'some string']]);
  });
});

describe('normalizeSpaces', () => {
  it('normalizes spaces', async () => {
    const a = normalizeSpaces(Readable.from([['    SOme      STRIng   ', '    SOme      STRIng   ']]));
    const b = new Array<[string, string]>();
    for await (const [word, description] of a) {
      b.push([word, description]);
    }
    expect(b).toEqual([[' SOme STRIng ', ' SOme STRIng ']]);
  });
});

describe('removeCommonWords (stop words)', () => {
  // We need to check which stop words we want to remove...
  // But we use this as our current minimal assumption:
  it('works on lowercase common words', async () => {
    const a = removeCommonWords(
      Readable.from([
        ['Hell is where we belong and Heaven Is Where We Are', 'Hell is where we belong and Heaven Is Where We Are'],
      ])
    );
    const b = new Array<[string, string]>();
    for await (const [word, description] of a) {
      b.push([word, description]);
    }
    expect(b).toEqual([['Hell belong Heaven Is Where We Are', 'Hell belong Heaven Is Where We Are']]);
  });
});

describe('removePunctuation', () => {
  it('works', async () => {
    const a = removePunctuation(Readable.from([['Hi, Billy! ::', 'Hi, Billy! ::']]));
    const b = new Array<[string, string]>();
    for await (const [word, description] of a) {
      b.push([word, description]);
    }
    expect(b).toEqual([['Hi Billy ', 'Hi Billy ']]);
  });
});
