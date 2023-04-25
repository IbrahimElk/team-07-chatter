/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { User } from '../../objects/user/user.js';
import type { IWebSocket } from '../../front-end/proto/ws-interface.js';
import type * as ServerInterfaceTypes from '../../front-end/proto/server-types.js';
import type * as ClientInterfaceTypes from '../../front-end/proto/client-types.js';
import type { ChatServer } from '../../server/chat-server.js';
import { requestTimetable } from '../server-timetable-logic/request-timetable.js';
import Debug from 'debug';
import { KULTimetable, createFakeTimetable } from '../../objects/timeTable/fakeTimeTable.js';
import type { Timetable } from '../../objects/timeTable/timeTable.js';
import { joinOrCreateChatRooms } from './join-channel.js';
const debug = Debug('user-register.ts');

export async function userRegister(
  load: ClientInterfaceTypes.registration['payload'],
  chatserver: ChatServer,
  ws: IWebSocket
): Promise<void> {
  //Check if a user exists with the given name
  if (chatserver.uuidAlreadyInUse('@' + load.usernameUuid)) {
    sendFail(ws, 'existingName');
  }

  //Check if the given password is long enough
  const result = checkPW(load.password);
  if (result !== 'true') {
    sendFail(ws, result);
    return;
  }
  if (load.usernameUuid.length < 1) {
    sendFail(ws, 'length of name is shorter than 1');
    return;
  }

  //Create a new user
  const nuser = new User(load.usernameUuid, load.password, '@' + load.usernameUuid);

  let sessionId = null;
  for (const [key, value] of chatserver.sessions.entries()) {
    if (value.has(ws)) {
      sessionId = key;
      nuser.setSessionID(sessionId); // MOET ALTIJD HIER KUNNEN GERAKEN WEGENS ONCONNECTION IN CHAT SERVER
    }
  }

  nuser.setWebsocket(ws);
  nuser.setSessionID(load.sessionId);
  chatserver.cachUser(nuser);

  // REST API :

  // RESUEST AUTHORISATION CODE (wordt gedaan in de client.)
  // RECEIVE AUTHORISATION CODE
  // TODO:
  // SEND AUTHORISATION CODE + CLIENTID + CLIENT SECRET
  // TODO:
  // RECEIVE ID TOKEN AND ACCESS TOKEN
  // TODO:

  // (*) REQUEST USER DATA WITH ACCESS TOKEN:
  const uNumberVanStudent = '234KBHFHB'; //FIXME: unumber fix
  const POSTargument = generateTimeTableQuery(uNumberVanStudent);
  // use postargument to contruct http request to kuleuven database

  // format user data response into kulTimeTable
  let JSONDATA: KULTimetable = {
    timeSlots: [],
  };

  // PROCESSING
  JSONDATA = createFakeTimetable(); // TODO: mag weg wanneer (*) klaar is.
  const TIMETABLE_DATA: Timetable | undefined = requestTimetable(nuser, JSONDATA);
  if (TIMETABLE_DATA !== undefined) {
    const AllChannelsid = TIMETABLE_DATA.getAllCoursesId();
    for (const channelid of AllChannelsid) {
      await joinOrCreateChatRooms(nuser, channelid, chatserver);
    }
    sendSucces(ws, '@' + load.usernameUuid, TIMETABLE_DATA.toJSON());
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

// FIXME: do more than today's classes, for whole year.
/**
 * Creates a timetable query for the KUL API for a specific student and for just today's classes.
 * @param uNumber uNumnber of the student.
 * @returns The timetable query for the KUL API.
 */
function generateTimeTableQuery(uNumber: string): string {
  return (
    'https://webwsq.aps.kuleuven.be/sap/opu/odata/sap/zc_ep_uurrooster_oauth_srv/users(’' +
    uNumber +
    '’)/classEvents?$filter=date eq datetime’' +
    formattedDate() +
    '’&$format=json'
  );
}
/**
 * Formats the current date as a string in the format "YYYY-M-DT00:00:00".
 * @returns The formatted date string.
 */
function formattedDate(): string {
  const currentDate = new Date();
  const isoString = currentDate.toISOString().slice(0, 19);
  const [year, month, day] = isoString.split('-');
  let formattedDate = '';
  if (year && month && day) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    formattedDate = `${year}-${month[0] === '0' ? month[1] : month}-${day[0] === '0' ? day[1] : day}T00:00:00`;
  }
  return formattedDate;
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
  userid: string,
  timetable: Array<{ description: string; startTime: number; endTime: number }>
) {
  debug('sendSucces');

  const answer: ServerInterfaceTypes.registrationSendback = {
    command: 'registrationSendback',
    payload: { succeeded: true, usernameId: userid, timetable: timetable },
  };
  ws.send(JSON.stringify(answer));
}
