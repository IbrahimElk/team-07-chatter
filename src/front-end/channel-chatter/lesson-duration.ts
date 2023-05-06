import { ClientUser } from '../client-dispatcher/client-user.js';

const bar = document.querySelector('.progress-bar') as HTMLElement;

function makeProgress(): void {
  const classRoom = ClientUser.getCurrentClassRoom();
  if (classRoom) {
    const startTime = classRoom.startTime;
    const endTime = classRoom.endTime;
    const now = Date.now();
    const remainingTime = endTime - now;
    const totalTime = endTime - startTime;
    const percentage = Math.round(((totalTime - remainingTime) / totalTime) * 100);

    bar.style.width = percentage.toString() + '%';
    bar.innerText = percentage.toString() + '%';

    if (remainingTime < 0) {
      alert('The class has eneded. Click ok to go back to the landing page.');
      window.location.href = '../home/home.html';
    }
  }
  // Wait 5 seconds to run again
  setTimeout(makeProgress, 5000);
}

makeProgress();
