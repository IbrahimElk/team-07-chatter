export async function listfriends(load, chatServer, ws) {
    const user = await chatServer.getUserBySessionID(load.sessionID);
    if (user === undefined) {
        sendFail(ws, 'nonExistingUsername');
        return;
    }
    else {
        const friendsListUuid = user.getFriends();
        const stringList = [];
        for (const uuid of friendsListUuid) {
            const friend = await chatServer.getUserByUUID(uuid);
            if (friend !== undefined) {
                stringList.push(friend.getPublicUser());
            }
        }
        sendSucces(ws, stringList);
        return;
    }
}
function sendFail(ws, typeOfFail) {
    const answer = {
        command: 'getListFriendSendback',
        payload: { succeeded: false, typeOfFail: typeOfFail },
    };
    ws.send(JSON.stringify(answer));
}
function sendSucces(ws, friends) {
    const answer = {
        command: 'getListFriendSendback',
        payload: { succeeded: true, friends: friends },
    };
    ws.send(JSON.stringify(answer));
}
//# sourceMappingURL=list-friends.js.map