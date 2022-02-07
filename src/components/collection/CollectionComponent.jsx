import cn from 'classnames'
import React, { useState } from 'react'
import config from '../../config.json'
import Page from '../common/layout/Page'
import Header from '../common/util/Header'
import Link from '../common/util/input/Link'
import ScrollUpIcon from '../common/util/ScrollUpIcon'
import StaticAssetList from '../staticassetlist/StaticAssetList'
import CollectionDetails from './CollectionDetails'

/** @type {React.FC} */
const AssetListHeader = ({ children }) => (
    <h3 className="flex mt-20 mb-4 text-3xl text-left text-neutral">{children}</h3>
)

/** @type {React.FC<{ collection: import('../../api/fetch').CollectionData }>}  */
const CollectionComponent = ({ collection }) => {
    const [showImage, setShowImage] = useState(false)
    const {
        name,
        collection_name,
        img,
        data: { description = '' },
    } = collection

    const image = config.ipfs + img
    const title = `Check out ${name}`

    const [showScrollUpIcon, setShowScrollUpIcon] = useState(false)

    const toggleImage = () => {
        setShowImage(!showImage)
    }

    const scrollUp = () => {
        if (typeof window !== 'undefined') {
            const element = document.getElementById('CollectionPage')
            element?.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
        }
    }

    /** @type {React.UIEventHandler<HTMLDivElement>} */
    const handleScroll = (e) => {
        let element = e.currentTarget

        if (element.id === 'CollectionPage') setShowScrollUpIcon(element.scrollTop > element.clientHeight)
    }

    return (
        <Page onScroll={(e) => handleScroll(e)} id="CollectionPage">
            <Header title={title} description={description} image={image} />

            <div className={cn('container mx-auto')}>
                {showImage ? (
                    <div
                        className="fixed h-full w-full m-auto top-0 left-0 z-100 shadow-lg backdrop-filter backdrop-blur-lg"
                        onClick={toggleImage}
                    >
                        <img className="max-w-full max-h-full m-auto" src={image} alt="none" />
                    </div>
                ) : null}

                <div className="items-center mt-10 grid grid-cols-8 gap-8">
                    <div className="col-span-8 md:col-span-2 md:col-start-2 relative flex justify-center text-center">
                        <img className="w-full max-w-full mt-auto" src={image} alt="none" onClick={toggleImage} />
                    </div>
                    <div className="col-span-8 md:col-span-4">
                        <CollectionDetails collection={collection} />
                    </div>
                </div>

                <Link href={`/explorer?tab=assets&collection=${collection_name}`}>
                    <AssetListHeader>Newest Assets</AssetListHeader>
                </Link>
                <StaticAssetList type="assets" collection={collection_name} />

                <Link href={`/market?collection=${collection_name}&sort=date_desc`}>
                    <AssetListHeader>Latest Listings</AssetListHeader>
                </Link>
                <StaticAssetList type="listings" collection={collection_name} />

                <AssetListHeader>Top Sales</AssetListHeader>
                <StaticAssetList type="sales" collection={collection_name} />
            </div>

            {showScrollUpIcon ? <ScrollUpIcon onClick={scrollUp} /> : null}
        </Page>
    )
}

export default CollectionComponent
