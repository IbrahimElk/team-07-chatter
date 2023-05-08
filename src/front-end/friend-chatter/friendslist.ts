//(document.querySelector('#friendsListOpen') as HTMLElement).addEventListener('click', (e) => enterPage());

// function store(button: HTMLButtonElement): void {
//   const username = button.querySelector('.d-flex.flex-grow.p-1') as HTMLElement;
//   sessionStorage.setItem('friend', username.textContent as string);
// }

export function openFriendsList() {
  const friends = ['user 1', 'User 2'];
  for (const friend of friends) {
    const temp1 = document.getElementById('friendsList-Friend') as HTMLTemplateElement;
    const copyHTML = document.importNode(temp1.content, true);
    (copyHTML.querySelector('.d-flex.flex-grow.p-1') as HTMLElement).textContent = friend;
    (document.getElementById('friendslist') as HTMLElement).appendChild(copyHTML);
  }
  const myOffcanvas = document.getElementById('myOffcanvas');
  myOffcanvas?.classList.toggle('show');

  const closeButton = document.getElementById('close-button') as HTMLElement;
  closeButton.addEventListener('click', function () {
    myOffcanvas?.classList.remove('show'); // remove the 'show' class to hide the offcanvas
  });
}

function addFriend() {
  const username = (document.getElementById('newFriendUsername') as HTMLInputElement).value;
  //TODO: get right protocol to check if username exists and add if so
  if (username !== 'hey') {
    (document.getElementById('errorUsername') as HTMLElement).textContent = '';
    const temp1: HTMLTemplateElement | null = document.getElementById(
      'friendsList-Friend'
    ) as HTMLTemplateElement | null;
    if (!temp1) {
      return;
    }
    const copyHTML: DocumentFragment = document.importNode(temp1.content, true);
    (copyHTML.querySelector('.d-flex.flex-grow.p-1') as HTMLElement).textContent = username;
    (document.getElementById('friendslist') as HTMLElement).appendChild(copyHTML);
    (document.getElementById('addFriend') as HTMLElement).classList.remove('show');
    (document.getElementById('addFriend') as HTMLElement).classList.add('hide');
    (document.querySelector('.modal-backdrop') as HTMLElement).remove();
  } else {
    (document.getElementById('errorUsername') as HTMLElement).textContent = 'Username does not exist';
  }
}
