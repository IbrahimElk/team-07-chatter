function activeUsers(): void {
  const activeUser: string[] = ['user1', 'user2', 'user3'];
  for (const user of activeUser) {
    const temp1 = document.getElementById('listUsers-item') as HTMLTemplateElement;
    const copyHTML = document.importNode(temp1.content, true);
    (copyHTML.querySelector('.d-flex.flex-grow.p-1') as HTMLElement).textContent = user;
    (document.getElementById('listUsers') as HTMLElement).appendChild(copyHTML);
  }
}

function sendMessage(): void {
  const user = 'user1';
  const messageField: HTMLInputElement | null = document.getElementById('messageInput') as HTMLInputElement | null;
  if (!messageField) {
    return;
  }
  const message: string = messageField.value;
  if (message === '') {
    return;
  }
  messageField.value = '';
  const number: number = Math.random() * 100;
  let trustColor: string;
  if (number > 75) {
    trustColor = 'bg-success';
  } else if (number > 25) {
    trustColor = 'bg-warning';
  } else {
    trustColor = 'bg-danger';
  }
  const trustLevel = number.toString() + '%';
  const temp1: HTMLTemplateElement | null = document.getElementById('message') as HTMLTemplateElement | null;
  if (!temp1) {
    return;
  }
  const copyHTML: DocumentFragment = document.importNode(temp1.content, true);
  (copyHTML.querySelector('.mb-1') as HTMLElement).textContent = user;
  (copyHTML.querySelector('.text-muted.d-flex.align-items-end') as HTMLElement).textContent = new Date().toString();
  (copyHTML.querySelector('.h5.mb-1') as HTMLElement).textContent = message;
  (copyHTML.querySelector('.progress-bar') as HTMLElement).style.height = trustLevel;
  (copyHTML.querySelector('.progress-bar') as HTMLElement).classList.add(trustColor);
  const messageList: HTMLElement | null = document.getElementById('messageList');
  if (!messageList) {
    return;
  }
  const firstChild: Element | null = messageList.firstElementChild;
  if (firstChild) {
    messageList.insertBefore(copyHTML, firstChild);
  } else {
    messageList.appendChild(copyHTML);
  }
}

function setAula() {
  const aula = '200l 00.07';
  (document.getElementById('aula') as HTMLElement).textContent = aula;
}

function setLes() {
  const les = 'Mechanica';
  (document.getElementById('les') as HTMLElement).textContent = les;
}
