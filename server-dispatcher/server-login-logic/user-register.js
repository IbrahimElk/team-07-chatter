import { User } from '../../objects/user/user.js';
import { createFakeTimetable } from '../../objects/timeTable/fakeTimeTable.js';
import Debug from 'debug';
import { PublicChannel } from '../../objects/channel/publicchannel.js';
const debug = Debug('user-register.ts');
export async function userRegister(load, chatserver, ws) {
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
    let JSONDATA = {
        timeSlots: [],
    };
    // PROCESSING
    JSONDATA = createFakeTimetable();
    const TIMETABLE_DATA = getCorrectFormatTimetable(nuser, JSONDATA);
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
        sendSucces(ws, nuser, TIMETABLE_DATA.toJSON());
    }
    else {
        sendFail(ws, 'timeTableNotFound'); //FIXME: must require client to re-do registration.
    }
    return;
}
function sendFail(ws, typeOfFail) {
    debug('sendFail ', typeOfFail);
    const answer = {
        command: 'registrationSendback',
        payload: { succeeded: false, typeOfFail: typeOfFail },
    };
    ws.send(JSON.stringify(answer));
}
function sendSucces(ws, user, timetable) {
    debug('sendSucces');
    const answer = {
        command: 'registrationSendback',
        payload: { succeeded: true, user: user.getPublicUser(), timetable: timetable },
    };
    ws.send(JSON.stringify(answer));
}
/**
 * Checks for a current ongoing Class and returns it if non ongoing it returns the upcoming one.
 * @returns
 */
function getCorrectFormatTimetable(user, data) {
    user.updateTimeTable(data);
    const timeTable = user.getTimeTable();
    return timeTable;
}
function checkPW(password) {
    if (password.length < 8)
        return 'shortPW';
    if (!/[A-Z]/.test(password))
        return 'noUppercaseInPW';
    if (!/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/.test(password))
        return 'noPunctuationInPW';
    return 'true';
}
//# sourceMappingURL=user-register.js.map