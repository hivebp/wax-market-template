import qs from 'qs'
import React from 'react'
import Auctions from '../../../components/auctions'

/**
 * @type {import('next').NextPage<{ bidder?: string, winner?: string }>}
 */
const BidsUserPage = (props) => {
    return <Auctions {...props} />
}

BidsUserPage.getInitialProps = async (ctx) => {
    const c = ctx.query.user

    const paths = ctx.asPath.split('/')

    const values = qs.parse(paths[2].replace(c + '?', ''))

    values['bidder'] = c

    return values
}

export default BidsUserPage
