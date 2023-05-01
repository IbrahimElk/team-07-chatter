import { ClientLogout } from '../client-dispatcher/client-logout.js';
import { ws } from '../../client-dispatcher/main.js'; //IETS MET TSCONFIG

const logoutButton = document.getElementById('log-out-button') as HTMLElement;

logoutButton.addEventListener('click', () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  ClientLogout.logout(ws);
});
