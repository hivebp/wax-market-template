import { useEffect } from 'react'
import { useStore } from '../store/Store'

/**
 * @template ResultData
 * @typedef {Object} QueryHookResult
 * @property {ResultData} data
 * @property {boolean} loading
 * @property {undefined | Error} error
 */

/** @returns {QueryHookResult<string[]>} */
export const useCollections = () =>
    useStore((state) => ({
        data: state.collections().getData(),
        loading: state.collections().state === 'loading',
        error: state.collections().error,
    }))

/** @returns {QueryHookResult<import('./fetch').CollectionData[]>} */
export const useCollectionData = () => {
    const { data: collections } = useCollections()
    const { load, data, loading, error } = useStore((state) => ({
        load: state.collectionData().load,
        data: state.collectionData().data,
        loading: state.collectionData().state === 'loading',
        error: state.collectionData().error,
    }))
    useEffect(() => {
        if (collections.length) return load(collections)
    }, [collections, load])
    return { data, loading, error }
}

/**
 * 🛑 This implementation allows for only one active filter at a time!
 * @param {import('./filter').FilterType=} filter
 * @returns {QueryHookResult<import('./fetch').Template[]>}
 **/
export const useTemplates = (filter) => {
    const { data: collections } = useCollections()
    const { load, data, loading, error } = useStore((state) => ({
        load: state.templates().load,
        data: state.templates().data,
        loading: state.templates().state === 'loading',
        error: state.templates().error,
    }))
    useEffect(() => {
        if (collections.length) return load({ collections, limit: 1000, ...filter })
    }, [filter, collections, load])
    return { data, loading, error }
}

/**
 * 🛑 This implementation allows for only one active filter at a time!
 * @param {import('./filter').FilterType=} filter
 * @returns {QueryHookResult<import('./fetch').Schema[]>}
 **/
export const useSchemas = (filter) => {
    const { data: collections } = useCollections()
    const { load, data, loading, error } = useStore((state) => ({
        load: state.schemas().load,
        data: state.schemas().data,
        loading: state.schemas().state === 'loading',
        error: state.schemas().error,
    }))
    useEffect(() => {
        if (collections.length) return load({ collections, ...filter })
    }, [filter, collections, load])
    return { data, loading, error }
}

/** @returns {QueryHookResult<import('./fetch').Pack[]>} */
export const usePacks = () => {
    const { data: collections } = useCollections()
    const { load, data, loading, error } = useStore((state) => ({
        load: state.packs().load,
        data: state.packs().data,
        loading: state.packs().state === 'loading',
        error: state.packs().error,
    }))
    useEffect(() => {
        if (collections.length) return load({ collections })
    }, [collections, load])
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
        error: state.assets().error,
    }))
    useEffect(() => {
        if (filter) return load(filter)
    }, [filter, load])
    return { data, loading, error }
}
