/**
 * Convert an ArrayBuffer encoded in base64url to prevent characters like \ to its string representation.
 * @param encoded raw buffer of binary data.
 * @returns String representation of the binary data.
 */
export declare function arrayBufferToString(encoded: ArrayBuffer): string;
/**
 * Encodes string encoded in base64url to prevent characters like \ into a Uint8Array.
 * @param string string to be encoded.
 * @returns Uint8Array representation of string.
 */
export declare function stringToUint8Array(string: string): Uint8Array;
//# sourceMappingURL=util.d.ts.map