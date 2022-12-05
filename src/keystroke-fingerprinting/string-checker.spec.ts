import { describe, it, expect } from 'vitest';
import { colorString, colorWord, theSameString } from './string-checker.js';

describe('string-checker', () => {
  it('checks if two strings are the same', () => {
    expect(theSameString('hello World!', 'hello World!')).toEqual(true);
    expect(theSameString('hello Hell!', 'hello World!'));
  });

  it('checks the right color for a word', () => {
    expect(colorWord('hello', 'hello') === '\x1B[32mhello');
    expect(colorWord('hallo', 'hello') === '\x1B[32mh\x1B[31ma\x1B[32mllo');
    expect(colorWord('h', 'h')).toEqual('\x1B[32mh');
  });
  it('checks the right color for a string', () => {
    expect(colorString('Halloz ik ben Thomas', 'Hallo ik ben Thomas') === '\x1B[31mHalloz\x1B[32m ik ben Thomas');
  });
});
