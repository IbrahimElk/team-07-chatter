/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { expect, vi, describe, it, beforeEach } from 'vitest';
import { ClientLogin } from './client-login-logic.js';
import { MockWebSocket } from '../protocol/__mock__/ws-mock.js';
import { JSDOM } from 'jsdom';
import { ClientUser } from './client-user.js';

describe('JSON by the client is correctly sent', () => {
  let dom: JSDOM;
  let user: ClientUser;
  let document: Document;
  beforeEach(() => {
    dom = new JSDOM('<!DOCTYPE html>');
    user = new ClientUser();
    document = dom.window.document;
  });
  it('login', () => {
    const username_input = document.createElement('input');
    username_input.id = 'IdVanInputTagUsernameLogin';
    username_input.value = 'testuser';

    const password_input = document.createElement('input');
    password_input.id = 'IdVanInputTagPasswordLogin';
    password_input.value = 'testpassword';

    document.body.appendChild(username_input);
    document.body.appendChild(password_input);

    const socket = new MockWebSocket('URL');
    const spySend = vi.spyOn(socket, 'send');
    ClientLogin.login(socket, document, user);
    expect(spySend).toHaveBeenNthCalledWith(
      1,
      JSON.stringify({
        command: 'logIn',
        payload: { name: 'testuser', password: 'testpassword' },
      })
    );
    expect(user.getName()).toEqual('testuser');
  });

  it('registration', () => {
    const username_input = document.createElement('input');
    username_input.id = 'IdVanInputTagUsernameRegistration';
    username_input.value = 'testuser';

    const password_input = document.createElement('input');
    password_input.id = 'IdVanInputTagPasswordRegistration';
    password_input.value = 'testpassword';

    document.body.appendChild(username_input);
    document.body.appendChild(password_input);

    const socket = new MockWebSocket('URL');
    const spySend = vi.spyOn(socket, 'send');
    ClientLogin.registration(socket, document, user);
    expect(spySend).toHaveBeenNthCalledWith(
      1,
      JSON.stringify({
        command: 'registration',
        payload: { name: 'testuser', password: 'testpassword' },
      })
    );
    expect(user.getName()).toEqual('testuser');
  });
});
