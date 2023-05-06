// Guust Luyckx
// 22/04/2023

import { expect, vi, describe, it } from 'vitest';
import { encodeHTMlInput } from '../../../src/front-end/encode-decode/encode.js';

describe('test if encodeHTMLInput works correctly', () => {
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
