// @Author John Gao
// @date-start 07/03/2023, @date-updated 21/03/2023

import type { DOMWindow } from 'jsdom';

/**
 * This function will show the user a notification, using a toast (bootstrap).
 * When called, a notification pops up in the top right corner, and disappears automatically after 6 seconds using setTimeout.
 * @param document Document, HTML file containing the toast
 * @param window Window, the opened window in the browser
 * @param sender string, the person sending the message to the user
 * @returns number, the timeout id of the notification
 */
export function showNotification(document: Document, window: Window | DOMWindow, sender: string): number {
  if (typeof window !== 'undefined') {
    const element = document.getElementById('myToast') as HTMLElement;
    const body = document.getElementById('toastbody') as HTMLElement;

    if (!element.classList.contains('show')) {
      element.classList.add('show');
      body.innerText = 'You just received a message from ' + sender;

      const element_id = window.setTimeout(function () {
        element.classList.remove('show');
      }, 6000);

      // const closebutton = document.getElementById('closeBtn') as HTMLButtonElement;
      // closebutton.addEventListener('click', () => {
      //   closeNotification(document, window, element_id);
      // });

      return element_id;
    } else {
      return 0;
    }
  } else {
    return 0;
  }
}

/**
 * This function will close the toast notification and clear its timeout value using the timeout id.
 * @param document Document, HTML file containing the toast
 * @param window Window, the opened window in the browser
 * @param element_id number, the timeout id of the notification to be closed
 */
export function closeNotification(document: Document, window: Window | DOMWindow, element_id: number) {
  if (typeof window !== 'undefined') {
    const element = document.getElementById('myToast') as HTMLElement;
    if (element_id) {
      clearTimeout(element_id);
      element.classList.remove('show');

      // const closebutton = document.getElementById('closeBtn') as HTMLButtonElement;
      // closebutton.removeEventListener('click', () => {
      //   closeNotification(document, window, element_id);
      // });
    }
  }
}
