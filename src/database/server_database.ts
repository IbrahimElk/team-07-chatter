//Author: Barteld Van Nieuwenhove, El Kaddouri Ibrahim
//Date: 2022/11/28
import { z } from 'zod';
import { channelSave } from './channel_database.js';
import { userSave } from './user_database.js';
import type { IWebSocketServer } from '../front-end/proto/ws-interface.js';
import fs from 'fs';
import Debug from 'debug';
import { encrypt } from './security/encrypt.js';
import { decrypt } from './security/decryprt.js';
import { stringToUint8Array, arrayBufferToString } from './security/util.js';
import { ChatServer } from '../server/chat-server.js';
const debug = Debug('server_database.ts');

const serverSchema = z.object({
  uuid: z.array(z.string()),
  cuid: z.array(z.string()),
});
type ServerSchema = z.infer<typeof serverSchema>;

export async function serverSave(chatServer: ChatServer): Promise<void> {
  debug('serverSave()');
  const encryptedServer = await encrypt(chatServer);
  const path = './assets/database/server/server.json'; // FIXME: chatserver.getName() ipv "server" hardcodderen.
  fs.writeFileSync(
    path,
    arrayBufferToString(encryptedServer.iv) + '\n' + arrayBufferToString(encryptedServer.encryptedObject)
  );
}
export async function serverLoad(server: IWebSocketServer): Promise<ChatServer> {
  debug('serverLoad()');

  const savedServerCheck = await loadingServer();
  if (savedServerCheck !== undefined) {
    const savedChannel = new ChatServer(
      server,
      new Set<string>(savedServerCheck.uuid),
      new Set<string>(savedServerCheck.cuid)
    );
    return savedChannel;
  }
  return new ChatServer(server, new Set<string>(), new Set<string>());
}

async function loadingServer(): Promise<ServerSchema | undefined> {
  const path = './assets/database/server/server.json';
  let serverObject: object;
  try {
    const encryptedServer = fs.readFileSync(path, 'utf-8');
    const iv = encryptedServer.slice(0, encryptedServer.indexOf('\n'));
    const cypher = encryptedServer.slice(encryptedServer.indexOf('\n') + 1);
    serverObject = await decrypt(stringToUint8Array(cypher), stringToUint8Array(iv));
  } catch (error) {
    debug('Server does not exist yet');
    return undefined;
  }
  const savedServerCheck = serverSchema.safeParse(serverObject);

  if (!savedServerCheck.success) {
    debug('error: server corrupted. This may result in unexpected behaviour');
    debug(savedServerCheck.error);
    return undefined;
  }
  debug(savedServerCheck.data);
  return savedServerCheck.data;
}
