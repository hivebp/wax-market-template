import cn from 'classnames'
import React, { useState } from 'react'
import { Tab, Tabs } from 'react-bootstrap'
import Page from '../common/layout/Page'
import { useQuerystring } from '../helpers/Helpers'
import TabItem from '../tabs/TabItem'
import AssetList from './AssetList'
import CollectionList from './CollectionList'

/**
 * @typedef {'collections' | 'assets'} ExplorerTab
 */

/**
 * @type {ExplorerTab[]}
 */
export const explorerTabs = ['collections', 'assets']

/**
 * @type {ExplorerTab}
 */
export const DEFAULT_EXPLORER_TAB = explorerTabs[0]

/**
 *
 * @param {string} tab
 * @returns {tab is ExplorerTab}
 */
// @ts-ignore
export const isExplorerTab = (tab) => explorerTabs.includes(tab)

/**
 *
 * @param {string | null | undefined} maybeTab
 * @returns {ExplorerTab}
 */
export const getTabFromString = (maybeTab) => (maybeTab && isExplorerTab(maybeTab) ? maybeTab : DEFAULT_EXPLORER_TAB)

/**
 * @type {React.FC<{ tab: ExplorerTab }>}
 */
export const Explorer = (props) => {
    const [, updateQuerystring] = useQuerystring()
    const [tabKey, setTabKey] = useState(props.tab)
    /** @type {(tab: ExplorerTab) => void} */
    const switchTab = (tab) => {
        updateQuerystring({ tab })
        setTabKey(tab)
    }

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
                onSelect={(k) => switchTab(getTabFromString(k))}
            >
                <Tab
                    eventKey="collections"
                    title={<TabItem target={'collections'} tabKey={tabKey} title={'Collections'} />}
                    unmountOnExit
                >
                    <CollectionList />
                </Tab>
                <Tab
                    eventKey="assets"
                    title={<TabItem target={'assets'} tabKey={tabKey} title={'Assets'} />}
                    unmountOnExit
                >
                    <AssetList />
                </Tab>
            </Tabs>
        </Page>
    )
}

export default Explorer
