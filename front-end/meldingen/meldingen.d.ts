import type { DOMWindow } from 'jsdom';
/**
 * This function will show the user a notification, using a toast (bootstrap).
 * When called, a notification pops up in the top right corner, and disappears automatically after 6 seconds using setTimeout.
 * @param document Document, HTML file containing the toast
 * @param window Window, the opened window in the browser
 * @param sender string, the person sending the message to the user
 * @returns number, the timeout id of the notification
 */
export declare function showNotification(document: Document, window: Window | DOMWindow, sender: string): number;
/**
 * This function will close the toast notification and clear its timeout value using the timeout id.
 * @param document Document, HTML file containing the toast
 * @param window Window, the opened window in the browser
 * @param element_id number, the timeout id of the notification to be closed
 */
export declare function closeNotification(document: Document, window: Window | DOMWindow, element_id: number): void;
//# sourceMappingURL=meldingen.d.ts.map