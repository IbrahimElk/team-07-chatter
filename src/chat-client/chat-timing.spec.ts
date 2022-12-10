import * as readline from 'node:readline/promises';
import * as rl from 'node:readline';

import { HELPER } from './chat-timing.js';
import * as CHAT from './chat-timing.js';
import { describe, expect, it, vi } from 'vitest';
// import { Readable } from 'node:stream';
// import Debug from 'debug';
// const debug = Debug('chat-timing.spec: ');

//https://stackoverflow.com/questions/54060367/how-to-mock-node-readline
//https://stackoverflow.com/questions/55181297/where-can-i-find-documentation-of-the-keypress-event-in-node-js
const rll = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
describe('chat-timing.ts', () => {
  describe('FindTimePress()', () => {
    it('given data events, correct time and keypresses are detected ', async function () {
      rl.emitKeypressEvents(process.stdin);

      const FunctionInPromise = new Promise<[string, number][]>((resolve) => {
        const value = HELPER.FindTimePress();
        resolve(value);
      });
      process.stdin.emit('data', 'H');
      const temp1 = Date.now();
      process.stdin.emit('data', 'E');
      const temp2 = Date.now();
      process.stdin.emit('data', 'L');
      const temp3 = Date.now();
      process.stdin.emit('data', 'L');
      const temp4 = Date.now();
      process.stdin.emit('data', 'O');
      const temp5 = Date.now();

      const comparisonArray: Array<[string, number]> = [
        ['H', temp1],
        ['E', temp2],
        ['L', temp3],
        ['L', temp4],
        ['O', temp5],
      ];

      const ret = await FunctionInPromise;
      for (let i = 0; i < ret.length; i++) {
        const original = ret[i];
        const comparison = comparisonArray[i];
        if (original !== undefined && comparison !== undefined) {
          expect(original[0]).toEqual(comparison[0]);
          //these timings won't be exactly (due to being called at different lines of code) the same but should be very close just to prove expected results
          expect(original[1]).toBeCloseTo(comparison[1], -1);
        }
      }
    });
  });
});

describe('promptUserInput()', () => {
  it('given a question, correct time and keypresses where detected', async function () {
    const spyOnQuestion = vi.spyOn(rll, 'question').mockReturnValue(
      new Promise<string>((resolve) => {
        resolve('hello');
      })
    );
    const spyOnFindTimePress = vi.spyOn(HELPER, 'FindTimePress');
    spyOnFindTimePress.mockImplementation(() => {
      return [
        ['h', 10],
        ['e', 20],
        ['l', 35],
        ['l', 44],
        ['o', 50],
      ];
    });

    const KeysAndTimes = await CHAT.promptUserInput(rll, 'hello');

    expect(spyOnQuestion).toHaveBeenCalledTimes(1);
    expect(spyOnFindTimePress).toHaveBeenCalledTimes(1);

    expect(KeysAndTimes.text).toEqual('hello');
    expect(KeysAndTimes.timings).toEqual([
      ['h', 10],
      ['e', 20],
      ['l', 35],
      ['l', 44],
      ['o', 50],
    ]);
  });
});
