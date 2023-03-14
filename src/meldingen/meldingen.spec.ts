import { expect, it, describe } from 'vitest';
import { JSDOM } from 'jsdom';
import { showNotification } from './meldingen.js';

describe('showNotification', () => {
  const dom = new JSDOM(
    '<!DOCTYPE html><div class="toast" id="myToast"></div><div class="toast-body" id="toastbody"></div>'
  );
  const document = dom.window.document;
  const name = 'testuser';
  const element = document.getElementById('myToast') as HTMLElement;
  const body = document.getElementById('toastbody') as HTMLElement;

  /* it('changes the class of the toast to show it', () => {
    showNotification(name);
    console.log(body.innerText);
    expect(element.classList.contains('show')).toBe(true);
  }); */
});
