import Debug from 'debug';
const debug = Debug('user-logout.ts');
export async function userLogout(load, chatserver, ws) {
    const user = await chatserver.getUserBySessionID(load.sessionID);
    //Check if a user exists with this name, otherwise a user could be created
    if (user === undefined) {
        sendFail(ws, 'nonExistingName');
        return;
    }
    const webSocketSet = user.getWebSocket();
    await chatserver.unCacheUser(user);
    for (const webSocket of webSocketSet) {
        sendSucces(webSocket);
    }
}
//These functions are marked as export for testing purposes, so aren't called anywhere else
export function sendFail(ws, typeOfFail) {
    debug('sendFail');
    const answer = {
        command: 'logoutSendback',
        payload: { succeeded: false, typeOfFail: typeOfFail },
    };
    ws.send(JSON.stringify(answer));
}
export function sendSucces(ws) {
    debug('sendSucces');
    const answer = {
        command: 'logoutSendback',
        payload: { succeeded: true },
    };
    ws.send(JSON.stringify(answer));
}
//# sourceMappingURL=user-logout.js.map