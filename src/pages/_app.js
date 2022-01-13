import { Wax } from '@eosdacio/ual-wax'
import React, { useContext, useEffect } from 'react'
import 'react-dropdown/style.css'
import { QueryClient, QueryClientProvider } from 'react-query'
import 'regenerator-runtime/runtime'
import { Anchor } from 'ual-anchor'
import { UALProvider, withUAL } from 'ual-reactjs-renderer'
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

const queryClient = new QueryClient()

const waxNet = {
    chainId: '1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4',
    rpcEndpoints: [
        {
            protocol: 'https',
            host: config.api_endpoint.replace('https://', '').replace('http://', ''),
            port: 443,
        },
    ],
}

const anchor = new Anchor([waxNet], {
    appName: config.market_name,
})

const wax = new Wax([waxNet], {
    appName: config.market_name,
})

const wallets = [wax, anchor]

const disptachCollectionsData = (dispatch, collections) => {
    dispatch({ type: 'SET_COLLECTIONS', payload: collections })
    dispatch({ type: 'SET_COLLECTION_DATA', payload: getCollections(collections) })
    dispatch({ type: 'SET_TEMPLATE_DATA', payload: getTemplates({ collections: collections, limit: 1000 }) })
    dispatch({ type: 'SET_SCHEMA_DATA', payload: getSchemas({ collections: collections }) })
    if (packs_contracts.length) dispatch({ type: 'SET_PACK_DATA', payload: getPacks({ collections: collections }) })
}

function MyApp({ Component, pageProps }) {
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function () {
                navigator.serviceWorker.register('/sw.js').then(
                    function (registration) {
                        console.log('Service Worker registration successful with scope: ', registration.scope)
                    },
                    function (err) {
                        console.log('Service Worker registration failed: ', err)
                    },
                )
            })
        }
    }, [])

    const AppContainer = (props) => {
        const [, dispatch] = useContext(Context)

        useEffect(() => {
            const initialize = async () => {
                const collections = await loadCollections()
                disptachCollectionsData(dispatch, collections)
            }
            initialize()
        }, [])

        return (
            <div>
                <WindowWrapper {...props} />
                <div className={'h-screen overflow-y-hidden bg-page'}>
                    <Navigation {...props} />
                    <div className={'relative h-page-s md:h-page top-48 md:top-28 overflow-y-auto'}>
                        <Component {...props} />
                        <Footer {...props} />
                    </div>
                </div>
            </div>
        )
    }

    const AppWithUAL = withUAL(AppContainer)

    return (
        <MarketWrapper>
            <UALProvider chains={[waxNet]} authenticators={wallets} appName={config.market_name}>
                <QueryClientProvider client={queryClient}>
                    <AppWithUAL {...pageProps} />
                </QueryClientProvider>
            </UALProvider>
        </MarketWrapper>
    )
}

export default MyApp
