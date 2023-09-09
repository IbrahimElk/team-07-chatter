/// <reference types="node" resolution-mode="require"/>
import { webcrypto } from 'crypto';
/**
 * Decrypts encrypted object to it's decypted string representation.
 * @param ciphertext The encrypted object.
 * @param iv The initialization vector that encrypted the cypertext.
 * @returns The decrypted object.
 */
export declare function decrypt(encryptedObject: ArrayBuffer, iv: Uint8Array, key?: webcrypto.CryptoKey): Promise<object>;
//# sourceMappingURL=decryprt.d.ts.map