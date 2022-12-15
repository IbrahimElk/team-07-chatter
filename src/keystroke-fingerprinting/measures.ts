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
  // const numerator = ordering_list.reduce((accumulator, current) => {
  //   return accumulator + current;
  // }, 0);
  let numerator = 0;
  for (const item of ordering_list) {
    numerator += item;
  }

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
 * A = 1 - (number of similar n-graphs between map_sent_by_user and map_in_database)/(total number of n-graphs sharen by map_sent_by_user and map_in_database)
 * @param map_sent_by_user A first map with the n-grams as key and calcuted delta-time for that n-gram as value. This map is from the user
 * @param map_in_database A second map with the n-grams and calculated delta-time for that n-gram. This map is from the database
 * @returns The A-measure of 2 given mahjas'ps
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
