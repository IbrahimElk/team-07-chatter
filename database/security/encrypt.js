//Author: Barteld Van Nieuwenhove
//Date: 2023/03/09
import { subtle, getRandomValues } from 'crypto';
import { TextEncoder } from 'util';
import { importedKey } from './key.js';
/**
 * Encrypts objects using AES-GCM.
 * @param object The object to be encrypted into a cyphertext.
 * @returns a Promise that resolves to the encrypted object and the Initialization Vector.
 */
export async function encrypt(object, key) {
    if (key === undefined) {
        key = importedKey;
    }
    //Random Initialization Vector to ensure true randomness.
    const iv = getRandomValues(new Uint8Array(12));
    const encryptedObject = await subtle.encrypt({
        name: 'AES-GCM',
        iv,
    }, key, new TextEncoder().encode(JSON.stringify(object)));
    return { encryptedObject, iv };
}
//# sourceMappingURL=encrypt.js.map