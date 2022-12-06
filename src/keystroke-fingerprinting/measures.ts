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
 * A = 1 - (number of similar n-graphs between map1 and map2)/(total number of n-graphs sharen by map1 and map2)
 * @param map1 A first map with the n-grams as key and calcuted delta-time for that n-gram as value
 * @param map2 A second map with the n-grams and calculated delta-time for that n-gram
 * @returns The A-measure of 2 given maps
 *
 * @author thomasevenepoel
 */
export function aMeasure(map1: Map<string, number>, map2: Map<string, number>): number {
  const map1_common_keys = new Map<string, number>();
  const map2_common_keys = new Map<string, number>();
  for (const substring of map1.keys()) {
    if (map2.has(substring)) {
      map1_common_keys.set(substring, map1.get(substring) as number);
    }
  }

  for (const substring of map2.keys()) {
    if (map1.has(substring)) {
      map2_common_keys.set(substring, map2.get(substring) as number);
    }
  }
  let counter = 0;
  for (const key_1 of map1_common_keys.keys()) {
    for (const key_2 of map2_common_keys.keys()) {
      if (key_1 === key_2) {
        if (map1_common_keys.get(key_1) === map2_common_keys.get(key_2)) {
          counter = counter + 1;
        }
      }
    }
  }
  const intermediate_result = counter / map1_common_keys.size;
  const result = 1 - intermediate_result;
  return result;
}
