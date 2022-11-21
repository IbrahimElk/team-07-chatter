// @author thomasevenepoel
// @date 2022-11-21

import { orderDelta } from './delta-order.js';

/**
 * Compares two vectors and calculates the 'ordering-vector'. The ordering vector indicates how many positions a given substring in map2 has moved relative to his position in map1
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
