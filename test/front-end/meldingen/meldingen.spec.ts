import { expect, it, describe, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import { closeNotification, showNotification } from '../../../src/front-end/meldingen/meldingen.js';

describe('showNotification', () => {
  const dom = new JSDOM(
    '<!DOCTYPE html><div class="toast" id="myToast"></div><div class="toast-body" id="toastbody"></div><button type="button" class="btn-close" id="closeBtn"></button>'
  );
  const document = dom.window.document;
  const window = dom.window;
  const name = 'testuser';
  const element = document.getElementById('myToast') as HTMLElement;
  const body = document.getElementById('toastbody') as HTMLElement;

  it('changes the class of the toast to show it, hides it after 6 seconds', () => {
    vi.useFakeTimers();
    showNotification(document, window, name);
    expect(element.classList.contains('show')).toBe(true);
    expect(body.innerText).toContain(name);
    vi.runAllTimers();
    expect(element.classList.contains('show')).toBe(false);
    vi.useRealTimers();
  });
});

describe('closeNotification', () => {
  const dom = new JSDOM(
    '<!DOCTYPE html><div class="toast" id="myToast"></div><div class="toast-body" id="toastbody"></div><button type="button" class="btn-close" id="closeBtn"></button>'
  );
  const document = dom.window.document;
  const window = dom.window;
  const name = 'testuser';
  const element = document.getElementById('myToast') as HTMLElement;

  it('clears timeout of toast and hides it', () => {
    const spyOnClearTimeOut = vi.spyOn(global, 'clearTimeout');
    const id = showNotification(document, window, name);
    expect(element.classList.contains('show')).toBe(true);
    closeNotification(document, window, id);
    expect(element.classList.contains('show')).toBe(false);
    expect(spyOnClearTimeOut).toHaveBeenCalledOnce();
  });
});
