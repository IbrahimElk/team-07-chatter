// @author Barteld Van Nieuwenhove
// @date 2022-10-15
import { expect, describe, it, vi } from 'vitest';
import { Readable } from 'stream';
import { loadDictionary, filterDescriptions, filter } from './dictionary.js';

const ds = 'word1\ndescription1\ndescription1\n\nword2\ndescription2\ndescription2';
// need to agree that we turn \n into space
const dp: Array<[string, string]> = [
  ['word1', 'description1 description1'],
  ['word2', 'description2 description2'],
];

function truncateFirstCharacter(s: string): string {
  return s[0] ?? '';
}

function crossOut(s: string): string {
  return s.replaceAll(/./gm, 'X');
}

function combinedLength(word: string, description: string): number {
  return word.length + description.length;
}

describe('loadDictionary', () => {
  it('loads a processed dictionary', async () => {
    const dr = loadDictionary(Readable.from(ds));
    const a = new Array<[string, string]>();
    for await (const [word, description] of dr) {
      a.push([word, description]);
    }
    expect(a).toEqual(dp);
  });
});

describe('filterDescriptions', () => {
  it('sends the descriptions through a given filter', async () => {
    const dr = filterDescriptions(loadDictionary(Readable.from(ds)), truncateFirstCharacter);
    const a = new Array<[string, string]>();
    for await (const [word, description] of dr) {
      a.push([word, description]);
    }
    expect(a).toEqual(dp.map(([word, description]) => [word, truncateFirstCharacter(description)]));
  });
  it('sends the descriptions through an array of given filters', async () => {
    const dr = filterDescriptions(loadDictionary(Readable.from(ds)), [truncateFirstCharacter, crossOut]);
    const a = new Array<[string, string]>();
    for await (const [word, description] of dr) {
      a.push([word, description]);
    }
    expect(a).toEqual(dp.map(([word, _description]) => [word, 'X']));
  });
});

describe('filter', () => {
  it('sends the [word, description] pair through a given filter', async () => {
    const dr = filter(loadDictionary(Readable.from(ds)), combinedLength);
    const a = new Array<number>();
    for await (const n of dr) {
      a.push(n);
    }
    expect(a).toEqual(dp.map(([word, description]) => word.length + description.length));
  });
});
