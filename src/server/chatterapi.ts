import type { ChatServer } from './chat-server.js';

export class ChatterAPI {
  private static chatServer: ChatServer;

  constructor(chatServer: ChatServer) {
    ChatterAPI.chatServer = chatServer;
  }

  public static getChatServer(): ChatServer {
    return ChatterAPI.chatServer;
  }
}
