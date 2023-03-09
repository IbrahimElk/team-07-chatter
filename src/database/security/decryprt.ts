import { subtle, webcrypto } from 'crypto';
import type { BufferSource } from 'stream/web';

import { importedKey } from './key.js';

export async function decrypt(ciphertext: ArrayBuffer, iv: Uint8Array): Promise<ArrayBuffer> {
  const a = await subtle.decrypt({ name: 'AES-GCM', iv }, importedKey, ciphertext);
  return a;
}

export function decode(encoded: ArrayBuffer): string {
  return Buffer.from(encoded).toString('base64');
}
