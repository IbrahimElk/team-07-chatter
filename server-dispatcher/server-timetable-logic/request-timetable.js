// @author John Gao
// @date 2023-4-4
// import { joinOrCreateChatRooms } from '../server-login-logic/add-to-channel.js';
import { exec } from 'child_process';
import Debug from 'debug';
import { PublicChannel } from '../../objects/channel/publicchannel.js';
const debug = Debug('requestTimetable.ts');
const clientSecret = 'r5FBejh54V7gj8PC';
const clientID = 'OA_UADCKXHLP';
const auth = Buffer.from(`${clientID}:${clientSecret}`).toString('base64');
const tokenUrl = `https://webwsq.aps.kuleuven.be/sap/bc/sec/oauth2/token`;
const IDUrl = `https://webwsq.aps.kuleuven.be/sap/opu/odata/sap/zc_ep_uurrooster_oauth_srv/users?$format=json&$select=id`;
export async function requestTimetable(load, chatserver, ws) {
    const user = await chatserver.getUserBySessionID(load.sessionID);
    if (user === undefined) {
        sendFail(ws, 'nonExistingUsername');
        return;
    }
    let realJSONDATA = {
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
        .then((timetable) => {
        realJSONDATA = timetable;
    })
        .catch((error) => {
        console.error(error);
    });
    user.updateTimeTable(realJSONDATA);
    const TIMETABLE_DATA = user.getTimeTable();
    //create or cache all chatrooms for this timetable
    if (TIMETABLE_DATA !== undefined) {
        const courseIDs = TIMETABLE_DATA.getAllCoursesId();
        for (const courseID of courseIDs) {
            if (!chatserver.isExistingCUID('#' + courseID)) {
                const newChannel = new PublicChannel(courseID);
                chatserver.setCachePublicChannel(newChannel);
            }
            else {
                await chatserver.getChannelByCUID('#' + courseID);
            }
        }
        sendSucces(ws, TIMETABLE_DATA);
    }
    else {
        sendFail(ws, 'timeTableNotFound');
    }
    return;
}
function sendFail(ws, typeOfFail) {
    debug('sendFail');
    const answer = {
        command: 'requestTimetableSendback',
        payload: { succeeded: false, typeOfFail: typeOfFail },
    };
    ws.send(JSON.stringify(answer));
}
function sendSucces(ws, timetable) {
    debug('sendSucces');
    const ttb = timetable.toJSON();
    const answer = {
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
function createTimetable(curlCommandToken) {
    return new Promise((resolve, reject) => {
        const timeTable = {
            timeSlots: [],
        };
        exec(curlCommandToken, (error, stdout, stderr) => {
            if (error) {
                reject(`error: ${error.message}`);
            }
            else if (stdout) {
                const token_data = JSON.parse(stdout);
                const access_token = token_data.access_token;
                const curlCommandID = `curl --location --request GET "${IDUrl}" \
        --header "Authorization: Bearer ${access_token}" \
        --insecure`;
                exec(curlCommandID, (error, stdout, stderr) => {
                    if (error) {
                        reject(`error: ${error.message}`);
                    }
                    else if (stdout) {
                        const IDinfo = JSON.parse(stdout);
                        const userKUL_ID = IDinfo.d.results[0]?.id;
                        const dataUrl = `https://webwsq.aps.kuleuven.be/sap/opu/odata/sap/zc_ep_uurrooster_oauth_srv/users('${userKUL_ID}')/classEvents?$format=json`;
                        const curlCommandData = `curl --location --request GET "${dataUrl}" \
            --header "Authorization: Bearer ${access_token}" \
            --insecure`;
                        exec(curlCommandData, (error, stdout, stderr) => {
                            if (error) {
                                reject(`error: ${error.message}`);
                            }
                            else if (stdout) {
                                const dataInfo = JSON.parse(stdout);
                                const list = dataInfo.d.results;
                                const locationPromises = [];
                                list.forEach((element) => {
                                    const locationUrl = element.locations.__deferred.uri + '?$format=json';
                                    const curlCommandLocation = `curl --location --request GET "${locationUrl}" \
                  --header "Authorization: Bearer ${access_token}" \
                  --insecure`;
                                    const locationPromise = new Promise((resolve, reject) => {
                                        exec(curlCommandLocation, (error, stdout, stderr) => {
                                            if (error) {
                                                reject(`error: ${error.message}`);
                                            }
                                            else if (stdout) {
                                                const locationInfo = JSON.parse(stdout);
                                                const building = locationInfo.d.results[0]?.mnemonic; //FIXME:
                                                timeTable.timeSlots.push({
                                                    longDescription: element.longDescription,
                                                    weekDay: element.weekDay + ' ',
                                                    startTime: element.startTime,
                                                    endTime: element.endTime,
                                                    building: building,
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
//# sourceMappingURL=request-timetable.js.map