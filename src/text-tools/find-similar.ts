// @author: Guust Luyckx
// @date: 2022-10-17

import { isNumberObject } from 'util/types';
import { resourceLimits } from 'worker_threads';

/**
 * Calculates the cosine distance between two factors
 * @param a map with numbers as values
 * @param b map with numbers as values
 * @returns the cosine distance
 */

export function cosineDistance(a: Map<string, number>, b: Map<string, number>): number {
  const length_a = a.size;
  const length_b = b.size;
  let top = 0;
  let bota = 0;
  let botb = 0;
  for (const key of a.keys()) {
    const aValue = a.get(key);
    const bValue = b.get(key);
    if (aValue !== undefined && bValue !== undefined) {
      top += aValue * bValue;
    }
  }
  for (const key of a.keys()) {
    const aValue = a.get(key);
    if (aValue !== undefined) {
      bota += aValue * aValue;
    }
  }
  bota = Math.sqrt(bota);
  for (const key of b.keys()) {
    const bValue = b.get(key);
    if (bValue !== undefined) {
      botb += bValue * bValue;
    }
  }
  botb = Math.sqrt(botb);
  if (bota === 0 || botb === 0) {
    return 0;
  }
  return top / (bota * botb);
}

/**
 * Calculates the twonorm of an array
 * @param a array
 * @returns the twonorm
 */

export function twoNorm(a: Array<number>): number {
  let result = 0;
  for (const x of a.values()) {
    result += x * x;
  }
  return Math.sqrt(result);
}

/**
 *
 * @param search map with string and number
 * @param db AsyncIterable of array of sting and map with string vand number
 * @param k number bigger then 0
 * @returns promis
 */
export async function findSimilar(
  search: Map<string, number>,
  db: AsyncIterable<[string, Map<string, number>]>,
  k: number
): Promise<[[string, Map<string, number>], number][]> {
  const result: [[string, Map<string, number>], number][] = [[['test', new Map([['test', 10]])], -1]];
  let counter = 0;
  for await (const [word, nGramVec] of db) {
    const x = cosineDistance(search, nGramVec);
    counter += 1;
    if (counter <= k) {
      result.push([[word, nGramVec], x]);
    } else {
      let min = Infinity;
      let index = 0;
      for (let y = 0; y < result.length - 1; y++) {
        const inbetween = result[y];
        if (typeof inbetween !== 'undefined') {
          if (inbetween[1] < min) {
            min = inbetween[1];
            index = y;
          }
        }
      }
      result[index] = [[word, nGramVec], x];
    }
  }
  return Promise.resolve(result);
}
