// @author Barteld Van Nieuwenhove
// @date 2022-10-15
import type { Readable } from 'stream';

/**
 * Loads a “processed dict file” and make it available as an AsyncGenerator<[string, string]>
 * A processed dict has "\n\n" between each word and "\n" between the descriptions of a word. eg "word\ndesc1\ndesc2\n\nword\ndesc1..."
 * @param input a processed dict file
 */
export async function* loadDictionary(input: Readable): AsyncGenerator<[string, string]> {
  let word = '';
  let description = '';
  input.setEncoding('utf8');
  const dict = input.read() as string;
  const words = dict.split('\n\n');
  for await (const i of words) {
    const descriptions = i.split('\n');
    let counter = 0;
    for await (const j of descriptions) {
      // this is the first description
      if (counter === 1) {
        description = description + j;
      }
      // this is the nth description
      else if (counter > 1) {
        description += ' ' + j;
      }
      // this is the actual word
      else if (counter === 0) {
        word = j;
      }
      counter += 1;
    }
    //return the value and reset the description
    yield [word, description];
    description = '';
  }
}

/**
 * Runs a number of filters, taking string to string, on the description fields (one after another)
 * @param db Takes an array of two strings
 * @param filters Defines the functions which will filter a db
 */
export async function* filterDescriptions(
  db: AsyncIterable<[string, string]>,
  filters: ((description: string) => string) | Array<(description: string) => string>
): AsyncGenerator<[string, string]> {
  for await (const i of db) {
    const word = i[0];
    let description = i[1];
    //if multiple filter functions are called
    if (filters instanceof Array) {
      filters.forEach((element) => {
        description = element(description);
      });
    }
    //if only one filter function is called
    else {
      description = filters(description);
    }
    yield [word, description];
  }
}

/**
 * Run a filter on our [word, description] to an arbitrary output type T (e.g, filtering from [string, string] to [string, Map<string, number>] with nGramCountingVector): * @param db Takes an array of two strings, representing a word and its description
 * @param filters Defines the functions which will filter the db
 */
export async function* filter<T>(
  db: AsyncIterable<[string, string]>,
  filter: (word: string, description: string) => T
): AsyncGenerator<T> {
  for await (const i of db) {
    yield filter(i[0], i[1]);
  }
}
