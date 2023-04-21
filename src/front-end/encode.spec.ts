import { expect, vi, describe, it } from 'vitest';
import { encodeHTMlInput } from './encode.js';

describe('encodeHTMlInput', () => {
  it('should encode HTML entities in a string', () => {
    const input = '<script>alert("Hello & world!");</script>';
    const expectedOutput = '&ltscript&gtalert(&quotHello &amp world!&quot);&lt/script&gt';

    const actualOutput = encodeHTMlInput(input);

    expect(actualOutput).toEqual(expectedOutput);
  });

  it('should not modify a string that does not contain HTML entities', () => {
    const input = 'This is a normal string.';
    const expectedOutput = 'This is a normal string.';

    const actualOutput = encodeHTMlInput(input);

    expect(actualOutput).toEqual(expectedOutput);
  });
});
