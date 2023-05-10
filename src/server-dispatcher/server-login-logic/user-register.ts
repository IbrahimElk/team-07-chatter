import { User } from '../../objects/user/user.js';
import type { IWebSocket } from '../../front-end/proto/ws-interface.js';
import type * as ServerInterfaceTypes from '../../front-end/proto/server-types.js';
import type * as ClientInterfaceTypes from '../../front-end/proto/client-types.js';
import type { ChatServer } from '../../server/chat-server.js';
import { KULTimetable, createFakeTimetable } from '../../objects/timeTable/fakeTimeTable.js';
import Debug from 'debug';
import type { Timetable } from '../../objects/timeTable/timeTable.js';
import { PublicChannel } from '../../objects/channel/publicchannel.js';
const debug = Debug('user-register.ts');

export async function userRegister(
  load: ClientInterfaceTypes.registration['payload'],
  chatserver: ChatServer,
  ws: IWebSocket
): Promise<void> {
  //Check if a user exists with the given name
  if (chatserver.isExistingUUID('@' + load.usernameUUID)) {
    sendFail(ws, 'existingName');
    return;
  }

  //Check if the given password is long enough
  const result = checkPW(load.password);
  if (result !== 'true') {
    sendFail(ws, result);
    return;
  }
  if (load.usernameUUID.length < 1) {
    sendFail(ws, 'length of name is shorter than 1');
    return;
  }

  //Create a new user
  const nuser = new User(load.usernameUUID, load.password);

  let sessionId = null;
  for (const [key, value] of chatserver.sessionIDToWebsocket.entries()) {
    if (value.has(ws)) {
      sessionId = key;
      nuser.setSessionID(sessionId); // MOET ALTIJD HIER KUNNEN GERAKEN WEGENS ONCONNECTION IN CHAT SERVER
    }
  }

  nuser.setWebsocket(ws);
  nuser.setSessionID(load.sessionID);
  chatserver.cacheUser(nuser);

  // format user data response into kulTimeTable
  let JSONDATA: KULTimetable = {
    timeSlots: [],
  };

  // PROCESSING
  JSONDATA = createFakeTimetable();
  const TIMETABLE_DATA: Timetable | undefined = getCorrectFormatTimetable(nuser, JSONDATA);

  //create or cache all chatrooms for this timetable
  if (TIMETABLE_DATA !== undefined) {
    const courseIDs: string[] = TIMETABLE_DATA.getAllCoursesId();
    for (const courseID of courseIDs) {
      if (!chatserver.isExistingCUID('#' + courseID)) {
        const newChannel = new PublicChannel(courseID);
        chatserver.setCachePublicChannel(newChannel);
      } else {
        await chatserver.getChannelByCUID('#' + courseID);
      }
    }
    sendSucces(ws, nuser, TIMETABLE_DATA.toJSON());
  } else {
    sendFail(ws, 'timeTableNotFound'); //FIXME: must require client to re-do registration.
  }
  return;
}

function checkPW(password: string): string {
  if (password.length < 8) {
    return 'shortPW';
  }

  if (!/[A-Z]/.test(password)) {
    return 'noUppercaseInPW';
  }

  if (!/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/.test(password)) {
    return 'noPunctuationInPW';
  }

  return 'true';
}

function sendFail(ws: IWebSocket, typeOfFail: string) {
  debug('sendFail ', typeOfFail);

  const answer: ServerInterfaceTypes.registrationSendback = {
    command: 'registrationSendback',
    payload: { succeeded: false, typeOfFail: typeOfFail },
  };
  ws.send(JSON.stringify(answer));
}

function sendSucces(
  ws: IWebSocket,
  user: User,
  timetable: Array<{ description: string; startTime: number; endTime: number; building: string }>
) {
  debug('sendSucces');

  const answer: ServerInterfaceTypes.registrationSendback = {
    command: 'registrationSendback',
    payload: { succeeded: true, user: user.getPublicUser(), timetable: timetable },
  };
  ws.send(JSON.stringify(answer));
}

/**
 * Checks for a current ongoing Class and returns it if non ongoing it returns the upcoming one.
 * @returns
 */
function getCorrectFormatTimetable(user: User, data: KULTimetable): undefined | Timetable {
  user.updateTimeTable(data);
  const timeTable: Timetable | undefined = user.getTimeTable();
  return timeTable;
}
