import qs from 'qs'
import React from 'react'
import { getCollection } from '../../../api/fetch'
import CollectionComponent from '../../../components/collection/CollectionComponent'

const Collection = (props) => {
    return <CollectionComponent {...props} />
}

Collection.getInitialProps = async (ctx) => {
    const name = ctx.query.collection
    const paths = ctx.asPath.split('/')

    const collection = await getCollection(name)

    const values = qs.parse(paths[2].replace(`${name}?`, ''))
    values['collection'] = collection && collection.data

    return values
}

export default Collection
