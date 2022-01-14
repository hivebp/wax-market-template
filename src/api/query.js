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
