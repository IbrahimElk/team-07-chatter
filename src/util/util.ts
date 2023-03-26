//Author: Barteld Van Nieuwenhove
//Date: 2023/03/09

/**
 * Convert an ArrayBuffer encoded in base64.
 * @param encoded raw buffer of binary data.
 * @returns String representation of the binary data.
 */
export function arrayBufferToString(encoded: ArrayBuffer): string {
  return Buffer.from(encoded).toString('base64');
}

/**
 * Encodes string encoded in base64.
 * @param string string to be encoded.
 * @returns Uint8Array representation of string.
 */
export function stringToUint8Array(string: string): Uint8Array {
  return new Uint8Array(Buffer.from(string, 'base64'));
}
