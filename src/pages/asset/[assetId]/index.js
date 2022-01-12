import qs from 'qs'
import React from 'react'
import { getAsset } from '../../../api/fetch'
import AssetComponent from '../../../components/asset/AssetComponent'

const Asset = (props) => {
    return <AssetComponent {...props} />
}

Asset.getInitialProps = async (ctx) => {
    const paths = ctx.asPath.split('/')
    const assetId =
        paths[paths.length - 1].indexOf('?') > 0
            ? paths[paths.length - 1].substr(0, paths[paths.length - 1].indexOf('?'))
            : paths[paths.length - 1]

    const asset = await getAsset(assetId)

    const values = qs.parse(paths[2].replace(`${assetId}?`, ''))
    values['asset'] = asset && asset.data

    return values
}

export default Asset
