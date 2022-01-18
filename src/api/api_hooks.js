import { useContext, useEffect } from 'react'
import { useLoader } from '../store/selectors'
import { Context } from '../store/Store'

export const useCollections = () => {
    const [state, dispatch] = useContext(Context)
    const collectionsLoader = useLoader('collections')

    useEffect(() => {
        console.log('useCollections: collectionsLoader', collectionsLoader)
        dispatch({ type: 'START_LOADING', payload: 'collections' })
    }, [collectionsLoader === 'initial'])

    console.log('useCollections', state)
    return state.collections
}

export const useAssets = () => {
    const [state, dispatch] = useContext(Context)

    console.log('useAssets', state)
}
