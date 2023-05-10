import { MockWebSocket, MockWebSocketServer } from '../protocol/__mock__/ws-mock.js';

import { User } from '../objects/user/user.js';
import type { Message } from '../objects/message/message.js';
import { sendMessage } from './send-message.js';

import { describe, expect, it, vi } from 'vitest';
import { DirectMessageChannel } from '../objects/channel/directmessagechannel.js';
import { ChatServer } from '../server/chat-server.js';

describe('sendMessage', () => {
  it('should add a message to the channel and send it to all users', async () => {
    // Set up test data
    const serverSocket = new MockWebSocketServer('urll');
    const socket1 = new MockWebSocket('URL');
    const socket2 = new MockWebSocket('URL');
    const spySend = vi.spyOn(socket1, 'send');
    const user1 = new User('user1', 'password1', '@342342');
    user1.setWebsocket(socket1);
    const user2 = new User('user2', 'password2', '@323423');
    user2.setWebsocket(socket2);
    const friendChannel = new DirectMessageChannel('channelName', user1.getUUID(), user2.getUUID(), '$342324');
    const date = new Date().toISOString();
    const text = 'Hello, world!';
    const load = {
      command: 'MessageSendback',
      payload: {
        succeeded: true,
        text,
        date,
        sender: user1.getName(),
        trustLevel: 0.5,
      },
    };
    const chatServer = new ChatServer(
      serverSocket,
      new Set<string>(['@342342', '@323423']),
      new Set<string>(['$342324'])
    );
    chatServer.cacheUser(user1);
    chatServer.cacheUser(user2);
    chatServer.setCacheFriendChannel(friendChannel);
    // Call the function under test
    await sendMessage(user1, friendChannel, chatServer, load.payload.text, load.payload.date, load.payload.trustLevel);
    // Check that the message was added to the channel
    expect(friendChannel.getMessages().length).toBe(1);
    friendChannel.getMessages().forEach((message: Message) => {
      expect(message.getUserName()).toBe(user1.getName());
      expect(message.getDate()).toBe(date);
      expect(message.getText()).toBe(text);
    });
    // Check that the message was sent to all users in the channel
    expect(spySend).toHaveBeenCalledWith(JSON.stringify(load));
    expect(spySend).toHaveBeenCalledWith(JSON.stringify(load));
  });
});
