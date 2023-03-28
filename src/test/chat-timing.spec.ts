import * as readline from 'node:readline/promises';
import * as rl from 'node:readline';
import * as CC from '../client-dispatcher/chat-client.js';
import * as KEY from '../keystroke-fingerprinting/imposter.js';
import * as CHAT from '../client-dispatcher/chat-timing.js';
import { describe, expect, it, vi } from 'vitest';

//https://stackoverflow.com/questions/54060367/how-to-mock-node-readline
//https://stackoverflow.com/questions/55181297/where-can-i-find-documentation-of-the-keypress-event-in-node-js
const rll = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

describe('promptUserInput()', () => {
  it('given a question, correct time and keypresses where detected', async function () {
    // process.stdin.emit('data', 'H');
    // const temp1 = Date.now();
    // process.stdin.emit('data', 'E');
    // const temp2 = Date.now();
    // process.stdin.emit('data', 'L');
    // const temp3 = Date.now();
    // process.stdin.emit('data', 'L');
    // const temp4 = Date.now();
    // process.stdin.emit('data', 'O');
    // const temp5 = Date.now();

    const spyOnResume = vi.spyOn(rll, 'resume');
    const spyOnQuestion = vi.spyOn(rll, 'question').mockReturnValue(
      new Promise<string>((resolve) => {
        resolve('hello');
      })
    );
    const spyOnCLuser1 = vi.spyOn(CC.CLuser, 'resumeKeydetection');
    const spyOnCLuser2 = vi.spyOn(CC.CLuser, 'pauseKeydetection');
    const spyOnFindTimePress = vi.spyOn(KEY, 'calculateDelta');
    spyOnFindTimePress.mockImplementation(() => {
      return new Map<string, number>([
        ['h', 10],
        ['e', 20],
        ['l', 35],
        ['l', 44],
        ['o', 50],
      ]);
    });

    const KeysAndTimes = await CHAT.promptUserInput(rll, 'hello');
    expect(spyOnResume).toHaveBeenCalledTimes(1);
    expect(spyOnQuestion).toHaveBeenCalledTimes(1);
    expect(spyOnFindTimePress).toHaveBeenCalledTimes(1);
    expect(spyOnCLuser1).toHaveBeenCalledTimes(1);
    expect(spyOnCLuser2).toHaveBeenCalledTimes(1);

    expect(KeysAndTimes.text).toEqual('hello');
    expect(KeysAndTimes.timings).toEqual(
      new Map<string, number>([
        ['h', 10],
        ['e', 20],
        ['l', 35],
        ['l', 44],
        ['o', 50],
      ])
    );
  });
});
