import Debug from 'debug';
const debug = Debug('user-login.ts');
export async function validateSession(load, chatserver, ws) {
    const check = await chatserver.getUserBySessionID(load.sessionID);
    //Check if the given sessionID is valid
    if (check === undefined) {
        sendFail(ws, 'nontConnected');
        return;
    }
    else {
        sendSucces(ws);
        return;
    }
}
function sendFail(ws, typeOfFail) {
    debug('sendFail');
    const answer = {
        command: 'validateSessionSendback',
        payload: { succeeded: false, typeOfFail: typeOfFail },
    };
    ws.send(JSON.stringify(answer));
}
function sendSucces(ws) {
    debug('sendSucces');
    const answer = {
        command: 'validateSessionSendback',
        payload: { succeeded: true },
    };
    ws.send(JSON.stringify(answer));
}
//# sourceMappingURL=validate-session.js.map