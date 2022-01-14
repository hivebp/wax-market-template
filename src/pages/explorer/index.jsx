import qs from 'qs'
import React from 'react'
import Explorer from '../../components/explorer'

const ExplorerPage = (props) => {
    return <Explorer {...props} />
}

ExplorerPage.getInitialProps = async (ctx) => {
    const paths = ctx.asPath.split('/')

    const props = qs.parse(paths[1].replace('explorer?', ''))

    return props
}

export default ExplorerPage
