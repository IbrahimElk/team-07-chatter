// Guust Luyckx
// 12/03/2023

/**
 * This function loads all the active users in a public chat-room.
 * Right now the users are stored in the a variable but this can later be changed to reflect the actual active users in the chat.
 */

function activeUsers() {
  const activeUser = ['user1', 'user2', 'user3'];
  for (x in activeUser) {
    var temp1 = document.getElementById('listUsers-item').content;
    var copyHTML = document.importNode(temp1, true);
    copyHTML.querySelector('.d-flex.flex-grow.p-1').textContent = activeUser[x];
    document.getElementById('listUsers').appendChild(copyHTML);
  }
}

/**
 * This function sends a messgae with the content from the input bar.
 * It only sends a message whenever there is input to be send.
 * Right now no timings are implemented and different features are still placeholders but the base is there.
 */
function sendMessage() {
  const user = 'user1';
  const messageField = document.getElementById('messageInput');
  const message = messageField.value;
  if (message == '') {
    return;
  }
  messageField.value = '';
  var trustLevel = Math.random() * 100;
  var trustColor;
  if (trustLevel > 75) {
    trustColor = 'bg-success';
  } else if (trustLevel > 25) {
    trustColor = 'bg-warning';
  } else {
    trustColor = 'bg-danger';
  }
  trustLevel = trustLevel.toString() + '%';
  var temp1 = document.getElementById('message').content;
  var copyHTML = document.importNode(temp1, true);
  copyHTML.querySelector('.mb-1').textContent = user;
  copyHTML.querySelector('.text-muted.d-flex.align-items-end').textContent = Date();
  copyHTML.querySelector('.h5.mb-1').textContent = message;
  copyHTML.querySelector('.progress-bar').style.height = trustLevel;
  copyHTML.querySelector('.progress-bar').classList.add(trustColor);
  document.getElementById('messageList').insertBefore(copyHTML, document.getElementById('messageList').children[0]);
}

/**
 * This function sets the aula to the right one the user clicked on.
 */
function setAula() {
  const aula = '200l 00.07';
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
function enterPage() {
  activeUsers();
  setAula();
  setLes();
}
