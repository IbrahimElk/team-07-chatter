// @author thomasevenepoel
// @date 2022-11-27

import { CompareTwoMaps } from './compare-two-maps.js';
import { aMeasure, rMeasure } from './measures.js';

/**
 * A function that checks if a certain map of keystrokes is from the right person
 * @param map_in_database A map containing the keystrokes that are stored in the database
 * @param map_sent_by_user A map containing the keystrokes that are sent
 * @returns A boolean indicating that a person that was sending a message is an imposter or not.
 *
 *
 * @author thomasevenepoel
 */
export function Detective(
  map_sent_by_user: Map<string, number>,
  map_in_database: Map<string, number>,
  treshold: number,
  aPercentage: number,
  rPercentage: number
): boolean {
  const a = aMeasure(map_sent_by_user, map_in_database);
  const ordering_vector = CompareTwoMaps(map_sent_by_user, map_in_database);
  const r = rMeasure(ordering_vector);
  if (map_sent_by_user.size === 1) {
    if (a <= treshold) {
      return true;
    } else {
      return false;
    }
  } else {
    const normalized_a = Math.atan(a);
    if (aPercentage * normalized_a + rPercentage * r <= treshold) {
      return true;
    } else {
      return false;
    }
  }
}
