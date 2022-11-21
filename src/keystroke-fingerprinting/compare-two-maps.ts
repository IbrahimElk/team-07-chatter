// @author thomasevenepoel
// @date 2022-11-21

import { orderDelta } from './delta-order.js';

/**
 * Compares two vectors and calculates the 'ordering-vector'
 * @param first_map First map to compare
 * @param second_map Second map to compare
 * @returns The ordering vector
 *
 * @author thomasevenepoel
 */
export function CompareTwoMaps(first_map: Map<string, number>, second_map: Map<string, number>): Array<number> {
  const ordered_first_map = orderDelta(first_map);
  const keys_first_map = Array.from(ordered_first_map.keys());
  const ordered_second_map = orderDelta(second_map);
  const keys_second_map = Array.from(ordered_second_map.keys());

  const keys_first_map_common_elements = keys_first_map.filter((value) => keys_second_map.includes(value));
  const keys_second_map_common_elements = keys_second_map.filter((value) => keys_first_map.includes(value));

  const result = new Array<number>();

  for (const substring of keys_first_map_common_elements) {
    const difference = Math.abs(
      keys_first_map_common_elements.indexOf(substring) - keys_second_map_common_elements.indexOf(substring)
    );
    result.push(difference);
  }

  const correct_result = result.reverse();
  return correct_result;
}
