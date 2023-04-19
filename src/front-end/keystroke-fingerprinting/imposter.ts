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

// @author thomasevenepoel
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

  let counter = 0;
  const temp_results = new Map<string, number>();
  while (counter + n <= timings.length) {
    // Generate substring
    let substring = '';
    for (let i = counter; i < counter + n; i++) {
      const temp_list = timings[i] as [string, number];
      substring += temp_list[0];
    }

    //Generate delta
    const temp_list_first = timings[counter] as [string, number];
    const temp_list_last = timings[counter + (n - 1)] as [string, number];

    //Check for duplicate

    // check substring in map
    if (temp_results.has(substring)) {
      const temp = temp_results.get(substring);
      if (temp !== undefined) {
        temp_results.set(substring, temp + 1);
      }
    } else {
      temp_results.set(substring, 1);
    }

    const delta = temp_list_last[1] - temp_list_first[1];

    const subresult = [];
    subresult.push(substring, delta);

    if (result.has(substring)) {
      const count_of_substring = temp_results.get(substring) as number;
      const current_delta = result.get(substring) as number;
      // Calculate new average delta.
      const new_delta = (current_delta * (count_of_substring - 1) + delta) / count_of_substring;
      result.set(substring, new_delta);
    } else {
      result.set(substring, delta);
    }
    // Change i
    counter += 1;
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
  const result = numerator / denominator;

  return result;
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
          if (1 < max_number / min_number && max_number / min_number <= t) {
            similar_n_graphs = similar_n_graphs + 1;
          }
        }
      }
    }
  }

  const intermediate_result = similar_n_graphs / map1_common_keys.size;
  const result = 1 - intermediate_result;
  return result;
}
