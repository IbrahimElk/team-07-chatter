// Guust Luycx & Ibrahim El Kaddouri
// 29/04/2023
import { ClientChannel } from '../client-dispatcher/client-channel-logic.js';
import { ClientFriend } from '../client-dispatcher/client-friend-logic.js';
import { encodeHTMlInput } from '../encode-decode/encode.js';
import { makeProgress } from './off-canvas/lesson-duration.js';
import { client } from '../main.js';
/**
 * This function initializes the necessary event listeners for the page upon entering a channel.
 * @param {string} channelCUID - The unique ID of the channel.
 * @returns {void}
 */
export function enterPage(channelCUID) {
    const displayedUsername = document.getElementById('display-username');
    const textInputMessage = document.getElementById('messageInput');
    const textInputButtonChannel = document.getElementById('buttonSend');
    textInputMessage.focus();
    initializeChannel(channelCUID, displayedUsername, textInputMessage, textInputButtonChannel);
    initializeTextEventListners(channelCUID, textInputMessage, textInputButtonChannel);
    // -----------------------------------------------------------------------------------------------------
    const focusUUIDElement = document.getElementById('focusUUID');
    const addFriendButton = document.getElementById('focusUserAddFriendButton');
    const openChatButton = document.getElementById('focusUserOpenChatButton');
    const blockFriendButton = document.getElementById('focusUserBlockFriendButton');
    initializeFocusedFriendEventListners(focusUUIDElement, addFriendButton, openChatButton, blockFriendButton);
    // -----------------------------------------------------------------------------------------------------
    const searchInput = document.getElementById('form1');
    const closeButton = document.getElementById('close-button-navbar');
    inializeShortcutsEventListners(textInputButtonChannel, closeButton, searchInput);
    // -----------------------------------------------------------------------------------------------------
    const bar = document.querySelector('.progress-bar');
    makeProgress(client, bar);
}
/**
 * This function initializes the channel and makes necessary changes to the page upon entering the channel.
 * @param {string} channelCUID - The unique ID of the channel.
 * @param {HTMLSpanElement} displayedUsername - The HTML element displaying the user's username.
 * @param {HTMLInputElement} textInputMessage - The HTML element for the input field where the user types their message.
 * @param {HTMLButtonElement} textInputButtonChannel - The HTML element for the button the user clicks to send their message.
 * @returns {void}
 */
function initializeChannel(channelCUID, displayedUsername, textInputMessage, textInputButtonChannel) {
    ClientChannel.connectChannel(client, channelCUID);
    // change colors when dark mode is enabled
    EnableDarkMode(displayedUsername, textInputButtonChannel);
    // dont allow copy pasting in input field
    textInputMessage.onpaste = (e) => e.preventDefault();
    // Based on current class, change the text inside the offcanvas, aula(building) and course(les)
    const currentClass = client.getCurrentClassRoom();
    if (currentClass) {
        document.getElementById('aula').textContent = currentClass.building;
        document.getElementById('les').textContent = currentClass.description;
    }
}
/**
 * This function enables dark mode by changing the colors of the displayed username and send button.
 * @param {HTMLSpanElement} displayedUsername - The HTML element displaying the user's username.
 * @param {HTMLButtonElement} sendIcon - The HTML element for the button the user clicks to send their message.
 * @returns {void}
 */
function EnableDarkMode(displayedUsername, sendIcon) {
    const mode = localStorage.getItem('theme');
    if (mode) {
        if (mode === 'dark') {
            displayedUsername.style.color = 'white';
            sendIcon.style.color = 'white';
        }
        else {
            displayedUsername.style.color = 'black';
            sendIcon.style.color = 'black';
        }
        document.querySelector('html').setAttribute('data-bs-theme', mode);
    }
}
/**
 * Adds event listeners to the text input field and send button in a chat channel.
 * @param {string} channelCUID - The unique identifier for the chat channel.
 * @param {HTMLInputElement} textInputMessage - The input field for typing messages.
 * @param {HTMLButtonElement} textInputButtonChannel - The button for sending messages.
 * @returns {void}
 */
function initializeTextEventListners(channelCUID, textInputMessage, textInputButtonChannel) {
    // record keypress of input field
    textInputMessage.addEventListener('keypress', (event) => {
        if (event.key !== 'Enter') {
            const start = Date.now().valueOf();
            client.AddTimeStamp(encodeHTMlInput(event.key), start);
        }
    });
    // send text typed if clicked on send button
    textInputButtonChannel.addEventListener('click', () => {
        if (textInputMessage.value.length > 0) {
            const encodedMessage = encodeHTMlInput(textInputMessage.value);
            const deltaCalculations = Array.from(client.GetDeltaCalulations());
            ClientChannel.sendChannelMessage(client, encodedMessage, deltaCalculations, channelCUID, new Date());
            client.removeCurrentTimeStamps();
            textInputMessage.value = '';
        }
    });
}
/**
 * Adds event listeners to buttons related to a focused friend.
 * @param {HTMLHeadingElement} focusUUIDElement - The element displaying the unique identifier of the focused friend.
 * @param {HTMLButtonElement} addFriendButton - The button for adding the focused friend as a friend.
 * @param {HTMLButtonElement} openChatButton - The button for opening a chat window with the focused friend.
 * @param {HTMLButtonElement} blockFriendButton - The button for blocking the focused friend.
 * @returns {void}
 */
function initializeFocusedFriendEventListners(focusUUIDElement, addFriendButton, openChatButton, blockFriendButton) {
    addFriendButton.addEventListener('click', function () {
        if (focusUUIDElement.textContent) {
            ClientFriend.addFriend(client, encodeHTMlInput(focusUUIDElement.textContent));
        }
    });
    openChatButton.addEventListener('click', function () {
        if (focusUUIDElement.textContent) {
            client.setCurrentFriend(focusUUIDElement.textContent);
            window.location.href = '../friend-chatter/friend-chat-window.html';
        }
    });
    blockFriendButton.addEventListener('click', function () {
        if (focusUUIDElement.textContent) {
            ClientFriend.removeFriend(client, encodeHTMlInput(focusUUIDElement.textContent));
        }
    });
}
/**
 * Initializes event listeners for various keyboard shortcuts, including sending messages with the "Enter" key,
 * opening and closing the search bar with "Ctrl+A" and "Escape" respectively,
 * and searching for messages with "Enter" while the search bar is open.
 * @param {HTMLButtonElement} textInputButtonChannel - The button element used to send messages.
 * @param {HTMLDivElement} searchBarDiv - The div element containing the search bar.
 * @param {NodeListOf<Element>} messages - The list of message elements in the chat.
 * @param {HTMLButtonElement} closeButton - The button element used to close the search bar.
 * @param {HTMLInputElement} searchBarInput - The input element used to input search queries.
 * @returns {void}
 */
function inializeShortcutsEventListners(textInputButtonChannel, closeButton, searchBarInput) {
    //code voor shortcut ENTER bij verzenden van tekst
    textInputButtonChannel.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            textInputButtonChannel.click();
        }
    });
    //code voor searchbar voor het zoeken achter een message in een chat.
    document.body.addEventListener('keydown', (event) => {
        if (event.ctrlKey && event.key.toLowerCase() === 'f') {
            event.preventDefault();
            // call the function to open the "Find" dialog box here
            showSearchBar();
        }
        if (event.key === 'Escape') {
            hideSearchBar();
        }
    });
    closeButton.addEventListener('click', () => {
        hideSearchBar();
    });
    // closing search bar
    closeButton.addEventListener('click', () => {
        hideSearchBar();
    });
    //code voor shortcut ENTER bij opzoekn van tekst via searchbar
    searchBarInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            shortcut();
        }
    });
}
/**
 * Calls the messageWithWord function with the value of the input element with the ID 'form1'.
 */
function shortcut() {
    const inputButton = document.getElementById('form1');
    const input = inputButton.value;
    messageWithWord(input);
}
/**
 * Searches through a list of messages displayed on a web page and highlights the message that matches the search query.
 * @param {string} query - The search query to match against the messages.
 * @returns {void}
 */
function messageWithWord(query, attempts = 0) {
    const messages = document.querySelectorAll('.list-group-1 .list-group-item');
    messages.forEach(function (message) {
        message.classList.remove('highlight');
    });
    const searchlength = messages.length - lastIndex;
    for (let i = searchlength - 1; i >= 0; i--) {
        const message = messages[i];
        const messageText = message?.querySelector('.h5')?.textContent;
        if (message instanceof Element && typeof messageText === 'string') {
            if (messageText.toLowerCase().includes(query.toLowerCase())) {
                message.classList.add('highlight');
                message.scrollIntoView();
                lastIndex = messages.length - i;
                return;
            }
        }
    }
    if (attempts < 1) {
        // if not found any matches start from the beginning
        lastIndex = 0;
        messageWithWord(query, attempts + 1);
    }
    else {
        alert('no messages');
    }
}
/**
 * Displays the search bar by setting the input element's display style to "inline-block"
 * and giving it focus.
 */
function showSearchBar() {
    const input1 = document.getElementById('input1');
    input1.style.display = 'inline-block';
    document.getElementById('form1').focus();
}
let lastIndex = 0;
/**
 * Hides the search bar by setting the input element's display style to "none" and
 * removing any highlighting from search results. It also sets the lastIndex to 0 and
 * scrolls the first search result into view before giving focus to the message input.
 */
function hideSearchBar() {
    const input1 = document.getElementById('input1');
    if (input1.style.display !== 'none') {
        input1.style.display = 'none';
        const messages = document.querySelectorAll('.list-group-1 .list-group-item');
        messages.forEach(function (message) {
            message.classList.remove('highlight');
        });
        lastIndex = 0;
        messages[0]?.scrollIntoView();
        document.getElementById('messageInput').focus();
    }
}
//# sourceMappingURL=event-listeners.js.map