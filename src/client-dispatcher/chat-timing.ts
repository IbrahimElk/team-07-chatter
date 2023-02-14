// import { emitKeypressEvents } from 'node:readline';
import type * as readline from 'node:readline/promises';

import * as CC from './chat-client.js';
import * as KEY from '../keystroke-fingerprinting/imposter.js';
import Debug from 'debug';
const debug = Debug('chat-timing: ');

// inspiratie https://github.com/nodejs/node/issues/42800#issuecomment-1104014678

type PromptUserReturntype = {
  text: string;
  timings: Map<string, number>;
};

/**
 * To get the timings of each keypress during the answering of a question by readline interface
 * and to discard the timings of keypresses of certain keys such as 'backspace' and 'enter'.
 *
 * @param rll readline.Interface , readline interface where we can ask questions, rll.question()
 * @returns '{text: answer, timings: timing }' where answer is a string, and timing is of type Array<[string, number]>
 */
export async function promptUserInput(rll: readline.Interface, question: string): Promise<PromptUserReturntype> {
  rll.resume();
  CC.CLuser.resumeKeydetection();
  const answer = await rll.question(`${question} \n`);
  const timingMap: Map<string, number> = KEY.calculateDelta(CC.CLuser.getTiming(), 2);
  // debug(timingMap);
  CC.CLuser.pauseKeydetection();
  rll.pause();

  return { text: answer, timings: timingMap };
}

// HOW TO USE:
// emitKeypressEvents(process.stdin);
// if (process.stdin.isTTY) {
//   process.stdin.setRawMode(true);
// }
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });
// rl.pause();
// for (let i = 0; i < 10; i++) {
//   process.stdin.on('keypress', keypresscb);
//   const returnn: PromptUserReturntype = await promptUserInput(rl, 'hallo overtypen');
//   process.stdin.removeListener('keypress', keypresscb);
// }
// const returnn: PromptUserReturntype = await promptUserInput(rl, 'hallo overtypen');
