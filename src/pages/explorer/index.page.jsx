import React from 'react'
import { ensureString } from '../../api/utils'
import { Explorer, getTabFromString } from '../../components/explorer'

/**
 * @type {import('next').NextPage<{ tab: import('../../components/explorer').ExplorerTab }>}
 */
const ExplorerPage = (props) => {
    return <Explorer {...props} />
}

ExplorerPage.getInitialProps = async (ctx) => {
    const tab = ctx.query.tab
    return { tab: getTabFromString(ensureString(tab)) }
}

export default ExplorerPage
