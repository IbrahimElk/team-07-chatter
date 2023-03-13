//Author: Barteld Van Nieuwenhove
//Date: 2022/11/28
import { z } from 'zod';
import { Server } from '../objects/server/server.js';
import { channelSave } from './channel_database.js';
import { userSave } from './user_database.js';
import type { IWebSocket } from '../protocol/ws-interface.js';
import fs from 'fs';
import Debug from 'debug';
import { encrypt } from './security/encrypt.js';
import { decrypt } from './security/decryprt.js';
import { stringToUint8Array, arrayBufferToString } from './security/util.js';
const debug = Debug('server_database');

/**
 * ZOD schemas
 */
const serverSchema = z.object({
  nameToUUID: z.array(z.tuple([z.string(), z.string()])),
  nameToCUID: z.array(z.tuple([z.string(), z.string()])),
});

/**
 * Loads the server from the Database.
 * @param name optional name of server to load, useful for test servers.
 * @returns Either the default server named "server" or a specific named server, if a server with the name does not exists we return a new server.
 */
export async function serverLoad(name?: string): Promise<Server> {
  if (name === undefined) {
    name = 'server';
  }
  const path = './assets/database/server/' + name + '.json';
  if (fs.existsSync(path)) {
    const encryptedServer = fs.readFileSync(path, 'utf-8');
    const iv = encryptedServer.slice(0, encryptedServer.indexOf('\n'));
    const cypher = encryptedServer.slice(encryptedServer.indexOf('\n') + 1);
    const server = await decrypt(stringToUint8Array(cypher), stringToUint8Array(iv));
    const savedServerCheck = serverSchema.safeParse(server);
    if (!savedServerCheck.success) {
      debug(savedServerCheck.error);
      console.log('error server ' + name + ' corrupted. This may result in unexpected behaviour');
      console.log(savedServerCheck.error);
    }
    const savedServer = server as Server;
    const savedNameToUUIDMap = new Map<string, string>();
    savedServer['nameToUUID'].forEach((pair) => {
      if (pair[0] !== undefined && pair[1] !== undefined) {
        savedNameToUUIDMap.set(pair[0], pair[1]);
      }
    });
    const savedNameToCUIDMap = new Map<string, string>();
    savedServer['nameToCUID'].forEach((pair) => {
      if (pair[0] !== undefined && pair[1] !== undefined) {
        savedNameToCUIDMap.set(pair[0], pair[1]);
      }
    });
    return new Server(savedNameToUUIDMap, savedNameToCUIDMap, new Map<IWebSocket, string>());
  } else {
    return new Server(new Map<string, string>(), new Map<string, string>(), new Map<IWebSocket, string>());
  }
}

/**
 * Saves the server into the Database.
 * @param name optional name of server to save, useful for test servers.
 */
export async function serverSave(server: Server, name?: string): Promise<void> {
  await channelSave(server.getCachedChannels());
  await userSave(server.getCachedUsers());
  const encryptedServer = await encrypt(server);
  if (name === undefined) {
    name = 'server';
  }
  const path = './assets/database/server/' + name + '.json';
  fs.writeFileSync(
    path,
    arrayBufferToString(encryptedServer.iv) + '\n' + arrayBufferToString(encryptedServer.encryptedObject)
  );
}
