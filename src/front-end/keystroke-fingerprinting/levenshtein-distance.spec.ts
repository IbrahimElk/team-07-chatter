import { expect, describe, it } from 'vitest';
import { levenshteinDistance } from './levenshtein-distance.js';

describe('Levenshtein Distance', () => {
  it('should return 0 when the strings are the same', () => {
    expect(levenshteinDistance('test', 'test')).toBe(0);
  });
  it('should return 1 when the strings are almost the same', () => {
    expect(levenshteinDistance('test', 'tst')).toBe(1);
    expect(levenshteinDistance('test', 'test ')).toBe(1);
  });
  it('should return 2 when the strings are almost the same', () => {
    expect(levenshteinDistance('test', 'tt')).toBe(2);
  });
  it('should return 3 when the strings are almost the same', () => {
    expect(levenshteinDistance('test', 't')).toBe(3);
  });
});
