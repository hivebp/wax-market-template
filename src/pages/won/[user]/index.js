import qs from 'qs'
import React from 'react'
import Auctions from '../../../components/auctions'

const BidsPage = (props) => {
    return <Auctions {...props} />
}

BidsPage.getInitialProps = async (ctx) => {
    const user = ctx.query.user
    const paths = ctx.asPath.split('/')
    const values = qs.parse(paths[2].replace(user + '?', ''))
    values['winner'] = user
    return values
}

export default BidsPage
