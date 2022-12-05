// @author :  thomasevenepoel
// @date : 2022-12-05

/**
 * A function that checks if two strings are the same or not.
 * @param first_string First string to check
 * @param second_string Second string to check
 * @returns true if the two strings are the same; false if the two strings are different.
 *
 * @author thomasevenepoel
 */
export function theSameString(first_string: string, second_string: string): boolean {
  if (first_string === second_string) {
    return true;
  } else {
    return false;
  }
}

/**
 * Returns the word with the mistakes colored red
 * @param first_word The word that the person is typing
 * @param second_word The correct version of the word
 * @returns  A colored string
 *
 * @author thomasevenepoel
 */
export function colorWord(first_word: string, second_word: string): string {
  let i = 0;
  let j = 0;
  let resulting_word = '';

  while (i < first_word.length) {
    if (first_word[i] === second_word[j]) {
      resulting_word += '\x1B[32m';
      resulting_word += first_word[i];
      i += 1;
      j += 1;
    } else {
      resulting_word += '\x1B[31m';
      resulting_word += first_word[i];
      i += 1;
      j += 1;
    }
  }

  return resulting_word;
}
/**
 * Returns a string, with all the mistakes colored. When 2 words have a different number of letters, the whole word becomes red.
 * @param first_string
 * @param second_string
 * @returns A colored string
 *
 * @author thomasevenepoel
 */
export function colorString(first_string: string, second_string: string): string {
  const first_list = first_string.split(' ');
  const second_list = second_string.split(' ');

  let resulting_string = '';

  let i = 0;

  while (i < first_list.length) {
    if (first_list[i]?.length !== second_list[i]?.length) {
      resulting_string += '\x1B[31m';
      resulting_string += first_list[i];
      resulting_string += ' ';
      i += 1;
    } else {
      const word_first = first_list[i];
      const word_second = second_list[i];
      if (word_first !== undefined && word_second !== undefined) {
        resulting_string += colorWord(word_first, word_second);
        resulting_string += ' ';
      }
      i += 1;
    }
  }

  return resulting_string;
}
