import fs from 'fs';
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
