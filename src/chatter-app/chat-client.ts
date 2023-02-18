const ws = new WebSocket('ws://127.0.0.1:8080/');

const messagesArea = document.getElementById('messages') as HTMLDivElement;

ws.addEventListener('open', () => {
  console.log('connected...');
  ws.send('something from the web');
});

ws.addEventListener('message', (data) => {
  console.log('received: %o', data);
  console.log(data.data);
  const msg = document.createElement('div');
  msg.innerHTML = data.data as string;
  messagesArea.append(msg);
});

console.log('hi from web-chatty-client');

const textInput = document.getElementById('text-input') as HTMLInputElement;
textInput?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    console.log(textInput.value);
    ws.send(textInput.value);
  }
});
import { s } from './lib/foo.js';
console.log(s);
