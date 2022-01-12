import React from 'react'

import qs from 'qs'
import Blends from '../../components/blends'

const BlendsPage = (props) => {
    return <Blends {...props} />
}

BlendsPage.getInitialProps = async (ctx) => {
    const paths = ctx.asPath.split('/')

    const values = qs.parse(paths[1].replace('?', ''))

    return values
}

export default BlendsPage
