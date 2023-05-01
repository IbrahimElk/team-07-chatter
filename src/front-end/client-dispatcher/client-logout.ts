// Author: Thomas Evenepoel
// Date : 2023-04-18

export class ClientLogout {
  public static logout(ws: WebSocket): void {
    sessionStorage.clear();
    ws.close();
  }
}
