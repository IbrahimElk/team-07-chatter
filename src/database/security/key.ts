import { subtle, getRandomValues } from 'crypto';

// AES-GCM requires a 128-bit initialization vector (iv).
export const iv = getRandomValues(new Uint8Array(16));

export const key = await subtle.generateKey(
  // The algorithm is AES in GCM mode, with a key length
  // of 256 bits.
  {
    name: 'AES-GCM',
    length: 256,
  },
  true,
  ['encrypt', 'decrypt']
);

//
// Export Key
//
const exportedKey = await subtle.exportKey('raw', key);

// This is where to save the exported key to the back-end server,
// and then to fetch the exported key from the back-end server.

//
// Import Key
//
export const importedKey = await subtle.importKey('raw', exportedKey, 'AES-GCM', true, ['encrypt', 'decrypt']);
