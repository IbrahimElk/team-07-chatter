import * as readline from 'node:readline';
import { emitKeypressEvents } from 'node:readline';
import Debug from 'debug';
const debug = Debug('chat-timing: ');

// inspiratie https://github.com/nodejs/node/issues/42800#issuecomment-1104014678

type keyInterface = {
  sequence: string;
  name: string;
  ctrl: boolean;
  meta: boolean;
  shift: boolean;
};
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const timings: Array<[string, number]> = [];

const UninformativeKeys: string[] = ['\b', '\r'];

export function promptUserInput(rll: readline.Interface): void {
  emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }
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
  rll.question('>:', (answer) => {
    rll.close();
  });
  return;
  // return { answer: answer, timing: timings };
  // });

  //TODO: unit test met procces.on.emit() zie website.
}

const returnn = promptUserInput(rl);
console.log(timings);
