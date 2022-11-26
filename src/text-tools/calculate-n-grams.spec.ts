import { nGramCountingVector, nGramRepresentation } from './calculate-n-grams.js';

describe('nGramCountingVector', () => {
  it('can count simple bi-grams', () => {
    expect([...nGramCountingVector('cat', 2)]).toEqual([
      ['ca', 1],
      ['at', 1],
    ]);
    expect([...nGramCountingVector('cat cat', 2)]).toEqual([
      ['ca', 2],
      ['at', 2],
      ['t ', 1],
      [' c', 1],
    ]);
  });
});

describe('nGramRepresentation', () => {
  it('can do simple bi-grams', () => {
    expect(nGramRepresentation('cat', 2)).toEqual(['ca', 'at']);
    expect(nGramRepresentation('cat cat', 2)).toEqual(['ca', 'at', 't ', ' c', 'ca', 'at']);
    expect(nGramRepresentation('dom', 1)).toEqual(['d', 'o', 'm']);
    expect(nGramRepresentation('dom', 3)).toEqual(['dom']);
  });
});
