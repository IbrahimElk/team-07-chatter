import fs from 'fs';
if (fs.existsSync('./assets/database/backup-server/' + 'server' + '.json')) {
  fs.copyFile(
    './assets/database/backup-server/' + 'server' + '.json',
    './assets/database/server/' + 'server' + '.json',
    (err) => {
      if (err) throw err;
    }
  );
}
