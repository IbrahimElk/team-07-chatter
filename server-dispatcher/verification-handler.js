// Author: Thomas Evenpoel
// Date: 2023/04/07
import Debug from 'debug';
const debug = Debug('verification-handler.ts');
export async function verificationHandler(verification, server, ws) {
    const user = await server.getUserBySessionID(verification.sessionID);
    if (user !== undefined) {
        if (!user.getVerification()) {
            user.setNgrams(new Map(verification.NgramDelta));
            user.setVerification(true);
            debug('user verification status: ', user.getVerification());
        }
        sendSucces(ws);
    }
    else {
        sendFail(ws, 'userNotConnected');
    }
}
function sendFail(ws, typeOfFail) {
    const answer = {
        command: 'verificationSendback',
        payload: { succeeded: false, typeOfFail: typeOfFail },
    };
    ws.send(JSON.stringify(answer));
}
function sendSucces(ws) {
    const answer = {
        command: 'verificationSendback',
        payload: { succeeded: true },
    };
    ws.send(JSON.stringify(answer));
}
//# sourceMappingURL=verification-handler.js.map