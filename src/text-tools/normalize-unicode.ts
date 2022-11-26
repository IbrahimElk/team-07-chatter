// @author Barteld Van Nieuwenhove
// @date 2022-10-22

/**
 * Normalizes any stringvalue of specified string to the Unicode NFC format.
 * @param text string to be normalized
 * @returns normalized string
 */
export function normalizeUnicode(text: string): string {
  return text.normalize('NFC');
}
