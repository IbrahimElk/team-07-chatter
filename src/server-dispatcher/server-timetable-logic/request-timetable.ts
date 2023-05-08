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
import { exec } from 'child_process';
import Debug from 'debug';
import { time } from 'console';
const debug = Debug('requestTimetable.ts');

const clientSecret = 'r5FBejh54V7gj8PC';
const clientID = 'OA_UADCKXHLP';
const auth = Buffer.from(`${clientID}:${clientSecret}`).toString('base64');
const tokenUrl = `https://webwsq.aps.kuleuven.be/sap/bc/sec/oauth2/token`;
const IDUrl = `https://webwsq.aps.kuleuven.be/sap/opu/odata/sap/zc_ep_uurrooster_oauth_srv/users?$format=json&$select=id`;

interface tokenPayload {
  access_token: string;
  token_type: string;
  expires_in: string;
  refresh_token: string;
  scope: string;
}

interface idPayload {
  d: {
    results: {
      id: string;
    }[];
  };
}

interface locationPayload {
  d: {
    results: {
      mnemonic: string;
    }[];
  };
}

interface APIPayload {
  d: {
    results: {
      startTime: string;
      endTime: string;
      weekDay: string;
      longDescription: string;
      locations: {
        __deferred: {
          uri: string;
        };
      };
    }[];
  };
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

  let realJSONDATA: KULTimetable = {
    timeSlots: [],
  };

  const curlCommandToken = `curl --location --request POST "${tokenUrl}" \
  --header "Authorization: Basic ${auth}" \
  --header "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "grant_type=authorization_code" \
  --data-urlencode "code=${load.authenticationCode}" \
  --data-urlencode "redirect_uri=https://zeveraar.westeurope.cloudapp.azure.com/home/home.html" \
  --insecure`;

  createTimetable(curlCommandToken)
    .then((timetable: KULTimetable) => {
      realJSONDATA = timetable;
    })
    .catch((error) => {
      console.error(error);
    });

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

/**
 * Create a timetable filled with classes of today.
 * @param curlCommandToken the curl command to gain a access token.
 * @returns a TimeTable object filled with today's classes.
 */
function createTimetable(curlCommandToken: string): Promise<KULTimetable> {
  return new Promise((resolve, reject) => {
    const timeTable: KULTimetable = {
      timeSlots: [],
    };

    exec(curlCommandToken, (error, stdout, stderr) => {
      if (error) {
        reject(`error: ${error.message}`);
      } else if (stdout) {
        const token_data = JSON.parse(stdout) as tokenPayload;
        const access_token = token_data.access_token;

        const curlCommandID = `curl --location --request GET "${IDUrl}" \
        --header "Authorization: Bearer ${access_token}" \
        --insecure`;

        exec(curlCommandID, (error, stdout, stderr) => {
          if (error) {
            reject(`error: ${error.message}`);
          } else if (stdout) {
            const IDinfo = JSON.parse(stdout) as idPayload;
            const userKUL_ID = IDinfo.d.results[0]?.id;
            const dataUrl = `https://webwsq.aps.kuleuven.be/sap/opu/odata/sap/zc_ep_uurrooster_oauth_srv/users('${
              userKUL_ID as string
            }')/classEvents?$format=json`;
            const curlCommandData = `curl --location --request GET "${dataUrl}" \
            --header "Authorization: Bearer ${access_token}" \
            --insecure`;

            exec(curlCommandData, (error, stdout, stderr) => {
              if (error) {
                reject(`error: ${error.message}`);
              } else if (stdout) {
                const dataInfo = JSON.parse(stdout) as APIPayload;
                const list = dataInfo.d.results;

                const locationPromises: Promise<void>[] = [];

                list.forEach((element) => {
                  const locationUrl = element.locations.__deferred.uri + '?$format=json';
                  const curlCommandLocation = `curl --location --request GET "${locationUrl}" \
                  --header "Authorization: Bearer ${access_token}" \
                  --insecure`;

                  const locationPromise = new Promise<void>((resolve, reject) => {
                    exec(curlCommandLocation, (error, stdout, stderr) => {
                      if (error) {
                        reject(`error: ${error.message}`);
                      } else if (stdout) {
                        const locationInfo = JSON.parse(stdout) as locationPayload;
                        const building = locationInfo.d.results[0]?.mnemonic;
                        timeTable.timeSlots.push({
                          longDescription: element.longDescription,
                          weekDay: element.weekDay + ' ',
                          startTime: element.startTime,
                          endTime: element.endTime,
                          // building: building,
                        });
                      }
                      resolve();
                    });
                  });

                  locationPromises.push(locationPromise);
                });

                Promise.all(locationPromises)
                  .then(() => {
                    resolve(timeTable);
                  })
                  .catch((error) => {
                    console.error(error);
                  });
              }
            });
          }
        });
      }
    });
  });
}
