import { expect, vi, describe, it } from 'vitest';
import { decodeHTMlInput } from './decode.js';

describe('test is decodeHTMLInput works correctly', () => {
  it('should decode HTML entities in a string', () => {
    const input = '&ltscript&gtalert(&quotHello &amp world!&quot);&lt/script&gt';
    const expectedOutput = '<script>alert("Hello & world!");</script>';

    const actualOutput = decodeHTMlInput(input);

    expect(actualOutput).toEqual(expectedOutput);
  });

  it('should not modify a string that does not contain HTML entities', () => {
    const input = 'This is a normal string.';
    const expectedOutput = 'This is a normal string.';

    const actualOutput = decodeHTMlInput(input);

    expect(actualOutput).toEqual(expectedOutput);
  });
});
