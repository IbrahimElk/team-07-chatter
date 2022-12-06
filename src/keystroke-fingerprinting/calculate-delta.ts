// @author thomasevenepoel
// @date: 2022-11-14

/**
 * A function that calculates the delta-time between two keystrokes with variable n-gram.
 * @param timings A list with the letter and the timing from the keypress
 * @param n An integer that indicates which N-gram is used
 * @returns A map with key value the calculated n-gram and value the time needed for this keystroke.
 *
 * @author thomasevenepoel
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
    counter += 1;
  }
  return result;
}
