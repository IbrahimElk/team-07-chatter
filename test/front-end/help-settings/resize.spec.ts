// Ibrahim El Kaddouri
// 8/05/2023
import { channelChatResize, friendChatResize } from '../../../src/front-end/help-settings/resize.js';
import { expect, vi, describe, it, beforeEach } from 'vitest';
import { JSDOM, DOMWindow } from 'jsdom';

describe('resize functions', () => {
  const dom: JSDOM = new JSDOM(`<!DOCTYPE html><div id="listUsers"></div><ul id="messageList"></ul>`);
  const mockDocument: Document = dom.window.document;
  const listUsers = mockDocument.getElementById('listUsers') as HTMLDivElement;
  const messageList = mockDocument.getElementById('messageList') as HTMLUListElement;
  it('should resize listUsers and messageList elements to fit the screen height', () => {
    const ACTIVE_USERS_CARD_HEIGHT = 50;
    const MESSAGE_LIST_CARD_HEIGHT = 100;
    const screenHeight = 500;

    channelChatResize(mockDocument, screenHeight, ACTIVE_USERS_CARD_HEIGHT, MESSAGE_LIST_CARD_HEIGHT);

    expect(listUsers.style.height).toBe(`${screenHeight - ACTIVE_USERS_CARD_HEIGHT}px`);
    expect(messageList.style.height).toBe(`${screenHeight - MESSAGE_LIST_CARD_HEIGHT}px`);
  });
  it('friendChatResize should resize the chat message list', () => {
    const windowInnerHeight = 600;

    friendChatResize(mockDocument, windowInnerHeight, 270);

    expect(messageList.style.height).toBe('330px');
  });
});
