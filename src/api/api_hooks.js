import { useEffect } from 'react'
import { useStore } from '../store/Store'

/**
 * @template ResultData
 * @typedef {Object} QueryHookResult
 * @property {ResultData} data
 * @property {boolean} loading
 * @property {any} error
 */

/** @returns {QueryHookResult<string[]>} */
export const useCollections = () =>
    useStore((state) => ({
        data: state.collections().getData(),
        loading: state.collections().state === 'loading',
        error: null,
    }))

/** @returns {QueryHookResult<import('./fetch').CollectionData[]>} */
export const useCollectionData = () => {
    const { data: collections } = useCollections()
    const { load, data, loading, error } = useStore((state) => ({
        load: state.collectionData().load,
        data: state.collectionData().data,
        loading: state.collectionData().state === 'loading',
        error: null,
    }))
    useEffect(() => {
        if (collections.length) load(collections)
    }, [collections])
    return { data, loading, error }
}

/** @returns {QueryHookResult<import('./fetch').Template[]>} */
export const useTemplates = () => {
    const { data: collections } = useCollections()
    const { load, data, loading, error } = useStore((state) => ({
        load: state.templates().load,
        data: state.templates().data,
        loading: state.templates().state === 'loading',
        error: null,
    }))
    useEffect(() => {
        if (collections.length) load({ collections, limit: 1000 })
    }, [collections])
    return { data, loading, error }
}
/** @returns {QueryHookResult<import('./fetch').Schema[]>} */
export const useSchemas = () => {
    const { data: collections } = useCollections()
    const { load, data, loading, error } = useStore((state) => ({
        load: state.schemas().load,
        data: state.schemas().data,
        loading: state.schemas().state === 'loading',
        error: null,
    }))
    useEffect(() => {
        if (collections.length) load({ collections })
    }, [collections])
    return { data, loading, error }
}
/** @returns {QueryHookResult<import('./fetch').Pack[]>} */
export const usePacks = () => {
    const { data: collections } = useCollections()
    const { load, data, loading, error } = useStore((state) => ({
        load: state.packs().load,
        data: state.packs().data,
        loading: state.packs().state === 'loading',
        error: null,
    }))
    useEffect(() => {
        if (collections.length) load({ collections })
    }, [collections])
    return { data, loading, error }
}

/**
 * 🛑 This implementation allows for only one active filter at a time!
 * @param {import('./filter').FilterType=} filter
 * @returns {QueryHookResult<import('./fetch').Asset[]>}
 **/
export const useAssets = (filter = undefined) => {
    const { load, data, loading, error } = useStore((state) => ({
        load: state.assets().load,
        data: state.assets().data,
        loading: state.assets().state === 'loading',
        error: null,
    }))
    useEffect(() => {
        if (filter) load(filter)
    }, [filter])
    return { data, loading, error }
}
