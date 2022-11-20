import { createInterface } from 'node:readline/promises';
import { emitKeypressEvents } from 'node:readline';

// inspiratie https://github.com/nodejs/node/issues/42800#issuecomment-1104014678
const dateArray: number[] = [];
const keyArray: string[] = [];

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
// eslint-disable-next-line @typescript-eslint/no-misused-promises, @typescript-eslint/require-await
process.stdin.on('keypress', async (character, key) => {
  // TODO: opzoeken wat interface key en character implementern
  dateArray.push(Date.now());
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
  keyArray.push(key.sequence);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (key.ctrl) process.exit();
});

const answer = await rl.question('text : ');
rl.close();

console.log(keyArray.length);
console.log(dateArray.length);

//FIXME: fucntie implementern die de lijst van keys en de lijst van tijden gaat vergelijken en enkel de delta tijden gaat nemen tussen keys die niet rechts aangrenzen bij backsapce? letter - backspace, dan telt combinatie niet meer,
// maar backspace - letter, tijdinterval teld wel?
