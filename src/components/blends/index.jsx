import cn from 'classnames'
import React, { useMemo } from 'react'
import { Tab, Tabs } from 'react-bootstrap'
import config from '../../config.json'
import { useUAL } from '../../hooks/ual'
import Content from '../common/layout/Content'
import Page from '../common/layout/Page'
import { getElementFromList, useQuerystring } from '../helpers/Helpers'
import TabItem from '../tabs/TabItem'
import BlenderizerList from './BlenderizerList'
import NeftyBlendsList from './NeftyBlendsList'

export const BlendTabs = config.blend_contracts

export const getTabFromString = getElementFromList(BlendTabs)

/** @type {React.FC} */
const LoginWindow = () => {
    const { showModal } = useUAL()
    return (
        <div className="flex justify-center">
            <button
                className="hover:text-black hover:bg-primary font-bold py-2 px-4 rounded border-2 border-primary transition-colors"
                onClick={showModal}
            >
                To use the Blend feature you need to login.
            </button>
        </div>
    )
}

/** @type {React.FC} */
export const Blends = (props) => {
    const [values, updateQuerystring] = useQuerystring()

    const ual = useUAL()
    const accountName = ual.activeUser?.accountName ?? null
    const activeTab = useMemo(() => getTabFromString(values.tab), [values.tab])

    return (
        <Page>
            <Content>
                <div className="container mx-auto">
                    {!ual.activeUser ? (
                        <LoginWindow />
                    ) : (
                        <Tabs
                            className={cn(
                                'border-tabs',
                                'flex h-12 my-10 rounded-md pl-4',
                                'text-sm lg:text-base text-neutral',
                                'border border-paper items-center',
                            )}
                            defaultActiveKey={activeTab}
                            onSelect={(newTab) => newTab && updateQuerystring({ tab: newTab }, true)}
                        >
                            <Tab
                                eventKey="blenderizerx"
                                title={<TabItem target={'blenderizerx'} tabKey={activeTab} title={'Blenderizer'} />}
                                unmountOnExit
                            >
                                <BlenderizerList user={accountName} {...props} />
                            </Tab>
                            <Tab
                                eventKey="nefty.blends"
                                title={<TabItem target={'nefty.blends'} tabKey={activeTab} title={'Nefty Blends'} />}
                                unmountOnExit
                            >
                                <NeftyBlendsList user={accountName} {...props} />
                            </Tab>
                        </Tabs>
                    )}
                </div>
            </Content>
        </Page>
    )
}

export default Blends
