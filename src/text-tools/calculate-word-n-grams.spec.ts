import exp from 'constants';
import { nGramCountingVector, nGramRepresentation } from './calculate-word-n-grams.js';

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

// console.log(nGramRepresentation(['the', 'cat', 'goes', 'to', 'the', 'cat', 'doctor'], 2));
// console.log(nGramCountingVector(['the', 'cat', 'goes', 'to', 'the', 'cat', 'doctor'], 3));
// console.log(nGramRepresentation(['ik', 'ben', 'niet', 'dom', 'hoop', 'ik', 'dan', 'toch'], 4));
// console.log(nGramCountingVector(['ik', 'ben', 'niet', 'dom', 'hoop', 'ik', 'dan', 'toch'], 4));
// console.log(nGramRepresentation('cat', 2));
describe('nGramCountingVector', () => {
  it('can count word bi-grams', () => {
    expect([...nGramCountingVector(['the', 'cat', 'goes', 'to', 'the', 'cat', 'doctor'], 2)]).toEqual([
      ['the cat', 2],
      ['cat goes', 1],
      ['goes to', 1],
      ['to the', 1],
      ['cat doctor', 1],
    ]);
    expect([
      ...nGramCountingVector(['I', 'am', 'a', 'doctor', 'so', 'people', 'call', 'me', 'a', 'doctor'], 2),
    ]).toEqual([
      ['I am', 1],
      ['am a', 1],
      ['a doctor', 2],
      ['doctor so', 1],
      ['so people', 1],
      ['people call', 1],
      ['call me', 1],
      ['me a', 1],
    ]);
  });
});

// Add to existing tests:
describe('nGramRepresentation', () => {
  it('can do simple word bi-grams', () => {
    expect(nGramRepresentation(['the', 'cat', 'goes', 'to', 'the', 'cat', 'doctor'], 2)).toEqual([
      'the cat',
      'cat goes',
      'goes to',
      'to the',
      'the cat',
      'cat doctor',
    ]);
    expect(nGramRepresentation(['I', 'am', 'a', 'doctor', 'so', 'people', 'call', 'me', 'a', 'doctor'], 2)).toEqual([
      'I am',
      'am a',
      'a doctor',
      'doctor so',
      'so people',
      'people call',
      'call me',
      'me a',
      'a doctor',
    ]);
  });
});
