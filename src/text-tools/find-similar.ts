// @author: Guust Luyckx & Barteld Van Nieuwenhove
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
  const result: [[string, Map<string, number>], number][] = [];
  let leastSimilar = 0;
  for (let i = 0; i < k; i++) {
    result.push([['', new Map([['', 0]])], 0]);
  }
  for await (const [word, nGramVec] of db) {
    const x = cosineDistance(search, nGramVec);
    if (x > leastSimilar) {
      for (let y = k - 1; y >= 0; y--) {
        const aDistance = result[y];
        if (typeof aDistance !== 'undefined' && x < aDistance[1]) {
          result.splice(y + 1, 0, [[word, nGramVec], x]);
          result.pop();
          break;
        }
      }
      const mostSimilar = result[0];
      if (typeof mostSimilar !== 'undefined' && x > mostSimilar[1]) {
        result.splice(0, 0, [[word, nGramVec], x]);
        result.pop();
      }
      const newLeastSimilar = result[k - 1];
      if (typeof newLeastSimilar !== 'undefined') {
        leastSimilar = newLeastSimilar[1];
      }
    }
  }
  return Promise.resolve(result);
}
