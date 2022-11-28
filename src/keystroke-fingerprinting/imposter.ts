// @author thomasevenepoel
// @date 2022-11-27

import { CompareTwoMaps } from './compare-two-maps.js';
import { aMeasure, rMeasure } from './measures.js';

/**
 * A fucnction that checks if a certain map of keystrokes is from the right person
 * @param map1 A map containing the keystrokes that are stored in the database
 * @param map2 A map containing the keystrokes that are sent
 * @returns A boolean indicating that an map of N-grams is an imposter or not.
 * @author thomasevenepoel
 */
export function Detective(
  map1: Map<string, number>,
  map2: Map<string, number>,
  treshold: number,
  aPercentage: number,
  rPercentage: number
): boolean {
  const a = aMeasure(map1, map2);

  const ordering_vector = CompareTwoMaps(map1, map2);

  const r = rMeasure(ordering_vector);

  if (aPercentage * a + rPercentage * r <= treshold) {
    return true;
  } else {
    return false;
  }
}
