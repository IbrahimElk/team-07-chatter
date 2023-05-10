// @author thomasevenepoel
// @date 2022-11-27

// import { CompareTwoMaps } from './compare-two-maps.js';
// import { aMeasure, rMeasure } from './measures.js';

/**
 * A function that checks if a certain map of keystrokes is from the right person
 * @param map_sent_by_user
 *  A map containing the keystrokes that are stored in the database
 * @param map_in_database A map containing the keystrokes that are sent
 * @returns A boolean indicating that an map of N-grams is an imposter or not.
 * @author thomasevenepoel
 */
export function Detective(
  map_in_database: Map<string, number>,
  map_sent_by_user: Map<string, number>,
  maps_of_other_users: Array<Map<string, number>>
): number {
  const tresholdOthers = 0.5;
  const aPercentageOthers = 1;
  const rPercentageOthers = 0;

  let othersTrue = 0;
  let othersFalse = 0;
  for (const other_map of maps_of_other_users) {
    const otherA = aMeasure(map_sent_by_user, other_map);
    const otherV = CompareTwoMaps(map_sent_by_user, other_map);
    const otherR = rMeasure(otherV);
    if (map_sent_by_user.size === 1) {
      if (otherA <= tresholdOthers) {
        othersTrue++;
      } else {
        othersFalse++;
      }
    } else {
      const normalized_a = Math.atan(otherA);
      if (aPercentageOthers * normalized_a + rPercentageOthers * otherR <= tresholdOthers) {
        othersTrue++;
      } else {
        othersFalse++;
      }
    }
  }
  let trustPercentage = 1;
  if (maps_of_other_users.length !== 0) {
    trustPercentage = othersFalse / (othersTrue + othersFalse); // The higher = the more keystrokes don't match -> the more trusted
  }

  //The own keystrokes are more trusted if the percentage is very low
  const a = aMeasure(map_sent_by_user, map_in_database);
  const ordering_vector = CompareTwoMaps(map_sent_by_user, map_in_database);
  const r = rMeasure(ordering_vector);
  const tresholdOwn = 0.59;
  const aPercentageOwn = 0.75;
  const rPercentageOwn = 0.25;
  const normalized_a = Math.atan(a);
  if (map_sent_by_user.size === 1) {
    if (a <= tresholdOwn) {
      return (trustPercentage + 1) / 2;
    } else {
      return trustPercentage / 2;
    }
  } else {
    if (aPercentageOwn * normalized_a + rPercentageOwn * r <= tresholdOwn) {
      return (trustPercentage + 1) / 2;
    } else {
      return trustPercentage / 2;
    }
  }
}

// @author thomasevenepoel & vincentferrate
// @date: 2022-11-14

//IBRAHIM:  FIXME: https://i.imgur.com/Yc3Skto.png , ERROR wnr map 1 element heeft.

/**
 * A function that calculates the delta-time between two keystrokes with variable n-gram.
 * @param timings
 * @param n
 * @returns A map with key value the calculated n-gram and value the time needed for this keystroke.
 */
export function calculateDelta(timings: Array<[string, number]>, n: number): Map<string, number> {
  const result = new Map<string, number>();
  const alpha = 0.1;

  if (timings.length === 0 || timings.length === 1) {
    return result;
  }

  for (let i = n - 1; i < timings.length; i++) {
    let substring = '';
    let j = i - n + 1;
    let max = timings.at(j)?.[1] as number;
    let min = timings.at(j)?.[1] as number;
    while (j < i + 1) {
      const element = timings.at(j) as [string, number];
      substring += element[0];
      if (element[1] < min) {
        min = element[1];
      } else if (element[1] > max) {
        max = element[1];
      }
      j++;
    }
    const newDelta = max - min;
    if (result.has(substring)) {
      const oldMean = result.get(substring) as number;
      const newMean = alpha * newDelta + (1 - alpha) * oldMean;
      result.set(substring, newMean);
    } else {
      result.set(substring, newDelta);
    }
  }
  return result;
}
// @author thomasevenepoel
// @date 2022-11-21

/**
 * Compares two vectors and calculates the 'ordering-vector'. The ordering vector indicates how many positions a given substring in map_in_database has moved relative to his position in map_sent_by_user
 *
 * @param first_map First map to compare with keys the n-grams and values the delta-time
 * @param second_map Second map to compare with keys the n-grams and values the delta-time
 * @returns The ordering vector
 *
 * @author thomasevenepoel
 */
export function CompareTwoMaps(first_map: Map<string, number>, second_map: Map<string, number>): Array<number> {
  const result = new Array<number>();

  const keys_first_map = Array.from(orderDelta(first_map).keys());
  const keys_second_map = Array.from(orderDelta(second_map).keys());

  // Take the common elements and keep the order
  const keys_first_map_common_elements = keys_first_map.filter((value) => keys_second_map.includes(value));
  const keys_second_map_common_elements = keys_second_map.filter((value) => keys_first_map.includes(value));

  for (const substring of keys_first_map_common_elements) {
    const difference = Math.abs(
      keys_first_map_common_elements.indexOf(substring) - keys_second_map_common_elements.indexOf(substring)
    );
    result.push(difference);
  }

  const correct_result = result.reverse();
  return correct_result;
}
// @author thomasevenepoel
// @date 2022-11-17

/**
 * Returns a new map where the values are ordered in ascending order. So the first element has the smallest number, and the last element has the biggest number
 * @param delta_timings A map with keys the n-grams and as value the delta time of that n-gram
 * @returns The sorted map
 *
 * @author thomasevenepoel
 */
export function orderDelta(delta_timings: Map<string, number>) {
  return new Map([...delta_timings.entries()].sort((a, b) => b[1] - a[1])); // stackoverflow
}
// @author thomasevenepoel
// @date 2022-11-21

/**
 * Calculates the R-measure of a list.The R-measure is defined as follows:
 * R = (sum(ordering_list))/((ordering_list.length)²)/2) if (ordering_list)² is even
 * R = (sum(ordering_list))/((ordering_list.length)² - 1 )/2) if (ordering_list)² is odd
 * @param ordering_list The list after running CompareTwoMaps on 2 different maps
 * @returns The R-measure of a given list.
 *
 * @author thomasevenepoel
 */
export function rMeasure(ordering_list: Array<number>): number {
  const numerator = ordering_list.reduce((accumulator, current) => {
    return accumulator + current;
  }, 0);

  let denominator = Math.pow(ordering_list.length, 2);
  if (denominator % 2 === 0) {
    denominator = denominator / 2;
  } else {
    denominator = (denominator - 1) / 2;
  }

  if (numerator === 0 && denominator !== 0) {
    return 0;
  }
  if (denominator === 0) {
    return 0;
  } else {
    return numerator / denominator;
  }
}

/**
 * Calculates the A measure of 2 given maps. The A-measure is defined as follows:
 * A = 1 - (number of similar n-graphs between map_sent_by_user
 *  and map_in_database)/(total number of n-graphs sharen by map_sent_by_user
 *  and map_in_database)
 * @param map_sent_by_user
 *  A first map with the n-grams as key and calcuted delta-time for that n-gram as value
 * @param map_in_database A second map with the n-grams and calculated delta-time for that n-gram
 * @returns The A-measure of 2 given maps
 *
 * @author thomasevenepoel
 */
export function aMeasure(map_sent_by_user: Map<string, number>, map_in_database: Map<string, number>): number {
  const t = 1.4;
  const map1_common_keys = new Map<string, number>();
  const map2_common_keys = new Map<string, number>();
  for (const substring of map_sent_by_user.keys()) {
    if (map_in_database.has(substring)) {
      map1_common_keys.set(substring, map_sent_by_user.get(substring) as number);
    }
  }
  for (const substring of map_in_database.keys()) {
    if (map_sent_by_user.has(substring)) {
      map2_common_keys.set(substring, map_in_database.get(substring) as number);
    }
  }
  let similar_n_graphs = 0;
  for (const key_1 of map1_common_keys.keys()) {
    for (const key_2 of map2_common_keys.keys()) {
      if (key_1 === key_2) {
        const first_number = map1_common_keys.get(key_1);
        const second_number = map2_common_keys.get(key_2);
        if (first_number !== undefined && second_number !== undefined) {
          const max_number = Math.max(first_number, second_number);
          const min_number = Math.min(first_number, second_number);
          if (1 <= max_number / min_number && max_number / min_number <= t) {
            similar_n_graphs = similar_n_graphs + 1;
          }
        }
      }
    }
  }
  let intermediate_result = 0;
  if (map1_common_keys.size !== 0) {
    intermediate_result = similar_n_graphs / map1_common_keys.size;
  }
  const result = 1 - intermediate_result;
  return result;
}
