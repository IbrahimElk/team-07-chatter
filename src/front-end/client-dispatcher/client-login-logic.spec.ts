// /* eslint-disable @typescript-eslint/no-unsafe-member-access */
// /* eslint-disable @typescript-eslint/no-unsafe-assignment */
// // Author: Ibrahim El Kaddouri
// // Date: 16/3/2023

import { expect, vi, describe, it, beforeEach } from 'vitest';
// import { ClientLogin } from './client-login-logic.js';
// import { MockWebSocket } from '../../protocol/__mock__/ws-mock.js';
// import { JSDOM } from 'jsdom';

describe('JSON by the client is correctly sent', () => {
  //   let dom: JSDOM;
  //   let document: Document;
  //   beforeEach(() => {
  //     dom = new JSDOM('<!DOCTYPE html>');
  //     document = dom.window.document;
  //   });
  it('login', () => {
    //     const username_input = document.createElement('input');
    //     username_input.id = ClientLogin.Id_of_HTML_tags.id_input_username_login;
    //     username_input.value = 'testuser';
    //     const password_input = document.createElement('input');
    //     password_input.id = ClientLogin.Id_of_HTML_tags.id_input_password_login;
    //     password_input.value = 'testpassword';
    //     document.body.appendChild(username_input);
    //     document.body.appendChild(password_input);
    //     const socket = new MockWebSocket('URL');
    //     const spySend = vi.spyOn(socket, 'send');
    //     ClientLogin.login(socket, document);
    //     expect(spySend).toHaveBeenNthCalledWith(
    //       1,
    //       JSON.stringify({
    //         command: 'logIn',
    //         payload: { usernameUuid: 'testuser', password: 'testpassword' },
    //       })
    //     );
  });

  //   it('registration', () => {
  //     const username_input = document.createElement('input');
  //     username_input.id = ClientLogin.Id_of_HTML_tags.id_input_username_reg;
  //     username_input.value = 'testuser';

  //     const password_input = document.createElement('input');
  //     password_input.id = ClientLogin.Id_of_HTML_tags.id_input_password_reg;
  //     password_input.value = 'testpassword';

  //     document.body.appendChild(username_input);
  //     document.body.appendChild(password_input);

  //     const socket = new MockWebSocket('URL');
  //     const spySend = vi.spyOn(socket, 'send');
  //     ClientLogin.registration(socket, document);
  //     expect(spySend).toHaveBeenNthCalledWith(
  //       1,
  //       JSON.stringify({
  //         command: 'registration',
  //         payload: { usernameUuid: 'testuser', password: 'testpassword' },
  //       })
  //     );
  //   });
});
