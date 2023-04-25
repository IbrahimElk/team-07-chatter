import { ClientChannel } from '../client-dispatcher/client-channel-logic.js';
import { ClientFriend } from '../client-dispatcher/client-friend-logic.js';
import { wsClient } from '../main.js';
import { ClientUser } from '../client-dispatcher/client-user.js';
if (window.location.href.indexOf('chat-window.html') > -1) {
    console.log('inside if statemetn in chat-window.ts');
    enterPage();
}
/**
 * This function loads all the active users in a public chat-room.
 * Right now the users are stored in the a variable but this can later be changed to reflect the actual active users in the chat.
 */
export function activeUsers() {
    const activeUser = [
        'user1',
        'user2',
        'user3',
        'user1',
        'user2',
        'user3',
        'user1',
        'user2',
        'user3',
        'user1',
        'user2',
        'user3',
        'user1',
        'user2',
        'user3',
        'user1',
        'user2',
        'user3',
    ];
    for (const user of activeUser) {
        const temp1 = document.getElementById('listUsers-item');
        const copyHTML = document.importNode(temp1.content, true);
        copyHTML.querySelector('.d-flex.flex-grow.p-1').textContent = user;
        document.getElementById('listUsers').appendChild(copyHTML);
    }
}
/**
 * stores the username of the user that gets clicked on
 * @param button the button of the active users that gets clicked
 */
function store(button) {
    const username = button.querySelector('.d-flex.flex-grow.p-1').textContent;
    sessionStorage.setItem('friend', username);
}
//TODO: voeg de waardes al toe aan de functie ipv ze hier op te roepen
//TODO: deze functie oproepen en alle berichten toevoegen
/**
 * This function sends a messgae with the content from the input bar.
 * It only sends a message whenever there is input to be send.
 * Right now no timings are implemented and different features are still placeholders but the base is there.
 */
export function showMessage(date, sender, text, trust) {
    const number = Math.random() * 100;
    let trustColor;
    if (number > 75) {
        trustColor = 'bg-success';
    }
    else if (number > 25) {
        trustColor = 'bg-warning';
    }
    else {
        trustColor = 'bg-danger';
    }
    const trustLevel = number.toString() + '%';
    const temp1 = document.getElementById('message');
    if (!temp1) {
        return;
    }
    const copyHTML = document.importNode(temp1.content, true);
    copyHTML.querySelector('.mb-1').textContent = sender;
    copyHTML.querySelector('.text-muted.d-flex.align-items-end').textContent = date;
    copyHTML.querySelector('.h5.mb-1').textContent = text;
    copyHTML.querySelector('.progress-bar').style.height = trustLevel;
    copyHTML.querySelector('.progress-bar').classList.add(trustColor);
    const messageList = document.getElementById('messageList');
    if (!messageList) {
        return;
    }
    const firstChild = messageList.firstElementChild;
    if (firstChild) {
        messageList.insertBefore(copyHTML, firstChild);
    }
    else {
        messageList.appendChild(copyHTML);
    }
}
/**
 * This function sets the aula to the right one the user clicked on.
 */
function setAula(aula) {
    document.getElementById('aula').textContent = aula;
}
/**
 * This function sets the course that is going on at that time in the aula.
 */
function setLes() {
    const les = 'Mechanica';
    document.getElementById('les').textContent = les;
}
/**
 * This function gets executed whenever the page is loaded.
 * Right now this means that the active users are loaded and the aula and course are set.
 */
export function enterPage() {
    const aula = sessionStorage.getItem('aula');
    ClientChannel.selectChannel(wsClient, aula);
    setAula(aula);
    setLes();
    // TODO: oproepen om actieve users te krijgen en deze te displayen
    activeUsers();
    const textInputMessage = document.getElementById('messageInput');
    console.log(textInputMessage); //NULL??? //FIXME:
    textInputMessage.addEventListener('keypress', (event) => {
        const start = Date.now().valueOf();
        ClientUser.AddTimeStamp(event.key, start);
    });
    const textInputButtonChannel = document.getElementById('buttonSend');
    const naamChannel = document.getElementById('aula');
    textInputButtonChannel.addEventListener('click', () => {
        console.log('attempting to send a message...');
        ClientChannel.sendChannelMessage(wsClient, textInputMessage.value, Array.from(ClientUser.GetDeltaCalulations()), naamChannel.innerHTML);
        ClientUser.removeCurrentTimeStamps();
    });
    const blockButton = document.getElementById('blockFriendButtonChatWindow');
    blockButton.addEventListener('click', () => {
        ClientFriend.removeFriend(wsClient, sessionStorage.getItem('friend'));
    });
    const FriendRequestButton = document.getElementById('addFriendButtonChatWindow');
    FriendRequestButton.addEventListener('click', () => {
        ClientFriend.addFriend(wsClient, sessionStorage.getItem('friend'));
    });
}
//code voor shortcut 

export function keydown() {
    const input = document.getElementById("form1").value;
    if (input == "hallo") {
        const myOffcanvas = new bootstrap.Offcanvas(document.getElementById("offcanvasExample"));
        myOffcanvas.show();
    }
}
export function keydown1() {
    //sendMessage();
    alert('enter werkt');
}

//# sourceMappingURL=chat-window.js.map