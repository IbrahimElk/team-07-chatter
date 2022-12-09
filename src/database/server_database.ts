//Author: Barteld Van Nieuwenhove
//Date: 2022/11/28

import fs from 'fs';
import type { CUID } from '../channel/cuid.js';
import { Server } from '../server/server.js';
import type { UUID } from '../user/uuid.js';
import { channelSave } from './channel_database.js';
import { userSave } from './user_database.js';

/**
 * Global serverInstance
 */
export const serverInstance: Server = serverLoad('server');

/**
 * Loads the server from the Database.
 * @param name optional name of server to load, useful for test servers.
 * @returns Either the default server named "server" or a specific named server, if a server with the name does not exists we return a new server.
 */
export function serverLoad(name?: string): Server {
  if (name === undefined) {
    name = 'server';
  }
  const path = './assets/database/server/' + name + '.json';
  if (fs.existsSync(path)) {
    const result = fs.readFileSync(path, 'utf-8');

    const savedServer = JSON.parse(result) as Server;
    const savedNameToUUIDMap = new Map<string, UUID>();
    const savedNameToUUID = new Map(Object.entries(savedServer['nameToUUID']));
    for (const name of savedNameToUUID.keys()) {
      const UUID = savedNameToUUID.get(name) as UUID;
      savedNameToUUIDMap.set(name, UUID);
    }
    savedServer['nameToUUID'] = savedNameToUUIDMap;

    const savedNameToCUIDMap = new Map<string, CUID>();
    const savedNameToCUID = new Map(Object.entries(savedServer['nameToCUID']));
    for (const name of savedNameToCUID.keys()) {
      const cuid: CUID = savedNameToCUID.get(name) as CUID;
      savedNameToCUIDMap.set(name, cuid);
    }
    savedServer['nameToCUID'] = savedNameToCUIDMap;

    return new Server(savedNameToUUIDMap, savedNameToCUIDMap);
  } else {
    return new Server(new Map<string, UUID>(), new Map<string, CUID>());
  }
}

/**
 * Saves the server into the Database.
 * @param name optional name of server to save, useful for test servers.
 */
export async function serverSave(server: Server, name?: string): Promise<void> {
  return new Promise((resolve) => {
    channelSave(serverInstance.getCachedChannels());
    userSave(serverInstance.getCachedUsers());
    const obj = JSON.stringify(server);
    if (name === undefined) {
      name = 'server';
    }
    const path = './assets/database/server/' + name + '.json';
    fs.writeFileSync(path, obj);
    return resolve();
  });
}
