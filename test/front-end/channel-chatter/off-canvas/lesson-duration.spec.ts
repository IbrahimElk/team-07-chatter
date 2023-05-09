import { makeProgress } from '../../../../src/front-end/channel-chatter/off-canvas/lesson-duration.js';
import { expect, vi, describe, it, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import { ClientUser } from '../../../../src/front-end/client-dispatcher/client-user.js';

describe('makeProgress', () => {
  it('updates the progress bar and sets a timeout', () => {
    const dom = new JSDOM('<html><div id="progress"></div></html>');
    const bar = dom.window.document.getElementById('progress') as HTMLDivElement;

    // Mock the getCurrentClassRoom method to return a classroom object
    vi.spyOn(ClientUser, 'getCurrentClassRoom').mockReturnValue({
      description: 'description',
      startTime: Date.now() - 10000,
      endTime: Date.now() + 10000,
      building: 'building',
    });
    console.log(bar);
    // Call the function
    makeProgress(bar);

    // Expect the progress bar to have been updated
    expect(bar.style.width).toBe('50%');
    expect(bar.innerText).toBe('50%');
  });

  it('does nothing when no classroom is available', () => {
    const dom = new JSDOM('<html><div id="progress"></div></html>');
    const bar = dom.window.document.getElementById('progress') as HTMLDivElement;

    // Mock the getCurrentClassRoom method to return null
    vi.spyOn(ClientUser, 'getCurrentClassRoom').mockReturnValue(undefined);

    // Call the function
    makeProgress(bar);

    // Expect the progress bar not to have been updated and setTimeout not to have been called
    expect(bar.style.width).toBe('');
    expect(bar.innerText).toBe(undefined);
  });
});
