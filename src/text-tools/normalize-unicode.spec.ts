// @author Barteld Van Nieuwenhove
// @date 2022-10-22

import { normalizeUnicode } from './normalize-unicode.js';

describe('normalizeUnicode', () => {
  it('normalize unicode', () => {
    expect(normalizeUnicode('\u{00F1}')).toEqual('\u{00F1}');
    expect(normalizeUnicode('\u{006e}\u{0303}')).toEqual('\u{00F1}');
  });
});
