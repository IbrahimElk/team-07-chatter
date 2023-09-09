/**
 * A function that checks if a certain map of keystrokes is from the right person
 * @param map_sent_by_user
 *  A map containing the keystrokes that are stored in the database
 * @param map_in_database A map containing the keystrokes that are sent
 * @returns A boolean indicating that an map of N-grams is an imposter or not.
 * @author thomasevenepoel
 */
export declare function Detective(map_in_database: Map<string, number>, map_sent_by_user: Map<string, number>, maps_of_other_users: Array<Map<string, number>>): number;
/**
 * A function that calculates the delta-time between two keystrokes with variable n-gram.
 * @param timings
 * @param n
 * @returns A map with key value the calculated n-gram and value the time needed for this keystroke.
 */
export declare function calculateDelta(timings: Array<[string, number]>, n: number): Map<string, number>;
/**
 * Compares two vectors and calculates the 'ordering-vector'. The ordering vector indicates how many positions a given substring in map_in_database has moved relative to his position in map_sent_by_user
 *
 * @param first_map First map to compare with keys the n-grams and values the delta-time
 * @param second_map Second map to compare with keys the n-grams and values the delta-time
 * @returns The ordering vector
 *
 * @author thomasevenepoel
 */
export declare function CompareTwoMaps(first_map: Map<string, number>, second_map: Map<string, number>): Array<number>;
/**
 * Returns a new map where the values are ordered in ascending order. So the first element has the smallest number, and the last element has the biggest number
 * @param delta_timings A map with keys the n-grams and as value the delta time of that n-gram
 * @returns The sorted map
 *
 * @author thomasevenepoel
 */
export declare function orderDelta(delta_timings: Map<string, number>): Map<string, number>;
/**
 * Calculates the R-measure of a list.The R-measure is defined as follows:
 * R = (sum(ordering_list))/((ordering_list.length)²)/2) if (ordering_list)² is even
 * R = (sum(ordering_list))/((ordering_list.length)² - 1 )/2) if (ordering_list)² is odd
 * @param ordering_list The list after running CompareTwoMaps on 2 different maps
 * @returns The R-measure of a given list.
 *
 * @author thomasevenepoel
 */
export declare function rMeasure(ordering_list: Array<number>): number;
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
export declare function aMeasure(map_sent_by_user: Map<string, number>, map_in_database: Map<string, number>): number;
//# sourceMappingURL=imposter.d.ts.map