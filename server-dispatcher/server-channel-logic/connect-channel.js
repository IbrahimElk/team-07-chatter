import Debug from 'debug';
const debug = Debug('select-channel.ts');
export async function connectChannel(load, chatServer, ws) {
    const checkMe = await chatServer.getUserBySessionID(load.sessionID);
    //Check if the user is connected
    if (checkMe === undefined) {
        sendFail(ws, 'userNotConnected');
        return;
    }
    debug('Loading' + checkMe?.getUUID() + 'into channel' + load.channelCUID);
    const checkChannel = await chatServer.getChannelByCUID(load.channelCUID);
    //Check if the friend exists
    if (checkChannel === undefined) {
        sendFail(ws, 'channelNotExisting');
        return;
    }
    if (!checkChannel.isAllowedToConnect(checkMe)) {
        sendFail(ws, 'userNotAllowedToConnect');
        return;
    }
    checkMe.connectToChannel(checkChannel, ws);
    checkChannel.systemAddConnected(checkMe);
    await sendSucces(ws, checkChannel, checkMe, chatServer);
    return;
}
// TODO: INITIALIZE ALL POSSIBLE CHATROOMS FOR A CERTAIN USER IF IT DOESNT EXIST YET THROUGH INFORMATION IN JSON.
// SEE chatserver.cuid for all possible existing chatrooms.
// WE NEMEN AAN DAT DE LESSON NAMES ALLEMAAL VERSCHILLEND ZIJN EN UNIEK.
// OF ER BESTAAT WAARSCHIJNLIJK VOOR ELKE LES
// function joinAllChatRooms(user: User, lesson: string, server: ChatServer) {
//   // FOR EACH LESSON, DOES THE RESPECTIVE CHANNEL ALREADY EXIST?
//   if (!server.cuidAlreadyInUse('#' + lesson)) {
//     // } else {
//     const nwchannel = new PublicChannel(lesson, '#' + lesson);
//     server.setCachePublicChannel(nwchannel);
//     user.addPublicChannel(nwchannel.getCUID());
//     nwchannel.addUser(user.getUUID());
//   }
//   //   }
//   // }
// }
function sendFail(ws, typeOfFail) {
    const answer = {
        command: 'connectChannelSendback',
        payload: { succeeded: false, typeOfFail: typeOfFail },
    };
    ws.send(JSON.stringify(answer));
}
async function sendSucces(ws, channel, user, chatServer) {
    const msgback = {
        connections: new Array(),
        messages: new Array(),
    };
    const connectedUsersFromChannel = channel.getConnectedUsers();
    for (const uuid of connectedUsersFromChannel) {
        const user = await chatServer.getUserByUUID(uuid);
        if (user)
            msgback.connections.push(user.getPublicUser());
    }
    const messagesFromChannel = channel.getMessages();
    for (const message of messagesFromChannel) {
        const messageUser = await chatServer.getUserByUUID(message.getUUID());
        if (messageUser) {
            msgback.messages.push({
                date: message.getDate().toString(),
                user: messageUser.getPublicUser(),
                text: message.getText(),
                trust: message.getTrust(),
            });
        }
        else {
            msgback.messages.push({
                date: message.getDate().toString(),
                user: {
                    UUID: '@deleted-user',
                    name: 'deleted-user',
                    profilePicture: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII',
                },
                text: message.getText(),
                trust: message.getTrust(),
            });
        }
    }
    const messageSendback = {
        command: 'channelInfo',
        payload: msgback,
    };
    ws.send(JSON.stringify(messageSendback));
    const answer = {
        command: 'connectChannelSendback',
        payload: { succeeded: true, user: user.getPublicUser() },
    };
    // FOR EVERY CLIENT IN CHANNEL
    for (const client of channel.getConnectedUsers()) {
        const clientUser = await chatServer.getUserByUUID(client);
        if (clientUser === undefined)
            return;
        const clientWs = clientUser.getChannelWebSockets(channel);
        if (clientWs.size === 0)
            return;
        // FOR EVERT TAB OPENED
        for (const tab of clientWs) {
            tab.send(JSON.stringify(answer));
        }
    }
}
//# sourceMappingURL=connect-channel.js.map