import cn from 'classnames'
import React from 'react'
import config from '../../config.json'
import Page from '../common/layout/Page'
import Header from '../common/util/Header'

const Home = () => {
    return (
        <Page>
            <Header title={config.market_title} description={config.market_description} image={config.market_image} />
            <div className={cn('container mx-auto my-20')}>
                <h4>Page Content goes here</h4>
            </div>
        </Page>
    )
}

export default Home
