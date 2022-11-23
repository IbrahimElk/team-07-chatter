import { emitKeypressEvents } from 'node:readline';
import type * as readline from 'node:readline/promises';
// import Debug from 'debug';
// const debug = Debug('chat-timing: ');

// inspiratie https://github.com/nodejs/node/issues/42800#issuecomment-1104014678

type keyInterface = {
  sequence: string;
  name: string;
  ctrl: boolean;
  meta: boolean;
  shift: boolean;
};
type PromptUserReturntype = {
  text: string;
  timings: Array<[string, number]>;
};

/**
 * Help function, doesnt need to be documented.
 */
export const HELPER = {
  FindTimePress: (): Array<[string, number]> => {
    const timings: Array<[string, number]> = [];
    const UninformativeKeys: string[] = ['\b', '\r'];
    process.stdin.on('keypress', function (character: string, key: keyInterface): void {
      let state = true;
      for (const element of UninformativeKeys) {
        if (key.sequence === element) {
          state = false;
        }
      }
      if (state) {
        timings.push([key.sequence, Date.now()]);
      }
      if (key.ctrl && key.name === 'c') process.exit();
    });
    return timings;
  },
};

/**
 * To get the timings of each keypress during the answering of a question by readline interface
 * and to discard the timings of keypresses of certain keys such as 'backspace' and 'enter'.
 *
 * @param rll readline.Interface , readline interface where we can ask questions, rll.question()
 * @returns '{text: answer, timings: timing }' where answer is a string, and timing is of type Array<[string, number]>
 */
export async function promptUserInput(rll: readline.Interface): Promise<PromptUserReturntype> {
  emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }
  const timing: Array<[string, number]> = HELPER.FindTimePress();
  const answer = await rll.question('>:');
  rll.close();
  return { text: answer, timings: timing };
}

// // HOW TO USE:
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });
// const returnn: returntype = await promptUserInput(rl);
// console.log(returnn);
