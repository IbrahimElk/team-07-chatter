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
