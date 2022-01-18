import cn from 'classnames'
import qs from 'qs'
import React, { useEffect, useState } from 'react'
import { Tab, Tabs } from 'react-bootstrap'
import Page from '../common/layout/Page'
import { getValues, setQueryStringWithoutPageReload } from '../helpers/Helpers'
import TabItem from '../tabs/TabItem'
import MyPacksList from './MyPacksList'
import UnclaimedPacksList from './UnclaimedPacksList'

const Packs = (props) => {
    const values = getValues()

    const keys = ['mypacks', 'unclaimed']

    const [tabKey, setTabKey] = useState(
        typeof window !== 'undefined'
            ? values['tab'] && keys.includes(values['tab'])
                ? values['tab']
                : 'mypacks'
            : props.tab && keys.includes(props.tab)
            ? props.tab
            : 'mypacks',
    )

    const initTabs = async (key, initial = false) => {
        if (key !== tabKey || initial) {
            const query = values

            delete query['order_dir']
            delete query['search_type']
            delete query['order_by']
            query['tab'] = key
            delete query['offer_type']

            if (!initial) setQueryStringWithoutPageReload(qs.stringify(query))
            setTabKey(key)
        }
    }

    useEffect(() => {
        initTabs(tabKey, true)
    }, [tabKey])

    return (
        <Page>
            <div className="container mx-auto">
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
                    <Tab eventKey="mypacks" title={<TabItem target={'mypacks'} tabKey={tabKey} title={'My Packs'} />}>
                        {tabKey === 'mypacks' && <MyPacksList {...props} />}
                    </Tab>
                    <Tab
                        eventKey="unclaimed"
                        title={<TabItem target={'unclaimed'} tabKey={tabKey} title={'Unclaimed Packs'} />}
                    >
                        {tabKey === 'unclaimed' && <UnclaimedPacksList {...props} />}
                    </Tab>
                </Tabs>
            </div>
        </Page>
    )
}

export default Packs
