// Ibrahim El Kaddouri
// 8/05/2023
import { resize } from '../../../src/front-end/channel-chatter/card-max-height.js';
import { expect, vi, describe, it, beforeEach } from 'vitest';
import { JSDOM, DOMWindow } from 'jsdom';

describe('resize function', () => {
  const dom: JSDOM = new JSDOM(`<!DOCTYPE html><div id="listUsers"></div><ul id="messageList"></ul>`);
  const mockDocument: Document = dom.window.document;
  const listUsers = mockDocument.getElementById('listUsers') as HTMLDivElement;
  const messageList = mockDocument.getElementById('messageList') as HTMLUListElement;
  it('should resize listUsers and messageList elements to fit the screen height', () => {
    const ACTIVE_USERS_CARD_HEIGHT = 50;
    const MESSAGE_LIST_CARD_HEIGHT = 100;
    const screenHeight = 500;

    resize(mockDocument, screenHeight, ACTIVE_USERS_CARD_HEIGHT, MESSAGE_LIST_CARD_HEIGHT);

    expect(listUsers.style.height).toBe(`${screenHeight - ACTIVE_USERS_CARD_HEIGHT}px`);
    expect(messageList.style.height).toBe(`${screenHeight - MESSAGE_LIST_CARD_HEIGHT}px`);
  });
});
