/**
 * Generates a cryptographically secure random alphanumeric code.
 * @param {number} length - The length of the generated code.
 * @returns {string} - The generated secure code.
 */
export function generateSecureCode(length = 6) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const array = new Uint32Array(length);
  globalThis.crypto.getRandomValues(array);
  let code = '';
  for (let i = 0; i < length; i++) {
    code += charset[array[i] % charset.length];
  }
  return code;
}
