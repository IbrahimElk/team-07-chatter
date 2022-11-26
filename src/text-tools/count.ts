// @author dn
// @date 2022-09-29

export function wordCount(text: string): number {
  return [...text.matchAll(/\b\w+\b/gm)].length;
}

export function sentenceCount(text: string): number {
  return [...text.matchAll(/(\w+[.?!]|\w+$)/gm)].length;
}
