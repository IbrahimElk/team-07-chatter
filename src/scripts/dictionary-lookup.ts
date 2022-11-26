//@author Sam Hanot
//@date 2002-10-19
import { loadDictionary } from '../text-tools/dictionary.js';
import { nGramRepresentation } from '../text-tools/calculate-word-n-grams.js';
import { normalizeSpaces, removeCommonWords, removePunctuation } from '../text-tools/filters.js';
import { Readable } from 'stream';
import { readFileSync } from 'fs';
import { findSimilar } from '../text-tools/find-similar.js';

/**
 *
 * @param word the word you want to look up in the dictionary
 * @param inputDict the dictionary that is going to be searched
 * @returns all the description of the word you are looking for
 */
export async function dictionaryLookup(word: string, ngram = 2, inputDict: Readable): Promise<string[]> {
  const descriptions: string[] = [];
  const dictionary = loadDictionary(inputDict);
  for await (const w of dictionary) {
    if (w[0] === word) {
      descriptions.push(w[1]);
    }
  }
  console.log('   n gram representation = ');
  console.log(nGramRepresentation(word, ngram));
  console.log('\n');
  return descriptions;
}

if (process.argv[2] !== undefined) {
  let answer = process.argv[2] || '';

  for (let i = 3; i < process.argv.length; i++) {
    const addition = process.argv[i];
    if (addition !== undefined) {
      answer = answer + ' ' + addition;
    }
  }
  console.log(answer);

  const inputDict = Readable.from(readFileSync('src/assets/baby-dictionary.txt'));
  const descriptions = await dictionaryLookup(answer, 2, inputDict);
  console.log(descriptions);
  throw new Error('ended');
}
