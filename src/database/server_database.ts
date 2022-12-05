//Author: Barteld Van Nieuwenhove
//Date: 2022/11/28

/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import fs from 'fs';
import { CUID } from '../channel/cuid.js';
import { Server } from '../server/server.js';
import { UUID } from '../user/uuid.js';
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
    const savedServer = JSON.parse(result);
    const savedNameToUUIDMap = new Map<string, UUID>();
    const savedNameToUUID = new Map(Object.entries(savedServer['nameToUUID']));
    for (const name of savedNameToUUID.keys()) {
      const uuid: UUID = Object.assign(new UUID(), savedNameToUUID.get(name));
      savedNameToUUIDMap.set(name, uuid);
    }
    savedServer['nametoUUID'] = savedNameToUUIDMap;

    const savedNameToCUIDMap = new Map<string, CUID>();
    const savedNameToCUID = new Map(Object.entries(savedServer['nameToCUID']));
    for (const name of savedNameToCUID.keys()) {
      const cuid: CUID = Object.assign(new CUID(), savedNameToCUID.get(name));
      savedNameToCUIDMap.set(name, cuid);
    }
    savedServer['nametoCUID'] = savedNameToCUIDMap;
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
