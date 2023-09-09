//Author: Barteld Van Nieuwenhove, El Kaddouri Ibrahim
//Date: 2022/11/28
import { z } from 'zod';
import './channel_database.js';
import './user_database.js';
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
/**
 * saves a server to database
 * @param ChatServer the server to be saved
 */
export async function serverSave(chatServer) {
    debug('serverSave()');
    const encryptedServer = await encrypt(chatServer);
    const path = './assets/database/server/server.json'; // FIXME: chatserver.getName() ipv "server" hardcodderen.
    fs.writeFileSync(path, arrayBufferToString(encryptedServer.iv) + '\n' + arrayBufferToString(encryptedServer.encryptedObject));
}
/**
 * loading a server from database
 * @param server the websocketserver that will be attached to the server
 * @returns
 */
export async function serverLoad(server) {
    debug('serverLoad()');
    const savedServerCheck = await loadingServer();
    if (savedServerCheck !== undefined) {
        const savedChannel = new ChatServer(server, new Set(savedServerCheck.uuid), new Set(savedServerCheck.cuid));
        return savedChannel;
    }
    return new ChatServer(server, new Set(), new Set());
}
/**
 * load a server from database into an intermediate json form.
 * @returns
 */
async function loadingServer() {
    const path = './assets/database/server/server.json';
    let serverObject;
    try {
        const encryptedServer = fs.readFileSync(path, 'utf-8');
        const iv = encryptedServer.slice(0, encryptedServer.indexOf('\n'));
        const cypher = encryptedServer.slice(encryptedServer.indexOf('\n') + 1);
        serverObject = await decrypt(stringToUint8Array(cypher), stringToUint8Array(iv));
    }
    catch (error) {
        debug('Server does not exist yet');
        // console.error(error);
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
//# sourceMappingURL=server_database.js.map