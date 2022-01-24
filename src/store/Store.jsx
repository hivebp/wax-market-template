import React, { createContext, useReducer } from 'react'
import create from 'zustand'
import { getAssets, getCollectionData, getPacks, getSchemas, getTemplates, loadCollections } from '../api/fetch'
import { queryParams } from '../api/query'
// import { queryParams } from '../api/query'
import reducer from './reducer'
import { initialState } from './state'

/**
 * @template State
 * @template Api
 * @typedef {import('zustand').UseBoundStore<State, Api>} UseBoundStore
 **/
/**
 * @template Api
 * @typedef {import('zustand').StoreApi<Api>} StoreApi
 **/

/**
 * @typedef {import('./state').State} State
 */

/**
 * @template State
 * @template Result
 * @typedef {(state: State) => Result} ActionFunction
 */

/**
 * @typedef {'initial' | 'loading' | 'loaded'} ResourceState
 */

/* @type {ResourceState} */
export const RESOURCE_STATE_INITIAL = 'initial'
/* @type {ResourceState} */
export const RESOURCE_STATE_LOADING = 'loading'
/* @type {ResourceState} */
export const RESOURCE_STATE_LOADED = 'loaded'

/**
 * @typedef {(...args: any[]) => Promise<any>} FetchFunction
 */

/**
 * @typedef {Object} ResourceStoreState
 * @property {ReturnType<FetchFunction>[]} data
 * @property {Error | undefined} error
 * @property {ResourceState} state
 * @property {undefined} lastLoaded
 * @property {VoidFunction} load
 * @property {(...args: Parameters<FetchFunction>) => ReturnType<FetchFunction>} getData
 */

class InvalidTypeError extends Error {
    constructor(/** @type {any} */ data) {
        super(`Invalid type: ${typeof data}`)
    }
}

/**
 * @template Data
 * @param {(param: any, controller: AbortController) => Promise<Data>} fetcher
 * @param {(val: unknown) => val is Data} guard
 */
// the given guard function is a stub and will need replacing by each resource
// @ts-ignore
const createResource = (fetcher, guard = Array.isArray) =>
    create((set, get) => ({
        data: [],
        error: undefined,
        state: RESOURCE_STATE_INITIAL,
        lastLoaded: undefined,
        lastRequest: undefined,
        load: (/** @type {any} */ param) => {
            const { state, lastRequest } = get()
            // if we are already loaded, check if the params are the same
            switch (state) {
                case RESOURCE_STATE_LOADED: {
                    if (lastRequest?.param === param) {
                        console.warn('try to refresh the store, this is currently not supported')
                        return // do nothing
                    }
                    break
                }
                case RESOURCE_STATE_LOADING: {
                    if (lastRequest?.param === param) {
                        console.debug('called load again with the same params')
                        return () => lastRequest.controller.abort()
                    }
                    // params changed, abort the previous request and start a new one
                }
            }

            const controller = new AbortController()
            const start = async () => {
                // initiate the request, save request info
                set({ state: RESOURCE_STATE_LOADING, lastRequest: { param, controller } })
                const data = await fetcher(param, controller)
                if (guard(data)) set({ state: RESOURCE_STATE_LOADED, lastLoaded: Date.now(), data })
                else {
                    const error = new InvalidTypeError(data)
                    set({ state: RESOURCE_STATE_LOADED, lastLoaded: Date.now(), error })
                    console.error(error)
                }
            }

            start()
            return () => {
                const { data, state } = get()
                if (state === RESOURCE_STATE_LOADING) {
                    set({ state: data.length ? RESOURCE_STATE_LOADED : RESOURCE_STATE_INITIAL })
                    controller.abort()
                }
            }
        },
        getData: (/** @type {any} */ param) => {
            const { data, state, load } = get()
            if (state === RESOURCE_STATE_INITIAL) load(param)
            return data
        },
    }))

/**
 * @template Data
 * @param {Promise<{ data: Data }>} result
 **/
const getDataPropertyFromResult = async (result) => (await result).data

/** @type {(collections: string[]) => Promise<import('../api/fetch').CollectionData[]>} */
const fetchCollectionsData = (...args) => getDataPropertyFromResult(getCollectionData(...args))

/** @type {(collections: import('../api/filter').FilterType) => Promise<import('../api/fetch').Template[]>} */
const fetchTemplates = (...args) => getDataPropertyFromResult(getTemplates(...args))

/** @type {(collections: import('../api/filter').FilterType) => Promise<import('../api/fetch').Schema[]>} */
// @ts-ignore
const fetchSchemas = (...args) => getDataPropertyFromResult(getSchemas(...args))

/** @type {(collections: import('../api/filter').FilterType) => Promise<import('../api/fetch').Asset[]>} */
// @ts-ignore
const fetchAssets = (...args) => getDataPropertyFromResult(getAssets(...args))

const useCollectionStore = createResource(loadCollections)
const useCollectionDataStore = createResource(fetchCollectionsData)
const useTemplateStore = createResource(fetchTemplates)
const useSchemaStore = createResource(fetchSchemas)
const usePackStore = createResource(getPacks)
const useAssetStore = createResource(fetchAssets)

const useLocationStore = create((set, get) => ({
    pathname: typeof window === 'undefined' ? '/' : window.location.pathname,
    query: queryParams(),
    /**
     * @param {import('../api/query').QueryParams} queryparams
     * @returns {string} new pathname
     **/
    updateQuery: (queryparams) => {
        // this needs to create a new object to ensure the equality check used by useEffect and useMemo will work as expected by the users
        set({ query: { ...queryparams } })
        const path = `${get().pathname}?${new URLSearchParams(queryparams)}`
        return path
    },
    init:
        typeof window === 'undefined'
            ? () => {}
            : () => set({ pathname: window.location.pathname, query: queryParams() }),
}))

export const useStore = create(() => ({
    assets: useAssetStore,
    collectionData: useCollectionDataStore,
    collections: useCollectionStore,
    location: useLocationStore,
    packs: usePackStore,
    schemas: useSchemaStore,
    templates: useTemplateStore,
}))

/**
 * @type {React.FC}
 */
const Store = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    return <Context.Provider value={[state, dispatch]}>{children}</Context.Provider>
}

/**
 * @type {[import('./state').State, React.Dispatch<any>]}
 */
const initialContext = [initialState, () => {}]

export const Context = createContext(initialContext)
export default Store
