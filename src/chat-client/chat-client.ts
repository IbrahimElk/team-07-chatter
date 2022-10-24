import WebSocket from 'ws';

const ws = new WebSocket('ws://127.0.0.1:8080/');

ws.on('open', () => {
  ws.send('something');
});

ws.on('message', (data) => {
  console.log('received: %s', data);
});

console.log('hi');
