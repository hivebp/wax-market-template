// Should never happen 😇 You are missing a status code in your `on(…)` calls.
const INVALID_STATUS = 599

/**
 * Call to clean up the state of this. Wrap it in `afterEach(() => {…}` or like `afterEach(reset)`
 */
export const reset = () => {
    expect(waitingRequests).toHaveLength(0)
    expect(expectedCalls).toHaveLength(0)
    expect(calls.every((call) => call.valid)).toBeTruthy()
    waitingRequests = []
    expectedCalls = []
    calls = []
    matchMode = MATCH_FIFO
}

const MATCH_FIFO = 'fifo'
const MATCH_URL = 'url'
let matchMode = MATCH_FIFO

/**
 * @param {'fifo' | 'url'} mode
 */
export const setMatchMode = (mode) => (matchMode = mode)

/**
 * Debug report for `afterEach` or just somewhere in your tests
 */
export const report = () => {
    console.log({ waitingRequests, expectedCalls, calls })
}

/**
 * List of all calls made
 * @type {(Call & { valid: boolean })[]}
 */
export let calls = []

/**
 * @typedef {{match: FetchFn<boolean>, response: any, status: number}} ExpectedCall
 */

/**
 * List of all currently expected calls to be made in the future
 * @type {ExpectedCall[]}
 */
export let expectedCalls = []

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
 * @property {any} [body]
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

/**
 * @type {FetchFn<ExpectedCall | undefined>}
 */
const findNextCall = (input, init) => {
    switch (matchMode) {
        default:
        case MATCH_FIFO:
            return expectedCalls.shift()
        case MATCH_URL: {
            const index = expectedCalls.findIndex(({ match }) => match(input, init))
            if (index === -1) {
                console.error(`Unable to find matching request for ${input} [${init?.body}]`)
                return undefined
            }
            const call = expectedCalls[index]
            expectedCalls = [...expectedCalls.slice(0, index), ...expectedCalls.slice(index + 1)]
            return call
        }
    }
}

/** The heart and soul of this creation… */
global.fetch = async (input, init) => {
    const url = input.toString()
    const expectedCall = findNextCall(input, init)
    const response = await new Promise(async (resolve) => {
        if (!expectedCall) console.error(`unexpected fetch request: ${url}`)
        const response = getResponse(url, expectedCall?.response)

        waitingRequests.push({
            url,
            flush: () => resolve(response),
        })
    })

    expect(url).toEqual(response.url)

    calls.push({
        url,
        status: response.status,
        response: response,
        valid: url === response.url,
    })

    return response
}

/**
 * Register a response in the request chain. This will be picked up in order of requests that are made. Don't forget to `act(() => flush(1))` these.
 * @param {any | MaybeResponse} response
 * @param {string | FetchFn<boolean>} url
 * @param {number} [status]
 */
export const on = (response, url = '*', status = 200) => {
    expectedCalls.push({
        match: typeof url === 'string' ? (init) => init.toString() === url : url,
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
 * Flushes {n} requests. Should be wrapped in `act(() => {…})`-calls. This will allow the react test renderer to keep up with content changes.
 * @param {number} [n]
 */
export const flush = (n = waitingRequests.length) => {
    if (n > waitingRequests.length) throw new Error('Not enough requests to flush')
    while (n--) waitingRequests.pop()?.flush()
}
