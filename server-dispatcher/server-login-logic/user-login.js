import Debug from 'debug';
import { createFakeTimetable } from '../../objects/timeTable/fakeTimeTable.js';
import { PublicChannel } from '../../objects/channel/publicchannel.js';
const debug = Debug('user-login.ts');
export async function userLogin(load, chatserver, ws) {
    const checkPerson = await chatserver.getUserByUUID(load.usernameUUID);
    //Check if a user exists with this name, otherwise a user could be created
    if (checkPerson === undefined) {
        sendFail(ws, 'nonExistingName');
        return;
    }
    //Check if passwords match
    if (checkPerson.getPassword() !== load.password) {
        sendFail(ws, 'falsePW');
        return;
    }
    checkPerson.setWebsocket(ws);
    checkPerson.setSessionID(load.sessionID);
    chatserver.cacheUser(checkPerson);
    // (*) REQUEST USER DATA WITH ACCESS TOKEN:
    const uNumberVanStudent = '234KBHFHB'; //FIXME: unumber fix
    const POSTargument = generateTimeTableQuery(uNumberVanStudent);
    // use postargument to contruct http request to kuleuven database
    // format user data response into kulTimeTable
    let JSONDATA = {
        timeSlots: [],
    };
    // PROCESSING
    JSONDATA = createFakeTimetable(); // TODO: mag weg wanneer (*) klaar is.
    const TIMETABLE_DATA = requestTimetable(checkPerson, JSONDATA);
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
        sendSucces(ws, checkPerson, TIMETABLE_DATA.toJSON());
    }
    else {
        sendFail(ws, 'timeTableNotFound'); //FIXME: must require client to re-do registration.
    }
    return;
}
function sendFail(ws, typeOfFail) {
    debug('sendFail');
    const answer = {
        command: 'loginSendback',
        payload: { succeeded: false, typeOfFail: typeOfFail },
    };
    ws.send(JSON.stringify(answer));
}
function sendSucces(ws, user, timeTable) {
    debug('sendSucces');
    const answer = {
        command: 'loginSendback',
        payload: {
            succeeded: true,
            user: user.getPublicUser(),
            timetable: timeTable,
        },
    };
    ws.send(JSON.stringify(answer));
}
/**
 * Creates a timetable query for the KUL API for a specific student and for just today's classes.
 * @param uNumber uNumnber of the student.
 * @returns The timetable query for the KUL API.
 */
function generateTimeTableQuery(uNumber) {
    return ('https://webwsq.aps.kuleuven.be/sap/opu/odata/sap/zc_ep_uurrooster_oauth_srv/users(’' +
        uNumber +
        '’)/classEvents?$filter=date eq datetime’' +
        formattedDate() +
        '’&$format=json');
}
/**
 * Formats the current date as a string in the format "YYYY-M-DT00:00:00".
 * @returns The formatted date string.
 */
function formattedDate() {
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
/**
 * Checks for a current ongoing Class and returns it if non ongoing it returns the upcoming one.
 * @returns
 */
function requestTimetable(user, data) {
    user.updateTimeTable(data);
    const timeTable = user.getTimeTable();
    return timeTable;
}
//# sourceMappingURL=user-login.js.map