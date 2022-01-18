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
 * @param {(...args: any[]) => Promise<Data>} fetcher
 */
const createResource = (fetcher) =>
    create((set, get) => ({
        data: [],
        state: RESOURCE_STATE_INITIAL,
        lastLoaded: undefined,
        load: async (/** @type {Parameters<typeof fetcher>} */ ...args) => {
            set({ state: RESOURCE_STATE_LOADING })
            const data = await fetcher(...args)
            set({ state: RESOURCE_STATE_LOADED, lastLoaded: Date.now(), data: data })
        },
        getData: (/** @type {Parameters<typeof fetcher>} */ ...args) => {
            const { data, state, load } = get()
            if (state === RESOURCE_STATE_INITIAL) load(...args)
            return data
        },
    }))

/** @type {(collections: string[]) => Promise<import('../api/fetch').CollectionData[]>} */
const fetchCollectionsData = async (collections) => (await getCollections(collections)).data
/** @type {(collections: import('../api/filter').FilterType) => Promise<import('../api/fetch').Template[]>} */
const fetchTemplates = async (filter) => (await getTemplates(filter)).data
/** @type {(collections: import('../api/filter').FilterType) => Promise<import('../api/fetch').Asset[]>} */
// @ts-ignore
const fetchAssets = async (filter) => (await getAssets(filter)).data

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
