//Author: Barteld Van Nieuwenhove
//Date: 2022/12/10

import fs from 'fs';

/**
 * Moves the server from its folder into the back-up folder where it will not be loaded.
 * Used to create space for temporary test servers during npm test runs.
 */
if (fs.existsSync('./assets/database/server/' + 'server' + '.json')) {
  fs.copyFile(
    './assets/database/server/' + 'server' + '.json',
    './assets/database/backup-server/' + 'server' + '.json',
    (err) => {
      if (err) throw err;
    }
  );
  fs.unlink('./assets/database/server/' + 'server' + '.json', (err) => {
    if (err) throw err;
  });
}
