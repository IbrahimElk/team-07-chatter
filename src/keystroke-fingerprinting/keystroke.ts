/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
//import { emitKeypressEvents } from 'readline';
import * as readline from 'node:readline/promises';
import * as timing from '../chat-client/chat-timing.js';
import * as calculate from '../keystroke-fingerprinting/calculate-delta.js';
//import * as impost from '../keystroke-fingerprinting/imposter.js';
//import { aMeasure, rMeasure } from './measures.js';
//import { CompareTwoMaps } from './compare-two-maps.js';


type PromptUserReturntype = {
  text: string;
  timings: Array<[string, number]>;
};

const rll = readline.createInterface({
  input: process.stdin,

  output: process.stdout,
});
const TEXT = 'hjas';
const TimingAndText: PromptUserReturntype = await timing.promptUserInput(
  rll,
  `Type the following paragraph: \n ${TEXT}`
);

const rll1 = readline.createInterface({
  input: process.stdin,

  output: process.stdout,
});

// //

//TODO: check if text that was put in about similar to what the text is?

//keystroke-delta functie hieruitvoeren.

const Ngram2Time: Map<string, number> = calculate.calculateDelta(TimingAndText.timings, 2);
//const Ngram2Time2: Map<string, number> = calculate.calculateDelta(TimingAndText1.timings, 2);

console.log(TimingAndText.timings)
//console.log(TimingAndText1.timings)
console.log(Ngram2Time)
//console.log(Ngram2Time2)

// console.log(rMeasure(CompareTwoMaps(Ngram2Time,Ngram2Time2)))
// console.log(aMeasure(Ngram2Time,Ngram2Time2))
// const bool = impost.Detective(Ngram2Time,Ngram2Time2, 0.48, 0.25, 0.75)
// console.log(bool)
// console.log(aMeasure(Ngram2Time, Ngram2Time2));
// console.log(rMeasure(CompareTwoMaps(Ngram2Time, Ngram2Time2)));
// console.log(CompareTwoMaps(Ngram2Time, Ngram2Time2));
// const bool = impost.Detective(Ngram2Time, Ngram2Time2, 0.32, 0.25, 0.75);

// console.log(bool);
