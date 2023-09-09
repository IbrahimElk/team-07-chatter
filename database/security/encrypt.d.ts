/// <reference types="node" resolution-mode="require"/>
import { webcrypto } from 'crypto';
/**
 * Encrypts objects using AES-GCM.
 * @param object The object to be encrypted into a cyphertext.
 * @returns a Promise that resolves to the encrypted object and the Initialization Vector.
 */
export declare function encrypt(object: object, key?: webcrypto.CryptoKey): Promise<{
    encryptedObject: ArrayBuffer;
    iv: Uint8Array;
}>;
//# sourceMappingURL=encrypt.d.ts.map