//@author Sam Hanot
//@date 2002-10-19
import { loadDictionary } from '../text-tools/dictionary.js';
import { nGramCountingVector, nGramRepresentation } from '../text-tools/calculate-word-n-grams.js';
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
export async function dictionaryLookup(inputDict: Readable, word: string, ngram = 2): Promise<string[]> {
  const descriptions: string[] = [];
  const dictionary = loadDictionary(inputDict);
  for await (const defintion of dictionary) {
    if (defintion[0] === word) {
      descriptions.push(defintion[1]);
    }
  }
  console.log('   n gram representation = ');
  console.log(nGramRepresentation(word, ngram));
  console.log('\n');
  return descriptions;
}

export async function reverseDictionaryLookup(inputDict: Readable, word: string, ngram = 2, words: boolean) {
  const dictionary = loadDictionary(inputDict);
  const ngramdictionary = makeAsyncIterable(await makeNgramArray(dictionary, ngram, words));
  let output;
  if (words) {
    output = await findSimilar(nGramCountingVector(word.split(' '), ngram), ngramdictionary, 8);
  } else {
    output = await findSimilar(nGramCountingVector(word, ngram), ngramdictionary, 8);
  }
  console.log(output);
}

async function makeNgramArray(dict: AsyncGenerator<[string, string]>, ngram: number, words: boolean) {
  const eeray: Array<[string, Map<string, number>]> = [];
  if (words) {
    for await (const defintion of dict) {
      const descriptionArray = defintion[1].split(' ');
      eeray.push([defintion[0], nGramCountingVector(descriptionArray, ngram)]);
    }
  } else {
    for await (const defintion of dict) {
      eeray.push([defintion[0], nGramCountingVector(defintion[1], ngram)]);
    }
  }
  return eeray;
}

async function* makeAsyncIterable<T>(db: Iterable<T>): AsyncGenerator<T> {
  for (const defintion of db) {
    yield await Promise.resolve(defintion);
  }
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

  const inputDict = Readable.from(readFileSync('src/assets/ee.txt'));
  const descriptions = await reverseDictionaryLookup(inputDict, answer, 4, false);
  console.log(descriptions);
  throw new Error('ended');
}
