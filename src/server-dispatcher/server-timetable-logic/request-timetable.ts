// @author Barteld Van Nieuwenhove, Ibrahim El Kaddouri
// @date 2023-4-4

import type { Timetable } from '../../objects/timeTable/timeTable.js';
import type { User } from '../../objects/user/user.js';
import type { IWebSocket } from '../../front-end/proto/ws-interface.js';
import type * as ServerInterfaceTypes from '../../front-end/proto/server-types.js';
import type * as ClientInterfaceTypes from '../../front-end/proto/client-types.js';
import type { ChatServer } from '../../server/chat-server.js';
import { KULTimetable, createFakeTimetable } from '../../objects/timeTable/fakeTimeTable.js';
// import { joinOrCreateChatRooms } from '../server-login-logic/add-to-channel.js';
import Debug from 'debug';
const debug = Debug('requestTimetable.ts');

const clientSecret = 'r5FBejh54V7gj8PC';
const clientID = 'OA_UADCKXHLP';
const auth = Buffer.from(`${clientID}:${clientSecret}`).toString('base64');

interface token {
  rnummer: string;
}

export async function requestTimetable(
  load: ClientInterfaceTypes.requestTimetable['payload'],
  chatserver: ChatServer,
  ws: IWebSocket
): Promise<void> {
  const user: User | undefined = await chatserver.getUserBySessionID(load.sessionID);
  if (user === undefined) {
    sendFail(ws, 'nonExistingUsername');
    return;
  }
  let JSONDATA: KULTimetable = {
    timeSlots: [],
  };

  // // REST API :
  // // SEND AUTHORISATION CODE + CLIENTID + CLIENT SECRET
  // // RECEIVE ACCESS TOKEN
  // const tokenObject = await getToken(load.authenticationCode);

  // // FIXME: rnummer uit token object halen
  // //  TEMP, want geen idee hoe token van kuleuven eruit ziet, maar theoretisch is het een json obejct met userid en andere codes
  // const Token = (await tokenObject.json()) as token;
  // // REQUEST USER DATA WITH ACCESS TOKEN FROM KULEUEVEN DATABASE:
  // const data = await getData(Token.rnummer);

  // // FIXME: data moet gesaneerd worden zodat het correspondeert met KUTIMETABLE interface
  // JSONDATA = (await data.json()) as KULTimetable;

  // FAKE DATA
  JSONDATA = createFakeTimetable();

  user.updateTimeTable(JSONDATA);
  const timeTable: Timetable | undefined = user.getTimeTable();
  if (timeTable !== undefined) {
    const AllChannelsid = timeTable.getAllCoursesId();
    for (const channelid of AllChannelsid) {
      // await joinOrCreateChatRooms(user, channelid, chatserver);
    }
    sendSucces(ws, timeTable);
  } else {
    sendFail(ws, 'timeTableNotFound'); //FIXME: must require client to re-do registration.
  }
  return;
}

async function getToken(authorizationCode: string) {
  const tokenUrl = `https://webwsq.aps.kuleuven.be/sap/bc/sec/oauth2/token?grant_type=authorization_code&code=${authorizationCode}&redirect_uri=https://zeveraar.westeurope.cloudapp.azure.com/home/home.html`;

  return await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}, Basic T0FfVUFEQ0tYSExQOndhY2h0d29vcmQ=`,
    },
  });
}

async function getData(Unummer: string) {
  const dataUrl = `https://webwsq.aps.kuleuven.be/sap/opu/odata/sap/zc_ep_uurrooster_oauth_srv/users('${Unummer}')/classEvents?$format=json&$expand=locations,teachers,series`;
  return await fetch(dataUrl);
}

function sendFail(ws: IWebSocket, typeOfFail: string) {
  debug('sendFail');
  const answer: ServerInterfaceTypes.requestTimetableSendback = {
    command: 'requestTimetableSendback',
    payload: { succeeded: false, typeOfFail: typeOfFail },
  };
  ws.send(JSON.stringify(answer));
}

function sendSucces(ws: IWebSocket, timetable: Timetable) {
  debug('sendSucces');
  const ttb = timetable.toJSON();

  const answer: ServerInterfaceTypes.requestTimetableSendback = {
    command: 'requestTimetableSendback',
    payload: { succeeded: true, timetable: ttb },
  };
  ws.send(JSON.stringify(answer));
}
