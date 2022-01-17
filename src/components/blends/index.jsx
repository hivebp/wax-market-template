import cn from 'classnames'
import { useRouter } from 'next/router'
import qs from 'qs'
import React, { useEffect, useState } from 'react'
import { Tab, Tabs } from 'react-bootstrap'
import config from '../../config.json'
import { useUAL } from '../../hooks/ual'
import Content from '../common/layout/Content'
import Page from '../common/layout/Page'
import { getValues } from '../helpers/Helpers'
import TabItem from '../tabitem/TabItem'
import BlenderizerList from './BlenderizerList'
import NeftyBlendsList from './NeftyBlendsList'

const Blends = (props) => {
    const values = getValues()

    const keys = config.blend_contracts
    const ual = useUAL()

    const activeUser = ual['activeUser'] && ual['activeUser']['accountName']
    const loggedOut = activeUser === null

    const [tabKey, setTabKey] = useState(
        typeof window === 'undefined'
            ? values['tab'] && keys.includes(values['tab'])
                ? values['tab']
                : 'nefty.blends'
            : props.tab && keys.includes(props.tab)
            ? props.tab
            : 'nefty.blends',
    )

    const router = useRouter()

    const pushQueryString = (qsValue) => {
        const newPath = window.location.pathname + '?' + qsValue

        router.push(newPath, undefined, { shallow: true })
    }

    const initTabs = async (key, user, loggedOut, initial = false) => {
        if (key !== tabKey || initial) {
            const query = values

            query['tab'] = key
            if (user) query['user'] = user
            else delete query['user']

            if (!initial) pushQueryString(qs.stringify(query))
            setTabKey(key)
        }
    }

    useEffect(() => {
        initTabs(tabKey, activeUser, loggedOut, true)
    }, [tabKey, activeUser, loggedOut])

    const login = () => {
        ual.showModal()
    }

    return (
        <Page>
            <Content headline="Blends">
                <div className="container mx-auto">
                    {loggedOut ? (
                        <div onClick={login}>Login</div>
                    ) : keys.length > 1 ? (
                        <Tabs
                            className={cn(
                                'border-tabs',
                                'flex h-12 my-10 rounded-md',
                                'text-sm lg:text-base text-neutral',
                                'border border-paper',
                            )}
                            defaultActiveKey={tabKey}
                            id="collection-switch"
                            onSelect={(k) => initTabs(k)}
                        >
                            <Tab
                                eventKey="nefty.blends"
                                title={
                                    <TabItem
                                        user={activeUser}
                                        target={'nefty.blends'}
                                        tabKey={tabKey}
                                        title={'Nefty Blends'}
                                    />
                                }
                            >
                                {tabKey === 'nefty.blends' && <NeftyBlendsList user={activeUser} {...props} />}
                            </Tab>
                            <Tab
                                eventKey="blenderizer"
                                title={<TabItem target={'blenderizer'} tabKey={tabKey} title={'Blenderizer'} />}
                            >
                                {tabKey === 'blenderizer' && <BlenderizerList user={activeUser} {...props} />}
                            </Tab>
                        </Tabs>
                    ) : keys.includes('blenderizerx') ? (
                        <BlenderizerList user={activeUser} {...props} />
                    ) : (
                        <NeftyBlendsList user={activeUser} {...props} />
                    )}
                </div>
            </Content>
        </Page>
    )
}

export default Blends
