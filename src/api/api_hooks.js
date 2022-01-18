import { useEffect } from 'react'
import { useStore } from '../store/Store'

/** @returns {string[]} */
export const useCollections = () => useStore((state) => state.collections().getData())

/** @returns {import('./fetch').CollectionData[]} */
export const useCollectionData = () => {
    const collections = useCollections()
    const [load, data] = useStore((state) => [state.collectionData().load, state.collectionData().data])
    useEffect(() => {
        if (collections.length) load(collections)
    }, [collections])
    return data
}

/** @return {import('./fetch').Template[]} */
export const useTemplates = () => {
    const collections = useCollections()
    const [load, data] = useStore((state) => [state.templates().load, state.templates().data])
    useEffect(() => {
        if (collections.length) load({ collections, limit: 1000 })
    }, [collections])
    return data
}
/** @return {import('./fetch').Schema[]} */
export const useSchemas = () => {
    const collections = useCollections()
    const [load, data] = useStore((state) => [state.schemas().load, state.schemas().data])
    useEffect(() => {
        if (collections.length) load({ collections })
    }, [collections])
    return data
}
/** @return {import('./fetch').Pack[]} */
export const usePacks = () => {
    const collections = useCollections()
    const [load, data] = useStore((state) => [state.packs().load, state.packs().data])
    useEffect(() => {
        if (collections.length) load({ collections })
    }, [collections])
    return data
}
