import { User } from '../../objects/user/user.js';
import type { IWebSocket } from '../../front-end/proto/ws-interface.js';
import type * as ServerInterfaceTypes from '../../front-end/proto/server-types.js';
import type * as ClientInterfaceTypes from '../../front-end/proto/client-types.js';
import type { ChatServer } from '../../server/chat-server.js';
import Debug from 'debug';
const debug = Debug('user-register.ts');

export function userRegister(
  load: ClientInterfaceTypes.registration['payload'],
  chatserver: ChatServer,
  ws: IWebSocket
): void {
  //Check if a user exists with the given name
  if (chatserver.uuidAlreadyInUse('@' + load.usernameUUID)) {
    sendFail(ws, 'existingName');
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
  const nuser = new User(load.usernameUUID, load.password, '@' + load.usernameUUID);

  let sessionId = null;
  for (const [key, value] of chatserver.sessions.entries()) {
    if (value.has(ws)) {
      sessionId = key;
      nuser.setSessionID(sessionId); // MOET ALTIJD HIER KUNNEN GERAKEN WEGENS ONCONNECTION IN CHAT SERVER
    }
  }

  nuser.setWebsocket(ws);
  nuser.setSessionID(load.sessionID);
  chatserver.cachUser(nuser);

  //FIXME: Hier alle chatrooms initialiseren van de user door gebruik van functie in join-channel.ts

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
  const TIMETABLE_DATA: Timetable | undefined = requestTimetable(newUser, JSONDATA);

  //create or cache all chatrooms for this timetable
  if (TIMETABLE_DATA !== undefined) {
    const courseIDs: string[] = TIMETABLE_DATA.getAllCoursesId();
    for (const courseID of courseIDs) {
      if (!chatServer.isExsitingCUID('#' + courseID)) {
        //need other way to get channel TODO
        const newChannel = new PublicChannel(courseID);
        console.log(courseID);
        chatServer.setCachePublicChannel(newChannel);

        // user.addPublicChannel(nwchannel.getCUID());
        // nwchannel.systemAddConnected(user); //FIXME: when selecting channel.
        // nwchannel.addUser(user.getUUID());
      } else {
        await chatServer.getChannelByCUID('#' + courseID);
      }
    }
    sendSucces(ws, newUser.getUUID(), TIMETABLE_DATA.toJSON());
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

function sendSucces(ws: IWebSocket, userid: string, username: string) {
  debug('sendSucces');

  const answer: ServerInterfaceTypes.registrationSendback = {
    command: 'registrationSendback',
    payload: { succeeded: true, usernameId: userid, username: username },
  };
  ws.send(JSON.stringify(answer));
}
