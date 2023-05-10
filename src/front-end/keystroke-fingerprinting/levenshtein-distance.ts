/**
 * Calculate the levenshtein distance of given text and other inputted text.
 * @param correctText - the text that the user needs to overtype.
 * @param userInput - the text typed by the user
 * @returns
 */
export function levenshteinDistance(correctText: string, userInput: string): number {
  const m = correctText.length;
  const n = userInput.length;
  const d = new Array<Array<number>>(m + 1);

  for (let i = 0; i <= m; i++) {
    d[i] = new Array<number>(n + 1);
    const a = d[i];
    if (a) a[0] = i;
  }
  for (let j = 0; j <= n; j++) {
    const b = d[0];
    if (b) b[j] = j;
  }

  for (let j = 1; j <= n; j++) {
    for (let i = 1; i <= m; i++) {
      const substitutionCost = correctText[i - 1] === userInput[j - 1] ? 0 : 1;
      const d_i = d[i];
      const d_i1 = d[i - 1];

      if (d_i && d_i1) {
        const d_i1_j: number = d_i1[j] as number;
        const d_i_j1: number = d_i[j - 1] as number;
        const d_i1_j1: number = d_i1[j - 1] as number;
        d_i[j] = Math.min(
          d_i1_j + 1, // deletion, the previous cost + 1 because you need to delete an extra charachter to get the same string.
          d_i_j1 + 1, // insertion, the previous cost + 1 because we inserted a character in one string but not in the other
          d_i1_j1 + substitutionCost // substitution, the previous cost + the cost of the substitution
        );
      }
    }
  }
  const d_m = d[m];
  if (d_m) {
    const d_m_n: number = d_m[n] as number;
    return d_m_n;
  }
  return 0;
}
