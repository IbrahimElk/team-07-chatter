//Author: Barteld Van Nieuwenhove
//Date: 2022/11/28
import { z } from 'zod';
import { CUID } from '../channel/cuid.js';
import { Server } from '../server/server.js';
import { UUID } from '../user/uuid.js';
import { channelSave } from './channel_database.js';
import { userSave } from './user_database.js';
import type { IWebSocket } from '../protocol/ws-interface.js';
// import { serverInstance } from '../chat-server/chat-server-script.js';
import fs from 'fs';
import Debug from 'debug';
const debug = Debug('server_database');
/**
 * Global serverInstance
 */
// export const serverInstance: Server = serverLoad('test');
// const ee = serverLoad('server');
// export const serverInstance: Server = ee;

/**
 * ZOD schemas
 */
const UUIDSchema = z.object({ UUID: z.string() });
const CUIDSchema = z.object({ CUID: z.string() });

const serverSchema = z.object({
  nameToUUID: z.array(z.tuple([z.string(), UUIDSchema])),
  nameToCUID: z.array(z.tuple([z.string(), CUIDSchema])),
});

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
    const savedServerCheck = serverSchema.safeParse(JSON.parse(result));
    if (!savedServerCheck.success) {
      debug(savedServerCheck.error);
      console.log('error server ' + name + ' corrupted. This may result in unexpected behaviour');
      console.log(savedServerCheck.error);
    }
    const savedServer = JSON.parse(result) as Server;
    const savedNameToUUIDMap = new Map<string, UUID>();
    const savedNameToUUID = new Map<string, UUID>(Object.values(savedServer['nameToUUID']));

    for (const name of savedNameToUUID.keys()) {
      const uuid = Object.assign(new UUID(), savedNameToUUID.get(name));
      savedNameToUUIDMap.set(name, uuid);
    }
    savedServer['nameToUUID'] = savedNameToUUIDMap;

    const savedNameToCUIDMap = new Map<string, CUID>();
    const savedNameToCUID = new Map<string, CUID>(Object.values(savedServer['nameToCUID']));
    for (const name of savedNameToCUID.keys()) {
      const cuid: CUID = Object.assign(new CUID(), savedNameToCUID.get(name));
      savedNameToCUIDMap.set(name, cuid);
    }
    savedServer['nameToCUID'] = savedNameToCUIDMap;

    return new Server(savedNameToUUIDMap, savedNameToCUIDMap, new Map<IWebSocket, UUID>());
  } else {
    return new Server(new Map<string, UUID>(), new Map<string, CUID>(), new Map<IWebSocket, UUID>());
  }
}

/**
 * Saves the server into the Database.
 * @param name optional name of server to save, useful for test servers.
 */
export async function serverSave(server: Server, name?: string): Promise<void> {
  return new Promise((resolve) => {
    channelSave(server.getCachedChannels());
    userSave(server.getCachedUsers());
    const obj = JSON.stringify(server);
    if (name === undefined) {
      name = 'server';
    }
    const path = './assets/database/server/' + name + '.json';
    fs.writeFileSync(path, obj);
    return resolve();
  });
}
