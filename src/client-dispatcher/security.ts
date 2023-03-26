import { client } from './main.js';

export async function generateKeyPair(): Promise<{ publicKey: string; privateKey: string }> {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: { name: 'SHA-256' },
    },
    true,
    ['encrypt', 'decrypt']
  );
  const publicKey = await crypto.subtle.exportKey('pkcs8', keyPair.publicKey);
  const privateKey = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
  return {
    publicKey: arrayBufferToString(publicKey),
    privateKey: arrayBufferToString(privateKey),
  };
}

// Encryption function
async function encrypt(plaintext: string): Promise<string> {
  const publicKeybuffer = stringToUint8Array(client.getServerPublicKey());
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    publicKeybuffer,
    { name: 'RSA-OAEP', hash: 'SHA-256' },
    true,
    ['encrypt']
  );
  const ciphertext = await crypto.subtle.encrypt({ name: 'RSA-OAEP' }, cryptoKey, new TextEncoder().encode(plaintext));
  return arrayBufferToString(ciphertext);
}

// Decryption function
export async function decrypt(ciphertext: string): Promise<string> {
  const privateKeybuffer = stringToUint8Array(client.getOwnPrivateKey());
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    privateKeybuffer,
    { name: 'RSA-OAEP', hash: 'SHA-256' },
    true,
    ['decrypt']
  );
  const plaintext = await crypto.subtle.decrypt({ name: 'RSA-OAEP' }, cryptoKey, stringToUint8Array(ciphertext));
  return new TextDecoder().decode(plaintext);
}

/**
 * Convert an ArrayBuffer encoded in base64url to prevent characters like \ to its string representation.
 * @param encoded raw buffer of binary data.
 * @returns String representation of the binary data.
 */
export function arrayBufferToString(encoded: ArrayBuffer): string {
  return Buffer.from(encoded).toString('base64');
}

/**
 * Encodes string encoded in base64url to prevent characters like \ into a Uint8Array.
 * @param string string to be encoded.
 * @returns Uint8Array representation of string.
 */
export function stringToUint8Array(string: string): Uint8Array {
  return new Uint8Array(Buffer.from(string, 'base64url'));
}
