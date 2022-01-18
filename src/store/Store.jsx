import React, { createContext, useReducer } from 'react'
import create from 'zustand'
import { getAssets, getCollections, getPacks, getSchemas, getTemplates, loadCollections } from '../api/fetch'
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
 * @property {ResourceState} state
 * @property {undefined} lastLoaded
 * @property {VoidFunction} load
 * @property {(...args: Parameters<FetchFunction>) => ReturnType<FetchFunction>} getData
 */

/**
 * @template Data
 * @param {(param: any, controller: AbortController) => Promise<Data>} fetcher
 */
const createResource = (fetcher) =>
    create((set, get) => ({
        data: [],
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
                set({ state: RESOURCE_STATE_LOADED, lastLoaded: Date.now(), data: data })
            }

            start()
            return () => {
                const { data, state } = get()
                console.log({ state, data })
                if (state === RESOURCE_STATE_LOADING) {
                    console.log('>>> aborting')
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

/** @type {(collections: string[]) => Promise<import('../api/fetch').CollectionData[]>} */
const fetchCollectionsData = async (...args) => (await getCollections(...args)).data
/** @type {(collections: import('../api/filter').FilterType) => Promise<import('../api/fetch').Template[]>} */
const fetchTemplates = async (...args) => (await getTemplates(...args)).data
/** @type {(collections: import('../api/filter').FilterType) => Promise<import('../api/fetch').Asset[]>} */
// @ts-ignore
const fetchAssets = async (...args) => (await getAssets(...args)).data

const useCollectionStore = createResource(loadCollections)
const useCollectionDataStore = createResource(fetchCollectionsData)
const useTemplateStore = createResource(fetchTemplates)
const useSchemaStore = createResource(getSchemas)
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
        set({ query: queryparams })
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
