import qs from 'qs'
import React from 'react'
import Market from '../../components/market'

const MarketPage = (props) => {
    return <Market {...props} />
}

MarketPage.getInitialProps = async (ctx) => {
    const paths = ctx.asPath.split('/')

    return qs.parse(paths[1].replace('market?', ''))
}

export default MarketPage
