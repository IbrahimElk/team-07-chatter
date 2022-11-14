// Author Thomas Evenepoel
// Date: 2022-11-14

// input : [['h', 0], ['e', 90], ['l', 140], ['l', 190], ['o', 220]]
// output; for a 2 gram for example: [['he',90],['el', 50], ['ll', 50], ['lo',30]]

// TO-DO: Fixen dat je nog het gemiddelde kan berekenen, dit kan door result een map te maken
// en op het einde te checken of substring al in result zit, indien niet kan je toevoegen met de berekende delta
export function calculateDelta(timings: Array<[string, number]>, n: number) {
  const result = [];

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
    result.push(subresult);
    // Change i
    counter += 1;
  }

  return result;
}

console.log(
  calculateDelta(
    [
      ['h', 0],
      ['e', 40],
    ],
    2
  )
);
