import * as readline from 'node:readline/promises';
import * as rl from 'node:readline';

import * as CHAT from '../chat-client/chat-timing.js';
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
  rl.emitKeypressEvents(process.stdin);

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
  process.stdin.emit('data', '\r');
  const temp6 = Date.now();

  describe('promptUserInput()', () => {
    it('given a question, correct time and keypresses where detected', async function () {
      const spyOnQuestion = vi.spyOn(rll, 'question').mockReturnValue(
        new Promise<string>((resolve) => {
          resolve('hello');
        })
      );

      const KeysAndTimes = await CHAT.promptUserInput(rll, 'question: ');

      expect(spyOnQuestion).toHaveBeenCalledTimes(1);

      expect(KeysAndTimes.text).toEqual('hello');
      expect(KeysAndTimes.timings).toEqual([
        ['he', temp2 - temp1],
        ['el', temp3 - temp2],
        ['ll', temp4 - temp3],
        ['lo', temp5 - temp4],
        ['o\r', temp6 - temp4],
      ]);
    });
  });
});
