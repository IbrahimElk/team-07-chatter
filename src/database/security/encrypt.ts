import { subtle, getRandomValues } from 'crypto';
import { TextEncoder } from 'util';

import { key } from './key.js';

/**
 * Encrypts objects using AES-GCM.
 * @param object The object to be encrypted into a cyphertext.
 * @returns
 */
export async function encrypt(object: object): Promise<{
  ciphertext: ArrayBuffer;
  iv: Uint8Array;
}> {
  //Random Initialization Vector to ensure true randomness.
  const iv = getRandomValues(new Uint8Array(12));
  const ciphertext = await subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    new TextEncoder().encode(JSON.stringify(object))
  );
  return { ciphertext, iv };
}

/**
 * Encodes string into a byte stream.
 * @param string string to be encoded.
 * @returns Byte stream representation of string.
 */
export function encode(string: string): Uint8Array {
  return new Uint8Array(Buffer.from(string, 'base64'));
}
