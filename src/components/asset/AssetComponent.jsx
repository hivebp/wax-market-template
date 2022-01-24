import cn from 'classnames'
import React from 'react'
import config from '../../config.json'
import ErrorPage from '../../pages/_error.page'
import AssetDetails from '../asset/AssetDetails'
import AssetImage from '../asset/AssetImage'
import Page from '../common/layout/Page'
import Header from '../common/util/Header'

/**
 * @type {React.FC<{ asset?: import('../../api/fetch').Asset }>}
 */
export const AssetComponent = (props) => {
    if (!props.asset) return <ErrorPage />
    const asset = props.asset
    const { name, data, collection, template_mint, asset_id } = asset

    const image = data.img ? config.ipfs + data.img : ''

    const title = `Check out ${name}`

    let description = `by ${collection.name}${template_mint ? ' - Mint #' + template_mint : ''}`

    return (
        <Page id="AssetPage">
            <Header title={title} image={image} description={description} />
            <div className={cn('container mx-auto pt-10')}>
                <div className="flex flex-col items-center md:justify-center md:flex-row h-auto px-10">
                    <div className="w-full md:w-2/5">
                        <AssetImage asset={asset} />
                    </div>
                    <div className="w-full md:w-3/5 md:px-10">
                        <AssetDetails asset={asset} />
                    </div>
                </div>
                <div className="mt-20 mb-20 leading-10 text-center">
                    <div className="relative h-1/2 t-0 m-auto">
                        <a className="text-primary" href={`https://wax.atomichub.io/explorer/asset/${asset_id}`}>
                            View on Atomichub
                        </a>
                    </div>
                </div>
            </div>
        </Page>
    )
}

export default AssetComponent
