import { decrypt } from '../database/security/decryprt.js';
import { encrypt } from '../database/security/encrypt.js';
import { describe, it, expect } from 'vitest';

describe('Encrypt decrypt', () => {
  it('Encrypts and decrypts object correctly', async () => {
    const originalObject = { asd: { a: 'a' }, bbb: 'bbb', ccc: 'ccc' };
    const encryptedObject = await encrypt(originalObject);
    expect(originalObject).toEqual(
      JSON.parse(new TextDecoder().decode(await decrypt(encryptedObject.ciphertext, encryptedObject.iv)))
    );
  });
});
