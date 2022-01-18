/**
 * @typedef {Record<string, string>} QueryParams
 */

/**
 *
 * @param {string} path
 * @param {Record<string, number | string | string[]> | URLSearchParams=} params
 * @returns
 */
export const query = (path, params = undefined) => {
    if (!params) return path
    // @ts-ignore
    const searchParams = new URLSearchParams(params)
    return `${path}?${searchParams.toString()}`
}

/**
 * converts an iterator to an Record<string, string>
 * @param {IterableIterator<[string, string]>} entries
 * @returns
 */
export const iteratorToObject = (entries) => {
    /** @type {QueryParams} */
    const result = {}
    for (const [key, value] of entries) {
        // each 'entry' is a [key, value] tupple
        result[key] = value
    }
    return result
}

export const queryParams = () =>
    iteratorToObject(new URLSearchParams(typeof window === 'undefined' ? '' : window.location.search).entries())
