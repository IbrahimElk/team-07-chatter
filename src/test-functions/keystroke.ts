// @author thomasevenepoel, ibrahimelkaddouri
// @date 2022-11-28
import * as readline from 'node:readline/promises';
import * as timing from '../chat-client/chat-timing.js';
import * as calculate from '../keystroke-fingerprinting/calculate-delta.js';
import * as impost from '../keystroke-fingerprinting/imposter.js';

/**
 * A file where you have a type a text twice and check whether the imposter function (imposter.ts) returns true
 */
type PromptUserReturntype = {
  text: string;
  timings: Array<[string, number]>;
};

const rll = readline.createInterface({
  input: process.stdin,

  output: process.stdout,
});
const TEXT = 'hallo';
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

const Ngram2Time: Map<string, number> = calculate.calculateDelta(TimingAndText.timings, 2);
const Ngram2Time2: Map<string, number> = calculate.calculateDelta(TimingAndText1.timings, 2);

const bool = impost.Detective(Ngram2Time, Ngram2Time2, 0.48, 0.25, 0.75);
console.log(bool);
