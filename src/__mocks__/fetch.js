const INVALID_STATUS = 599

export const reset = () => {
    expect(waitingRequests).toHaveLength(0)
    expect(expectedCalls).toHaveLength(0)
    expect(calls.every((call) => call.valid)).toBeTruthy()
}

export const report = () => {
    console.log({ waitingRequests, expectedCalls, calls })
}

/**
 * List of all calls made
 * @type {(Call & { valid: boolean })[]}
 */
let calls = []

/**
 * List of all currently expected calls to be made in the future
 * @type {(Call | (FetchFn<MaybeResponse>))[]}
 */
let expectedCalls = []

/**
 * List of all currently active Requests to be flushed
 * @type {{ url: string, flush: VoidFunction }[]}
 */
export let waitingRequests = []

/**
 * @typedef {string | [number, string] | Response} MaybeResponse
 */

/**
 * @template T
 * @typedef {(input: RequestInfo, init?: RequestInit) => T} FetchFn
 */

/**
 * @typedef {Object} Call
 * @property {string} [url]
 * @property {number} [status]
 * @property {MaybeResponse} response
 **/

/**
 * @param {string} [msg]
 * @returns {() => Promise<any>}
 */
const throwThis = (msg) => () => {
    throw new Error(msg ?? 'Not implemented!')
}
/**
 * @param {string} [msg]
 * @returns {() => any}
 */
const throwThisSync = (msg) => () => {
    throw new Error(msg ?? 'Not implemented!')
}

/**
 * @param {string} url
 * @param {string | any} content
 * @param {number} [statusCode]
 * @returns {Response}
 */
export const createResponse = (url, content, statusCode = 200) => ({
    arrayBuffer: throwThis(),
    blob: async () => new Blob(content),
    // @ts-ignore
    body: 'Not implemented!',
    bodyUsed: false,
    clone: throwThisSync(),
    // @ts-ignore
    formData: 'Not implemented!',
    // @ts-ignore
    headers: 'Not implemented!',
    json: () => (typeof content === 'string' ? JSON.parse(content) : content),
    ok: statusCode >= 200 && statusCode < 300,
    redirected: false,
    statusText: 'Not implemented!',
    status: statusCode,
    text: () => Promise.resolve(typeof content === 'string' ? content : JSON.stringify(content)),
    // @ts-ignore
    type: 'Not implemented!',
    url,
})

/**
 *
 * @param {Call | MaybeResponse} call
 * @param {number} [status]
 * @param {string} [url]
 * @return {{ type: 'result', result: string, status: number, url?: string } | { type: 'response', response: Response }}
 */
const responseHandler = (call, status = 200, url = undefined) => {
    if (typeof call === 'string') {
        return {
            type: 'result',
            result: call,
            status,
            url,
        }
    }
    if (Array.isArray(call)) {
        return {
            type: 'result',
            result: call[1],
            status: call[0],
        }
    }
    if ('ok' in call) {
        return { type: 'response', response: call }
    }
    return responseHandler(call.response, call.status, call.url)
}

/**
 * @param {string} url
 * @param {MaybeResponse | Call} [call]
 * @returns
 */
const getResponse = (url, call) => {
    if (!call) return createResponse(url, {}, INVALID_STATUS)
    const result = responseHandler(call)
    if (result.type === 'response') return result.response
    return createResponse(result.url ?? url, result.result, result.status)
}

global.fetch = async (input, init) => {
    const url = input.toString()
    const response = await new Promise(async (resolve) => {
        const call = expectedCalls.shift()

        if (!call) console.error(`unexpected fetch request: ${url}`)
        const response = getResponse(url, typeof call === 'function' ? call(input, init) : call)

        waitingRequests.push({
            url,
            flush: () => resolve(response),
        })
    })

    calls.push({
        url,
        status: response.status,
        response: response,
        valid: url === response.url,
    })

    return response
}

/**
 * @param {string} url
 * @param {any | MaybeResponse} response
 * @param {number} [status]
 */
export const on = (response, url = '*', status = 200) => {
    expectedCalls.push({
        url,
        response:
            typeof response === 'function'
                ? response
                : typeof response === 'object'
                ? JSON.stringify(response)
                : response,
        status,
    })
}

/**
 * Flushes {n} requests
 * @param {number} [n]
 */
export const flush = (n = waitingRequests.length) => {
    if (n > waitingRequests.length) throw new Error('Not enough requests to flush')
    while (n--) waitingRequests.pop()?.flush()
}
