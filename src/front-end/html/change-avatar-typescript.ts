/* eslint-disable @typescript-eslint/no-unsafe-call */

document.body.addEventListener('click', addEventListeners, false);

function addEventListeners(event: Event) {
  event = event || window.event;
  if (!(event.target instanceof HTMLElement)) return;
  const target = event.target;
  let element = target;

  while (element) {
    // console.log('hey');
    if (element.nodeName === 'BUTTON' && /dropdown-item/.test(element.className)) {
      changeAvatar(element.id);
      break;
    }
    const test = element.parentElement;
    if (test !== null) {
      element = test;
    }
  }
}
function changeAvatar(avatarName: string): void {
  // console.log(avatarName);
  const profileImage = document.getElementById('profile-image') as HTMLImageElement;
  profileImage.src = `img/avatars/${avatarName}` + '.png';
}
