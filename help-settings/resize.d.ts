/**
 * Resizes the "listUsers" and "messageList" elements to fit the screen height.
 * This function should be called on page load and window resize events.
 * @param {Document} document - The HTML document object
 * @param {number} windowInnerHeight - The height of the window inner area in pixels
 * @param {number} ACTIVE_USERS_CARD_HEIGHT - The height of the active users card in pixels
 * @param {number} MESSAGE_LIST_CARD_HEIGHT - The height of the message list card in pixels
 * @returns {void}
 */
export declare function channelChatResize(document: Document, windowInnerHeight: number, ACTIVE_USERS_CARD_HEIGHT: number, MESSAGE_LIST_CARD_HEIGHT: number): void;
export declare function friendChatResize(document: Document, windowInnerHeight: number, MESSAGE_LIST_CARD_HEIGHT: number): void;
//# sourceMappingURL=resize.d.ts.map