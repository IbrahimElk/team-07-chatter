// import { decrypt } from '../database/security/decryprt.js';
// import { encrypt } from '../database/security/encrypt.js';
// import { describe, it, expect } from 'vitest';
// import { arrayBufferToString, stringToUint8Array } from '../database/security/util.js';
// import fs from 'fs';
// import { generateKey, loadKey, saveKey } from '../database/security/key.js';

// describe('Database encription tests', () => {
//   it('Encrypts and decrypts object correctly using masterkey.', async () => {
//     const originalObject = { asd: { a: 'a' }, bbb: 'bbb', ccc: 'ccc' };
//     const encryptedObject = await encrypt(originalObject);
//     expect(originalObject).toEqual(await decrypt(encryptedObject.encryptedObject, encryptedObject.iv));
//   });
//   it('Saves and loads generated key correctly.', async () => {
//     const path = './assets/secure_location/test_key.txt';
//     const key = await generateKey();
//     await saveKey(key, path);
//     const loadedKey = await loadKey(path);
//     expect(key).toEqual(loadedKey);
//     fs.unlink(path, (err) => {
//       if (err) throw err;
//     });
//   });
// });

// describe('Encryption and decryption tests', () => {
//   it('Generated key can encrypt and decrypt an object correctly.', async () => {
//     const key = await generateKey();
//     const originalObject = { asd: { a: 'a' }, bbb: 'bbb', ccc: 'ccc' };
//     const encryptedObject = await encrypt(originalObject, key);
//     expect(originalObject).toEqual(await decrypt(encryptedObject.encryptedObject, encryptedObject.iv, key));
//   });
// });

// describe('Utility tests', () => {
//   it('Generated key can encrypt and decrypt an object correctly.', () => {
//     const string = 'Test whether we can get same string back';
//     expect(string === arrayBufferToString(stringToUint8Array(string)));
//   });
// });
