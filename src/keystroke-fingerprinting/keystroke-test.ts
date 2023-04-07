/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { emitKeypressEvents } from 'readline';
import * as readline from 'node:readline/promises';
//import * as timing from '../chat-client/chat-timing.js';
//import * as calculate from '../client-dispatcher/client-user.js';
import { writeFile } from 'node:fs';
import { ClientUser } from '../client-dispatcher/client-user.js';

const result = [];
const zinnen = [
  'ik ben een mens',
  'ik woon in Leuven',
  'Lukaku had moeten scoren',
  'zinnen typen is leuk',
  'Ik vind mezelf leuk',
  'vind ik mezelf leuk?',
  'ik denk het wel',
  'of toch niet?',
  'achja, we zullen het nooit weten',
];
type PromptUserReturntype = {
  text: string;
  timings: Array<[string, number]>;
};
for (let i = 0; i < 8; i++) {
  const rll = readline.createInterface({
    input: process.stdin,

    output: process.stdout,
  });

  const TEXT = zinnen[i];
  if (TEXT !== undefined) {
    const TimingAndText: PromptUserReturntype = await timing.promptUserInput(
      rll,
      `Type the following paragraph: \n ${TEXT}`
    );
    const Ngram2Time: Map<string, number> = ClientUser.GetDeltaCalulations();
    const obj = Object.fromEntries(Ngram2Time);
    result.push(obj);
  }
}

console.log(result)
const data = JSON.stringify(result);
console.log(data);
writeFile('message.txt', data, (err) => {
  if (err) throw err;
  console.log('The file has been saved!');
});
