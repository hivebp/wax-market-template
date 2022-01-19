/**
 *
 * @param {string | string[] | undefined} val
 * @returns {string | undefined}
 */
export const ensureString = (val) => (val && Array.isArray(val) ? val[0] : val)

/**
 *
 * @param {string | string[] | undefined} val
 * @param {string} def
 * @returns
 */
export const ensureStringOrDefault = (val, def) => ensureString(val) ?? def
