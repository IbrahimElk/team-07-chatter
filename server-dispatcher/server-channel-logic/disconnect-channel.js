import Debug from 'debug';
const debug = Debug('select-channel.ts');
export async function disconnectChannel(load, chatServer, ws) {
    const checkMe = await chatServer.getUserBySessionID(load.sessionID);
    //Check if the user is connected
    if (checkMe === undefined) {
        sendFail(ws, 'userNotConnected');
        return;
    }
    const checkChannel = await chatServer.getChannelByCUID(load.channelCUID);
    //Check if the channel exists
    if (checkChannel === undefined) {
        sendFail(ws, 'channelNotExisting');
        return;
    }
    if (!checkChannel.isConnectedUser(checkMe)) {
        sendFail(ws, 'userNotConnectedToChannel');
        return;
    }
    checkMe.disconnectFromChannel(checkChannel, ws);
    //if no more ws from user in channel
    if (!checkMe.isConnectedToChannel(checkChannel)) {
        checkChannel.systemRemoveConnected(checkMe);
        await sendSucces(ws, checkChannel, checkMe, chatServer);
        return;
    }
    return;
}
function sendFail(ws, typeOfFail) {
    const answer = {
        command: 'disconnectChannelSendback',
        payload: { succeeded: false, typeOfFail: typeOfFail },
    };
    ws.send(JSON.stringify(answer));
}
async function sendSucces(ws, channel, user, chatServer) {
    const answer = {
        command: 'disconnectChannelSendback',
        payload: {
            succeeded: true,
            user: user.getPublicUser(),
        },
    };
    // for every connected user in channel
    for (const connectedUUID of channel.getConnectedUsers()) {
        const connectedUser = await chatServer.getUserByUUID(connectedUUID);
        if (connectedUser === undefined)
            return;
        const connectedWS = connectedUser.getChannelWebSockets(channel);
        if (connectedWS.size === 0)
            return;
        // for every connected websocket in channel
        for (const tab of connectedWS) {
            tab.send(JSON.stringify(answer));
        }
    }
}
//# sourceMappingURL=disconnect-channel.js.map