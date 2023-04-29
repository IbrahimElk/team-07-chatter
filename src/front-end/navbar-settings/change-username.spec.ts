import { expect, vi, describe, it, beforeEach } from 'vitest';
import { MockWebSocket } from '../proto/__mock__/ws-mock.js';
import { JSDOM } from 'jsdom';
import { ClientUser } from '../client-dispatcher/client-user.js';
import { changeUsername } from './change-username.js';

describe('JSON by the client is correctly sent', () => {
  let dom: JSDOM;
  let document: Document;
  beforeEach(() => {
    dom = new JSDOM('<!DOCTYPE html>');
    document = dom.window.document;
    new ClientUser(new MockWebSocket('URL'));
    console.log(ClientUser.getWebSocket());
  });
  it('changeUsername', () => {
    
   
    const spySend = vi.spyOn(ClientUser.getWebSocket(), 'send');
    changeUsername(ClientUser.getWebSocket()) 
    expect(spySend).toHaveBeenNthCalledWith(
      1,
      JSON.stringify({
        command: 'changeUsername',
        payload: {newUsername: 'username'},
      })
    );
  });

});
