import React from 'react'
import { ensureString } from '../../../../api/utils'
import BlenderizerComponent from '../../../../components/blends/BlenderizerComponent'

/**
 * @type {import('next').NextPage<Partial<import('../../../../components/blends/BlenderizerComponent').BlenderizerInitialProps>>}
 */
const BlenderizerCollectionTemplateIdPage = ({ collectionName, templateId }) => {
    if (!collectionName) return <div>No collection name provided</div>
    if (!templateId) return <div>No template id provided</div>
    return <BlenderizerComponent collectionName={collectionName} templateId={templateId} />
}

BlenderizerCollectionTemplateIdPage.getInitialProps = (ctx) => {
    return {
        templateId: ensureString(ctx.query.template_id),
        collectionName: ensureString(ctx.query.collection),
    }
}

export default BlenderizerCollectionTemplateIdPage
