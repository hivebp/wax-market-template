import React from 'react'
import { createUseGetter, getCollection } from '../../../api/fetch'
import { ensureString } from '../../../api/utils'
import CollectionComponent from '../../../components/collection/CollectionComponent'
import LoadingIndicator from '../../../components/loadingindicator/LoadingIndicator'
import config from '../../../config.json'
/**
 * @type {import('next').NextPage<{ collection: string | undefined }>}
 */
const Collection = (props) => {
    const { data: collection, loading } = createUseGetter(getCollection)(props.collection ?? config.default_collection)
    if (loading) return <LoadingIndicator />
    if (!collection) <div>Unable to load Collection</div>
    return <CollectionComponent collection={collection} />
}

Collection.getInitialProps = (ctx) => {
    return { collection: ensureString(ctx.query.collection) }
}

export default Collection
