export class ChatterAPI {
    static chatServer;
    constructor(chatServer) {
        ChatterAPI.chatServer = chatServer;
    }
    static getChatServer() {
        return ChatterAPI.chatServer;
    }
}
//# sourceMappingURL=chatter-api.js.map