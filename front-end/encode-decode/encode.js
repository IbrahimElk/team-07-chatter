// Guust Luyckx
// 22/04/2023
/**
 * this function encodes a string that has dangerous symbols in it that could lead to javascript injections
 * @param string the string that needs to be encoded
 * @returns the encoded string
 */
export function encodeHTMlInput(string) {
    const entities = [
        ['&', '&amp'],
        ['<', '&lt'],
        ['>', '&gt'],
        ['"', '&quot'],
        ["'", '&#x27'],
    ];
    let encoded_string = string;
    for (const [char, entity] of entities) {
        const regex = new RegExp(char, 'g');
        encoded_string = encoded_string.replace(regex, entity);
    }
    return encoded_string;
}
//# sourceMappingURL=encode.js.map