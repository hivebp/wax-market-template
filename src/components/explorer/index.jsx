import cn from 'classnames'
import React, { useMemo } from 'react'
import { Tab, Tabs } from 'react-bootstrap'
import Page from '../common/layout/Page'
import { getElementFromList, useQuerystring } from '../helpers/Helpers'
import TabItem from '../tabs/TabItem'
import AssetList from './AssetList'
import CollectionList from './CollectionList'

export const explorerTabs = ['collections', 'assets']

export const getTabFromString = getElementFromList(explorerTabs)

/**
 * @type {React.FC}
 */
export const Explorer = () => {
    const [values, updateQuerystring] = useQuerystring()
    const activeTab = useMemo(() => getTabFromString(values.tab), [values.tab])

    return (
        <Page>
            <Tabs
                className={cn(
                    'border-tabs',
                    'flex  h-12 my-10 rounded-md pl-4',
                    'text-sm lg:text-base text-neutral',
                    'border border-paper items-center',
                )}
                defaultActiveKey={activeTab}
                onSelect={(newTab) => newTab && updateQuerystring({ tab: getTabFromString(newTab) }, true)}
            >
                <Tab
                    eventKey="collections"
                    title={<TabItem target={'collections'} tabKey={activeTab} title={'Collections'} />}
                    unmountOnExit
                >
                    <CollectionList />
                </Tab>
                <Tab
                    eventKey="assets"
                    title={<TabItem target={'assets'} tabKey={activeTab} title={'Assets'} />}
                    unmountOnExit
                >
                    <AssetList />
                </Tab>
            </Tabs>
        </Page>
    )
}

export default Explorer
