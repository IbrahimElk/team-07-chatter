//Author: El Kaddouri Ibrahim

import type { ChatServer } from './chat-server.js';
import * as readline from 'node:readline/promises';

//from readline API
function completer(line: string) {
  const completions = '.help .exit'.split(' ');
  const hits = completions.filter((c) => c.startsWith(line));
  // Show all completions if none found
  return [hits.length ? hits : completions, line];
}

export async function serverTerminal(chatServer: ChatServer): Promise<void> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    completer,
  });
  const looping = true;
  while (looping) {
    const answer = await rl.question('=> ');
    if (answer === '.help') {
      printHelp(rl);
      continue;
    }
    if (answer === '.exit') {
      rl.close();
      break;
    } else {
      rl.write("Sorry, I didn't understand your input.");
      continue;
    }
  }
  await chatServer.onServerClose();
  process.exit();
}

function printHelp(rl: readline.Interface): void {
  rl.write('Commands that can be used are as follows: \n');
  rl.write('.exit : To close the server\n');
  return;
}
