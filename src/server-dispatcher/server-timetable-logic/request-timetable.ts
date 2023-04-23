// @author Barteld Van Nieuwenhove
// @date 2023-4-4

import type { Timetable } from '../../objects/timeTable/timeTable.js';
import type { IWebSocket } from '../../front-end/proto/ws-interface.js';
import type * as ServerInterfaceTypes from '../../front-end/proto/server-types.js';
import type { ChatServer } from '../../server/chat-server.js';
import { createFakeTimetable } from '../../objects/timeTable/fakeTimeTable.js';

/**
 * Checks for a current ongoing Class and returns it if non ongoing it returns the upcoming one.
 * @returns
 */
export async function requestTimetable(ws: IWebSocket, chatServer: ChatServer): Promise<void> {
  const user = await chatServer.getUserByWebsocket(ws);
  if (user === undefined) {
    return sendFail(ws, 'userNotConnected');
  }
  user.updateTimeTable(createFakeTimetable());
  const timeTable = user.getTimeTable();
  if (timeTable === undefined) {
    return sendFail(ws, 'timeTableNotFound');
  }
  sendSucces(ws, timeTable);
  return;
}

function sendFail(ws: IWebSocket, typeOfFail: string) {
  const answer: ServerInterfaceTypes.requestTimetableSendback = {
    command: 'requestTimetableSendback',
    payload: { succeeded: false, typeOfFail: typeOfFail },
  };
  ws.send(JSON.stringify(answer));
}

function sendSucces(ws: IWebSocket, Timetable: Timetable) {
  const answer: ServerInterfaceTypes.requestTimetableSendback = {
    command: 'requestTimetableSendback',
    payload: { succeeded: true, timeSlot: Timetable.toJSON() },
  };
  ws.send(JSON.stringify(answer));
}
