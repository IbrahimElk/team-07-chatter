// Ibrahim El Kaddouri
// 8/05/2023
import { showMessage } from '../../../src/front-end/channel-chatter/chat-message.js';
import { expect, vi, describe, it, beforeEach } from 'vitest';
import { JSDOM, DOMWindow } from 'jsdom';
import { PublicUser } from '../../../src/front-end/proto/client-types.js';
describe('showMessage', () => {
  const dom = new JSDOM(`<!DOCTYPE html><html><head></head><body></body></html>`);
  const document = dom.window.document;
  const template = `
  <ul class="list-group-1" id="messageList"></ul>
  <template  id="message">
    <div class="btn text-left"
    id="messageButton"
    data-bs-toggle="offcanvas"
    href="#offcanvasExample"
    role="button"
    aria-controls="offcanvasExample"
    ><a class="list-group-item list-group-item-action bg-blue text-dark">
      <div class="d-flex w-100 p-2">
        <div class="progress progress-bar-vertical">
          <div class="progress-bar" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
          </div>
        </div>
        <div class="d-flex p-2">
          <img src="" class="img" alt="..." id="message-profile-image" width="40" height="40"/>
        </div>
        <div class="d-flex flex-column flex-fill">
          <div class="d-flex justify-content-between">
            <h5 class="mb-1"><strong></strong></h5>
            <small class="text-muted d-flex align-items-end"></small>
          </div>
          <p class="h5 mb-1"></p>
        </div>
      </div>
    </a>
  </template>
`;
  document.body.innerHTML = template;
  const templateMessageTag: HTMLTemplateElement = document.getElementById('message') as HTMLTemplateElement;
  const copyOfTemplateTag: DocumentFragment = document.importNode(templateMessageTag.content, true);
  const sender = { name: 'Alice', UUID: '@Alice', profilePicture: 'https://picsum.photos/40/40' };
  const date = 'May 8, 2023';
  const text = 'Hello, world!';
  const trustLevel = '75%';
  const trustColor = 'bg-success';
  // Set the message sender's name, with decoding to prevent HTML injection attacks
  (copyOfTemplateTag.querySelector('.mb-1') as HTMLElement).textContent = sender.name;
  // Set the message date and time
  (copyOfTemplateTag.querySelector('.text-muted.d-flex.align-items-end') as HTMLElement).textContent = date;
  // Set the message text, with decoding to prevent HTML injection attacks
  (copyOfTemplateTag.querySelector('.h5.mb-1') as HTMLElement).textContent = text;
  // Set the trust level bar height based on trust level
  (copyOfTemplateTag.querySelector('.progress-bar') as HTMLElement).style.height = trustLevel;
  // Set the trust level bar color based on trust level
  (copyOfTemplateTag.querySelector('.progress-bar') as HTMLElement).classList.add(trustColor);
  // Set the sender's profile picture URL
  (copyOfTemplateTag.getElementById('message-profile-image') as HTMLImageElement).src = sender.profilePicture;

  const messageList: HTMLUListElement = dom.window.document.getElementById('messageList') as HTMLUListElement;
  messageList.prepend(copyOfTemplateTag);
  console.log(messageList.innerHTML);

  it('displays a chat message with good trust level', () => {
    //   // Set up test data
    //   const date = '2023-05-08 15:00:00';
    //   const sender: PublicUser = {
    //     name: 'Alice',
    //     profilePicture: 'https://example.com/profile.png',
    //     UUID: '@Alice',
    //   };
    //   const text = 'Hello, world!';
    //   const trust = 0.8;
    //   // Call the function being tested
    //   showMessage(mockDocument, date, sender, text, trust);
    //   // Check that the message is displayed correctly
    //   const messageElement = mockDocument.querySelector('.message');
    //   // expect(messageElement).toBeTruthy();
    //   expect(messageElement?.querySelector('.mb-1')?.textContent).toBe('Alice');
    //   expect(messageElement?.querySelector('.text-muted.d-flex.align-items-end')?.textContent).toBe(date);
    //   expect(messageElement?.querySelector('.h5.mb-1')?.textContent).toBe(text);
    //   expect((messageElement?.querySelector('.progress-bar') as HTMLElement)?.style.height).toBe('80%');
    //   expect(messageElement?.querySelector('.progress-bar')?.classList.contains('bg-success')).toBe(true);
    //   expect((messageElement?.querySelector('#message-profile-image') as HTMLImageElement)?.src).toBe(
    //     'https://example.com/profile.png'
    //   );
  });
});
