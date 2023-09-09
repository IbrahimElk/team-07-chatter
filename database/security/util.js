//Author: Barteld Van Nieuwenhove
//Date: 2023/03/09
/**
 * Convert an ArrayBuffer encoded in base64url to prevent characters like \ to its string representation.
 * @param encoded raw buffer of binary data.
 * @returns String representation of the binary data.
 */
export function arrayBufferToString(encoded) {
    return Buffer.from(encoded).toString('base64url');
}
/**
 * Encodes string encoded in base64url to prevent characters like \ into a Uint8Array.
 * @param string string to be encoded.
 * @returns Uint8Array representation of string.
 */
export function stringToUint8Array(string) {
    return new Uint8Array(Buffer.from(string, 'base64url'));
}
//# sourceMappingURL=util.js.map