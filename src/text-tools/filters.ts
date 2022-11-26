// @author Barteld Van Nieuwenhove
// @date 2022-10-10

/**
 * Makes string lowercase.
 * @param text
 * @returns lower case string
 */
export function lowerCase(text: string): string {
  return text.toLocaleLowerCase();
}
/**
 * Reduces multiple spaces to one.
 * @param text
 * @returns string with only single spaces
 */
export function normalizeSpaces(text: string): string {
  return text.replace(/\s{2,}/g, ' ');
}
/**
 * Removes common words from string, and removes possible preceding space.
 * @param text
 * @returns string without common words
 */
const re = /\s(a|to|is|or|and|if|the|it|where|we|either)\b/g;
export function removeCommonWords(text: string): string {
  return text.replaceAll(re, '');
}
const punct = /\.|,|!|\?|;|:/g;
/**
 * Removes punctuation from string.
 * @param text
 * @returns string without punctuation
 */
export function removePunctuation(text: string): string {
  return text.replaceAll(punct, '');
}
