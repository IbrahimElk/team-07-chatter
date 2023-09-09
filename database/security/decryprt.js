//Author: Barteld Van Nieuwenhove
//Date: 2023/03/09
import { subtle } from 'crypto';
import { importedKey } from './key.js';
/**
 * Decrypts encrypted object to it's decypted string representation.
 * @param ciphertext The encrypted object.
 * @param iv The initialization vector that encrypted the cypertext.
 * @returns The decrypted object.
 */
export async function decrypt(encryptedObject, iv, key) {
    if (key === undefined) {
        key = importedKey;
    }
    const a = await subtle.decrypt({ name: 'AES-GCM', iv }, key, encryptedObject);
    return JSON.parse(new TextDecoder().decode(a));
}
//# sourceMappingURL=decryprt.js.map