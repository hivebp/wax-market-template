import React from 'react'

import qs from 'qs'
import Explorer from '../../components/explorer'

const ExplorerPage = (props) => {
    return <Explorer {...props} />
}

ExplorerPage.getInitialProps = async (ctx) => {
    const paths = ctx.asPath.split('/')

    return qs.parse(paths[1].replace('explorer?', ''))
}

export default ExplorerPage
