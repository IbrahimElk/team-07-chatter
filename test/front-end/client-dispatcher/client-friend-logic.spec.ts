// Author: Ibrahim El Kaddouri
// Date: 16/3/2023

import { expect, vi, describe, it } from 'vitest';
import { ClientFriend } from '../../../src/front-end/client-dispatcher/client-friend-logic.js';
import { MockSessionStorage, MockWebSocket } from '../../../src/front-end/proto/__mock__/ws-mock.js';
import { ClientUser } from '../../../src/front-end/client-dispatcher/client-user.js';
import type * as ServerInterfaceTypes from '../../../src/front-end/proto/server-types.js';
import * as ClientInteraceTypes from '../../../src/front-end/proto/client-types.js';
import { JSDOM } from 'jsdom';

describe('JSON by the client is correctly sent', () => {
  it('addFriend is sent correctly', () => {
    const socket = new MockWebSocket('URL');
    const mockSessionStorage = new MockSessionStorage();
    const mockClient = new ClientUser(socket, mockSessionStorage);

    const spySessionId = vi.spyOn(mockClient, 'getsessionID').mockReturnValue('SESSION_ID');
    const spyWebscoket = vi.spyOn(mockClient, 'getWebSocket').mockReturnValue(socket);
    const spySend = vi.spyOn(socket, 'send');

    const expectedPayload: ClientInteraceTypes.addFriend = {
      command: 'addFriend',
      payload: { sessionID: 'SESSION_ID', friendUUID: 'Vincent' },
    };

    ClientFriend.addFriend(mockClient, 'Vincent');

    expect(spySend).toHaveBeenNthCalledWith(1, JSON.stringify(expectedPayload));
    expect(spyWebscoket).toBeCalledTimes(1);
    expect(spySessionId).toBeCalledTimes(1);
  });
  it('removeFriend is sent correctly', () => {
    const socket = new MockWebSocket('URL');
    const mockSessionStorage = new MockSessionStorage();
    const mockClient = new ClientUser(socket, mockSessionStorage);

    const spySessionId = vi.spyOn(mockClient, 'getsessionID').mockReturnValue('SESSION_ID');
    const spyWebscoket = vi.spyOn(mockClient, 'getWebSocket').mockReturnValue(socket);
    const spySend = vi.spyOn(socket, 'send');

    const expectedPayload: ClientInteraceTypes.removeFriend = {
      command: 'removeFriend',
      payload: { sessionID: 'SESSION_ID', friendUUID: 'Thomas' },
    };
    ClientFriend.removeFriend(mockClient, 'Thomas');

    expect(spySend).toHaveBeenNthCalledWith(1, JSON.stringify(expectedPayload));
    expect(spyWebscoket).toBeCalledTimes(1);
    expect(spySessionId).toBeCalledTimes(1);
  });

  it('getListFriends is sent correctly', () => {
    const socket = new MockWebSocket('URL');
    const mockSessionStorage = new MockSessionStorage();
    const mockClient = new ClientUser(socket, mockSessionStorage);

    const spySessionId = vi.spyOn(mockClient, 'getsessionID').mockReturnValue('SESSION_ID');
    const spyWebscoket = vi.spyOn(mockClient, 'getWebSocket').mockReturnValue(socket);
    const spySend = vi.spyOn(socket, 'send');

    const expectedPayload: ClientInteraceTypes.getList = {
      command: 'getList',
      payload: { sessionID: 'SESSION_ID', string: 'getListFriends' },
    };

    ClientFriend.getListFriends(mockClient);

    expect(spySend).toHaveBeenNthCalledWith(1, JSON.stringify(expectedPayload));
    expect(spyWebscoket).toBeCalledTimes(1);
    expect(spySessionId).toBeCalledTimes(1);
  });
});

describe('JSON by the server is correctly processed', () => {
  it('addFriendSendback is processed correctly', () => {
    const mockHTML = `
      <html>
        <body>
          <div id="friendslist"></div>
          <div id="addFriend"></div>
          <div class="modal-backdrop"></div>
          <template id="friendsList-friend">
            <div>
              <div id="username"></div>
              <img id="friend-profile-picture" />
            </div>
          </template>
        </body>
      </html>
    `;

    const dom = new JSDOM(mockHTML);
    const Mockdocument = dom.window.document;

    const successPayload: ServerInterfaceTypes.addFriendSendback['payload'] = {
      succeeded: true,
      friend: { UUID: '@Alice', name: 'Alice', profilePicture: 'URL' },
    };
    const socket = new MockWebSocket('URL');
    const mockSessionStorage = new MockSessionStorage();
    const mockClient = new ClientUser(socket, mockSessionStorage);

    ClientFriend.addFriendSendback(Mockdocument, successPayload);

    const friendsList = Mockdocument.getElementById('friendslist');
    expect(friendsList?.children.length).toBe(1);
  });
  //
  // de volgende functie removeFriendSendback is html manipulatie waardoor we dit overlaten aan foutherkenning bij zicht ipv unit test
  //
  // it('removeFriendSendback is processed correctly', () => {
  //   // Create a mock DOM environment
  //   const html = `
  //   <html>
  //     <body>
  //       <div id="friendslist">
  //         <div>
  //           <div>
  //             <div frienduuid="friend1">Friend 1</div>
  //           </div>
  //         <div>
  //         </div>
  //           <div>
  //             <div frienduuid="friend2">Friend 2</div>
  //           </div>
  //         <div>
  //       </div>
  //     </body>
  //   </html>
  // `;
  //   const mockWindow = new JSDOM(html).window;

  //   Object.defineProperty(mockWindow, 'sessionStorage', {
  //     value: new MockSessionStorage(),
  //   });
  //   mockWindow.sessionStorage.setItem('selectedFriend', 'friend1');
  //   // Create the payload for removeFriendSendback
  //   const payload: ServerInterfaceTypes.removeFriendSendback['payload'] = {
  //     succeeded: true,
  //   };

  //   // Call the function being tested
  //   ClientFriend.removeFriendSendback(mockWindow, payload);

  //   // Check the result
  //   const expectedHtml = '<div></div>';
  //   const actualHtml = mockWindow.document.getElementById('friendslist')?.innerHTML;
  //   expect(actualHtml).toBe(expectedHtml);
  // });
  it('getListFriendsSendback is processed correctly', () => {
    const mockHTML = `
      <html>
        <body>
          <div id="friendslist"></div>
          <template id="friendsList-friend">
            <div>
              <div id="username"></div>
              <img id="friend-profile-picture" />
            </div>
          </template>
        </body>
      </html>
    `;

    const dom = new JSDOM(mockHTML);
    const Mockdocument = dom.window.document;

    const successPayload: ServerInterfaceTypes.getListFriendSendback['payload'] = {
      succeeded: true,
      friends: [
        {
          name: 'John Doe',
          UUID: '12345',
          profilePicture: 'https://example.com/profile1.jpg',
        },
        {
          name: 'Jane Doe',
          UUID: '67890',
          profilePicture: 'https://example.com/profile2.jpg',
        },
      ],
    };

    ClientFriend.getListFriendsSendback(Mockdocument, successPayload);

    const friendsList = Mockdocument.getElementById('friendslist');
    expect(friendsList?.children.length).toBe(successPayload.friends.length);
  });
});
