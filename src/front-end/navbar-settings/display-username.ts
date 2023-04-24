// Author: Thomas Evenepoel
// Date: 2023-04-24
import type * as ServerInterfaceTypes from '../../protocol/server-types.js';

export class showUsername {
  public static displayUsername(payload: ServerInterfaceTypes.loginSendback['payload']): void {
    // Change with sendback function from amelie
    const displayUsername = document.getElementById('display-username') as HTMLSpanElement;
    const displayUserID = document.getElementById('display-userID') as HTMLSpanElement;
    if (payload.succeeded === true) {
      displayUsername.textContent = payload.username as string;
      displayUserID.textContent = payload.usernameId;
    }
  }
}
