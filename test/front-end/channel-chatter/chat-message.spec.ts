// Ibrahim El Kaddouri
// 8/05/2023
import { showMessage } from '../../../src/front-end/channel-chatter/chat-message.js';
import { expect, vi, describe, it, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import { PublicUser } from '../../../src/front-end/proto/client-types.js';

describe('showMessage', () => {
  const dom = new JSDOM(`<!DOCTYPE html><html><head></head><body></body></html>`);
  const mockDocument = dom.window.document;
  const templateAndMessageList = `
  <ul class="list-group-1" id="messageList"></ul>
  <template  id="message">
    <div class="progress-bar" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
    <img src="" class="img" alt="..." id="message-profile-image" width="40" height="40"/>
    <h5 class="mb-1"><strong></strong></h5>
    <small class="text-muted d-flex align-items-end"></small>
    <p class="h5 mb-1"></p>
  </template>
`;
  mockDocument.body.innerHTML = templateAndMessageList;
  it('displays a chat message with good trust level', () => {
    // Set up test data
    const date = '2023-05-08 15:00:00';
    const sender: PublicUser = {
      name: 'Alice',
      profilePicture: 'https://example.com/profile.png',
      UUID: '@Alice',
    };
    const text = 'Hello, world!';
    const trust = 0.8;
    // Call the function being tested
    showMessage(mockDocument, date, sender, text, trust);
    // Check that the message is displayed correctly
    const templateMessageTag: HTMLUListElement = mockDocument.getElementById('messageList') as HTMLUListElement;
    expect(templateMessageTag).toBeTruthy();
    expect(templateMessageTag?.querySelector('.mb-1')?.textContent).toBe('Alice');
    expect(templateMessageTag?.querySelector('.text-muted.d-flex.align-items-end')?.textContent).toBe(date);
    expect(templateMessageTag?.querySelector('.h5.mb-1')?.textContent).toBe(text);
    expect((templateMessageTag?.querySelector('.progress-bar') as HTMLElement)?.style.height).toBe('80%');
    expect(templateMessageTag?.querySelector('.progress-bar')?.classList.contains('bg-success')).toBe(true);
    expect((templateMessageTag?.querySelector('#message-profile-image') as HTMLImageElement)?.src).toBe(
      'https://example.com/profile.png'
    );
  });
});
