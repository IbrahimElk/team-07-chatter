import * as readline from 'node:readline';
import { promptUserInput } from './chat-timing.js';
import { describe, expect, it, vi } from 'vitest';
// import Debug from 'debug';
// const debug = Debug('chat-timing.spec: ');
//https:stackoverflow.com/questions/54060367/how-to-mock-node-readline
describe('chat-timing.ts', () => {
  describe('promptUserInput()', () => {
    it('should call question function with specified string', function () {
      const rl = readline.createInterface(process.stdin);
      const spy = vi.spyOn(rl, 'question');
      // It triggers a callback when question function is called
      // vi.spyOn(readline, 'createInterface').mockReturnValue(rl);
      promptUserInput(rl);
      expect(spy).toHaveBeenCalledTimes(1);

      // spy.mockRestore();
    });
  });
});
