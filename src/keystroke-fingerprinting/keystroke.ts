import { emitKeypressEvents } from 'readline';
import * as readline from 'node:readline/promises';
import * as timing from '../chat-client/chat-timing.js';
import * as calculate from '../keystroke-fingerprinting/calculate-delta.js';

type PromptUserReturntype = {
  text: string;
  timings: Array<[string, number]>;
};

const rll = readline.createInterface({
  input: process.stdin,

  output: process.stdout,
});
const TEXT = 'hammpo';
const TimingAndText: PromptUserReturntype = await timing.promptUserInput(
  rll,
  `Type the following paragraph: \n ${TEXT}`
);

//TODO: check if text that was put in about similar to what the text is?

//keystroke-delta functie hieruitvoeren.

const Ngram2Time: Map<string, number> = calculate.calculateDelta(TimingAndText.timings, 2);

console.log(TimingAndText);
console.log(Ngram2Time);
