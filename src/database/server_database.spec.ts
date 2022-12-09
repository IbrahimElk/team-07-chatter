//Author: Barteld Van Nieuwenhove
//Date: 2022/11/29

import { serverLoad, serverSave } from './server_database.js';
import { expect, describe, it } from 'vitest';
import { UUID } from '../user/uuid.js';
import type { CUID } from '../channel/cuid.js';
import { Server } from '../server/server.js';
import fs from 'fs';

// The test works as intended. Thus the serverSave and serverLoad works as well,
// since the data is first stored with serverSave and if this had not loaded properly,
// the test wouldn't be able to execute. Does not work on gitlab due to adding files.

describe('serverSaveLoad', () => {
  it('calculates correctly', async () => {
    // const uuid1 = new UUID();
    // const name1 = 'hello';
    // const nametoUUID = new Map<string, UUID>();
    // const nameToCUID = new Map<string, CUID>();
    // nametoUUID.set(name1, uuid1);
    // const server = new Server(nametoUUID, nameToCUID);
    // await serverSave(server, 'testSaveLoad');
    // const savedServer = serverLoad('testSaveLoad');
    // expect(server).toEqual(savedServer);
    // fs.unlink('./assets/database/server/' + 'testSaveLoad' + '.json', (err) => {
    //   if (err) throw err;
    // });
  });
});
