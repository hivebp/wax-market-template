import { Wax } from '@eosdacio/ual-wax'
import { UALProvider } from 'hive-ual-renderer'
import React, { useContext, useEffect } from 'react'
import 'react-dropdown/style.css'
import 'regenerator-runtime/runtime'
import { Anchor } from 'ual-anchor'
import { useCollections } from '../api/api_hooks'
import { getCollections, getPacks, getSchemas, getTemplates, loadCollections } from '../api/fetch'
import Footer from '../components/footer'
import MarketWrapper, { Context } from '../components/marketwrapper'
import Navigation from '../components/navigation/Navigation'
import WindowWrapper from '../components/windows/WindowWrapper'
import config from '../config.json'
import '../styles/App.css'
import '../styles/globals.css'
import '../styles/Search.css'

const { packs_contracts } = config

/**
 * @type {Record<string, any>}
 */
let walletsStore = {}

/**
 *
 * @param {string} chainId
 * @param {string} apiEndpoint
 * @param {string} appName
 * @returns
 */
const useWallets = (chainId, apiEndpoint, appName) => {
    const hash = `${chainId}-${apiEndpoint}-${appName}`
    if (walletsStore[hash]) return walletsStore[hash]

    const waxNet = {
        chainId,
        rpcEndpoints: [
            {
                protocol: 'https',
                host: apiEndpoint.replace(/https?:\/\//gi, ''),
                port: 443,
            },
        ],
    }

    const authenticators = [new Anchor([waxNet], { appName }), new Wax([waxNet], { appName })]

    walletsStore[hash] = {
        appName,
        chains: [waxNet],
        authenticators,
    }

    return walletsStore[hash]
}

/**
 * @param {React.Dispatch<any>} dispatch
 * @param {string[]} collections
 */
const disptachCollectionsData = (dispatch, collections) => {
    dispatch({ type: 'SET_COLLECTIONS', payload: collections })
    dispatch({ type: 'FINISH_LOADING', payload: 'collections' })
    if (false) {
        dispatch({ type: 'SET_COLLECTION_DATA', payload: getCollections(collections) })
        dispatch({ type: 'SET_TEMPLATE_DATA', payload: getTemplates({ collections: collections, limit: 1000 }) })
        dispatch({ type: 'SET_SCHEMA_DATA', payload: getSchemas({ collections: collections }) })
        if (packs_contracts.length) dispatch({ type: 'SET_PACK_DATA', payload: getPacks({ collections: collections }) })
    }
}

/**
 * @type {React.FC<{Component: React.ComponentType<any>, pageProps: any}>}
 */
const AppContainer = ({ Component, pageProps }) => {
    const [, dispatch] = useContext(Context)
    const collections = useCollections()

    useEffect(() => {
        const initialize = async () => {
            const collectionsX = await loadCollections()
            console.log({ collections, collectionsX })
            disptachCollectionsData(dispatch, collectionsX)
        }
        initialize()
    }, [])

    return (
        <>
            <WindowWrapper />
            <div className={'h-screen overflow-y-hidden bg-page'}>
                <Navigation />
                <div className={'relative h-page-s md:h-page top-48 md:top-28 overflow-y-auto'}>
                    <Component {...pageProps} />
                    <Footer />
                </div>
            </div>
        </>
    )
}

const loadServiceWorker = () =>
    window.addEventListener('load', () =>
        navigator.serviceWorker.register('/sw.js').then(
            (registration) => console.log('Service Worker registration successful with scope: ', registration.scope),
            (err) => console.log('Service Worker registration failed: ', err),
        ),
    )

/**
 * @type {React.FC<{Component: React.ComponentType<any>, pageProps: any}>}
 */
const MyApp = ({ Component, pageProps }) => {
    useEffect(() => {
        if ('serviceWorker' in navigator) loadServiceWorker()
    }, [])

    const ualProviderProps = useWallets(
        '1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4',
        config.api_endpoint,
        config.market_name,
    )

    return (
        <MarketWrapper>
            <UALProvider {...ualProviderProps}>
                <AppContainer pageProps={pageProps} Component={Component} />
            </UALProvider>
        </MarketWrapper>
    )
}

export default MyApp
