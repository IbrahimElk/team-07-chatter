import { emitKeypressEvents } from 'readline';
import * as readline from 'node:readline/promises';
import * as timing from '../chat-client/chat-timing.js';
import * as calculate from '../keystroke-fingerprinting/calculate-delta.js';
import * as impost from '../keystroke-fingerprinting/imposter.js';
import { aMeasure, rMeasure } from './measures.js';
import { CompareTwoMaps } from './compare-two-maps.js';

type PromptUserReturntype = {
  text: string;
  timings: Array<[string, number]>;
};

const rll = readline.createInterface({
  input: process.stdin,

  output: process.stdout,
});
const TEXT = 'ik ben noch een kat, noch een huis';
const TimingAndText: PromptUserReturntype = await timing.promptUserInput(
  rll,
  `Type the following paragraph: \n ${TEXT}`
);

const rll1 = readline.createInterface({
  input: process.stdin,

  output: process.stdout,
});

const TimingAndText1: PromptUserReturntype = await timing.promptUserInput(
  rll1,
  `Type the following paragraph: \n ${TEXT}`
);

//TODO: check if text that was put in about similar to what the text is?

//keystroke-delta functie hieruitvoeren.

const Ngram2Time: Map<string, number> = calculate.calculateDelta(TimingAndText.timings, 2);
const Ngram2Time2: Map<string, number> = calculate.calculateDelta(TimingAndText1.timings, 2);

console.log(Ngram2Time);
console.log(Ngram2Time2);
// console.log(aMeasure(Ngram2Time, Ngram2Time2));
// console.log(rMeasure(CompareTwoMaps(Ngram2Time, Ngram2Time2)));
// console.log(CompareTwoMaps(Ngram2Time, Ngram2Time2));
// const bool = impost.Detective(Ngram2Time, Ngram2Time2, 0.32, 0.25, 0.75);

// console.log(bool);
