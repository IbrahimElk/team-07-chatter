// @author Barteld Van Nieuwenhove
// @date 2022-10-17

/**
 * Makes Iterable [string, string] lowercase.
 * @param text either an Iterable or an AsyncIterable
 * @returns lower case async generator
 */
export async function* lowerCase(
  text: Iterable<[string, string]> | AsyncIterable<[string, string]>
): AsyncGenerator<[string, string]> {
  for await (const word of text) {
    yield [word[0].toLocaleLowerCase(), word[1].toLocaleLowerCase()];
  }
}
/**
 * Reduces multiple spaces to one for Iterable [string, string].
 * @param text either an Iterable or an AsyncIterable
 * @returns async generator with only single spaces
 */
export async function* normalizeSpaces(
  text: Iterable<[string, string]> | AsyncIterable<[string, string]>
): AsyncGenerator<[string, string]> {
  for await (const word of text) {
    yield [word[0].replace(/\s{2,}/g, ' '), word[1].replace(/\s{2,}/g, ' ')];
  }
}
/**
 * Removes common words from Iterable [string, string], and removes possible preceding space.
 * @param text either an Iterable or an AsyncIterable
 * @returns async generator without common words
 */
const re = /\s(a|to|is|or|and|if|the|it|where|we|either)\b/g;
export async function* removeCommonWords(
  text: Iterable<[string, string]> | AsyncIterable<[string, string]>
): AsyncGenerator<[string, string]> {
  for await (const word of text) {
    yield [word[0].replace(re, ''), word[1].replace(re, '')];
  }
}
const punct = /\.|,|!|\?|;|:/g;
/**
 * Removes punctuation from Iterable [string, string].
 * @param text either an Iterable or an AsyncIterable
 * @returns async generator without punctuation
 */
export async function* removePunctuation(
  text: Iterable<[string, string]> | AsyncIterable<[string, string]>
): AsyncGenerator<[string, string]> {
  for await (const word of text) {
    yield [word[0].replace(punct, ''), word[1].replace(punct, '')];
  }
}
