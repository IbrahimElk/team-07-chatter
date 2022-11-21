// @author thomasevenepoel
// @date 2022-11-17

/**
 * Returns a new map where the values are ordered in ascending order.
 * @param delta_timings
 * @returns The sorted map
 *
 * @author thomasevenepoel
 */
export function orderDelta(delta_timings: Map<string, number>) {
  return new Map([...delta_timings.entries()].sort((a, b) => b[1] - a[1]));
}
