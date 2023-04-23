import { wsClient } from '../main.js';
import { ClientTimetable } from '../client-dispatcher/client-timetable-logic.js';

console.log('TIMETABLE-REQUEST-BUTTON.TS');

const requestTimeTableButton = document.getElementById('request-timetable') as HTMLInputElement;

requestTimeTableButton.addEventListener('click', (event) => {
  event.preventDefault();
  ClientTimetable.timetableRequest(wsClient);
});
