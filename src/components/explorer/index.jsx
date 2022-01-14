import cn from 'classnames'
import qs from 'qs'
import React, { useEffect, useState } from 'react'
import { Tab, Tabs } from 'react-bootstrap'
import Page from '../common/layout/Page'
import { getValues, setQueryStringWithoutPageReload } from '../helpers/Helpers'
import TabItem from '../tabitem/TabItem'
import AssetList from './AssetList'
import CollectionList from './CollectionList'

const Explorer = (props) => {
    const values = getValues()

    const keys = ['collections', 'assets']

    const [tabKey, setTabKey] = useState(
        process.browser
            ? values['tab'] && keys.includes(values['tab'])
                ? values['tab']
                : 'collections'
            : props.tab && keys.includes(props.tab)
            ? props.tab
            : 'collections',
    )

    const GetAssets = async (key, initial = false) => {
        if (key !== tabKey || initial) {
            const query = values

            delete query['search_type']
            delete query['sort']
            query['tab'] = key
            delete query['offer_type']

            if (!initial) setQueryStringWithoutPageReload(qs.stringify(query))
            setTabKey(key)
        }
    }

    useEffect(() => {
        GetAssets(tabKey, true)
    }, [tabKey])

    return (
        <Page>
            <Tabs
                className={cn(
                    'border-tabs',
                    'flex  h-12 my-10 rounded-md',
                    'text-sm lg:text-base text-neutral',
                    'border border-paper',
                )}
                defaultActiveKey={tabKey}
                id="collection-switch"
                onSelect={(k) => GetAssets(k)}
            >
                <Tab
                    eventKey="collections"
                    title={<TabItem target={'collections'} tabKey={tabKey} title={'Collections'} />}
                >
                    {tabKey === 'collections' && <CollectionList />}
                </Tab>
                <Tab eventKey="assets" title={<TabItem target={'assets'} tabKey={tabKey} title={'Assets'} />}>
                    {tabKey === 'assets' && <AssetList />}
                </Tab>
            </Tabs>
        </Page>
    )
}

export default Explorer
