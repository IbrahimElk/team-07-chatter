//Author: Barteld Van Nieuwenhove
//Date: 2022/12/10

import fs from 'fs';

/**
 * Moves the server from the backup folder into the folder where it will be loaded.
 */
if (fs.existsSync('./assets/database/backup-server/' + 'server' + '.json')) {
  fs.copyFile(
    './assets/database/backup-server/' + 'server' + '.json',
    './assets/database/server/' + 'server' + '.json',
    (err) => {
      if (err) throw err;
    }
  );
}
