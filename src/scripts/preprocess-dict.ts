import type { Readable, Writable } from 'stream';
import * as fs from 'fs';
//@author Sam Hanot
//@date 2022-10-16
/**
 *
 * @param input Readable text file (the dictionary)
 * @param output the dictionary in the correct (utf-8) format
 *
 * the output format is:
 *
 * word_1
 * description_1_1
 *
 *word_1
 *description_1_2
 *
 *word_2
 *description_2_1
 *
 *word_3
 *description_3_1
 *
 */
export function preprocessDict(input: Readable, output: Writable) {
  input.setEncoding('utf-8');
  input.on('data', (data: string) => {
    let no_descriptions = 0; //amount of descriptions of the current word
    let word = ''; //current word
    for (const row of data.split('\n')) {
      //reads every line one by one
      if (row[0] === ':') {
        //every definition of a word starts with :word:
        word = row.substring(1); //removes the first :
        word = word.substring(0, word.indexOf(':')); //removes the second :
        output.write(word); //writes the word to the output document
        output.write('\n'); //starts a new line for the description
        no_descriptions = 1; //every word has one description
      }
      if (row.length === 0 && no_descriptions > 0) {
        //the line is empty
        output.write('\n'); //adds 2 empty lines
        output.write('\n');
        no_descriptions = 0; // next line will have a new word so # descriptions is 0 again
      }
      if (no_descriptions > 0) {
        //only if we are writing about a word
        let start = 0;
        let d = no_descriptions.toString() + '.';
        if (row.includes('n.') && !row.includes(d)) {
          //almost every description starts with n.
          const description = row.substring(row.indexOf('n.') + 3); //writes the description (from the currebt line) to the output document
          output.write(description);
        } else {
          while (row.indexOf(d) !== -1) {
            //checks if there is a new description on this line
            if (no_descriptions !== 1) {
              output.write(row.substring(start, row.indexOf(d))); // writes everything from the last description away
              output.write('\n');
              output.write('\n');
              output.write(word); //rewrites the word
            }
            output.write('\n');
            start = row.indexOf(d) + 2;
            ++no_descriptions;
            d = no_descriptions.toString() + '.';
          }
          output.write(row.substring(start)); //writes everything after the last definition
        }
      }
    }
  });
}

const inputDict = fs.createReadStream('src/assets/initial-dictionary.txt');
const outputDict = fs.createWriteStream('src/assets/processed-dict-file.txt');
void preprocessDict(inputDict, outputDict);
