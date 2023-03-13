//Author: Barteld Van Nieuwenhove
//Date: 2023/03/09

/**
 * Convert an ArrayBuffer to its string representation.
 * @param encoded raw buffer of binary data.
 * @returns String representation of the binary data (in base64).
 */
export function arrayBufferToString(encoded: ArrayBuffer): string {
  return Buffer.from(encoded).toString('base64');
}

/**
 * Encodes string into a Uint8Array.
 * @param string string to be encoded.
 * @returns Uint8Array representation of string.
 */
export function stringToUint8Array(string: string): Uint8Array {
  return new Uint8Array(Buffer.from(string, 'base64'));
}
