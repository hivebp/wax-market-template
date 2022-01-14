import cn from 'classnames'
import React, { useContext, useEffect, useState } from 'react'
import { post } from '../../api/fetch'
import { getCollectionHex } from '../../api/fetch_utils'
import config from '../../config.json'
import { getFilters, getValues } from '../helpers/Helpers'
import LoadingIndicator from '../loadingindicator/LoadingIndicator'
import { Context } from '../marketwrapper'
import Pagination from '../pagination/Pagination'
import BlendItem from './BlendItem'

function NeftyBlendsList(props) {
    const [state, dispatch] = useContext(Context)

    const [blends, setBlends] = useState([])
    const [page, setPage] = useState(1)
    const [isLoading, setIsLoading] = useState(false)

    const values = getValues()
    values['user'] = props['user']

    const initialized = state.collections !== null && state.collections !== undefined

    const getBlendsResult = (results) => {
        const blends = []

        results &&
            results.map((result) => {
                if (result && result.status === 200 && result.body && result.body.rows) {
                    result.body.rows.map((blend) => {
                        blends.push(blend)
                        return null
                    })
                }
                return null
            })

        setBlends(blends)
        setIsLoading(false)
    }

    const getBlends = async (filters) => {
        const promises = []

        filters.collections.map(async (collection) => {
            const collectionHex = getCollectionHex(collection)

            const body = {
                json: true,
                code: 'blend.nefty',
                scope: 'blend.nefty',
                table: 'blends',
                table_key: '',
                lower_bound: `0000000000000000${collectionHex}00000000000000000000000000000000`,
                upper_bound: `0000000000000000${collectionHex}ffffffffffffffffffffffffffffffff`,
                index_position: 2,
                key_type: 'sha256',
                limit: 200,
                reverse: false,
                show_payer: false,
            }

            const url = config.api_endpoint + '/v1/chain/get_table_rows'
            promises.push(post(url, body))
        })

        if (promises.length > 0) {
            Promise.all(promises).then((res) => getBlendsResult(res))
        }
    }

    const initBlends = (page) => {
        setIsLoading(true)
        getBlends(getFilters(values, state.collections))
    }

    useEffect(() => {
        if (initialized) {
            initBlends(page)
        }
    }, [page, initialized])

    return (
        <div className={cn('w-full grid grid-cols-8 gap-10')}>
            <div className={cn('col-span-8 sm:col-span-8')}>
                <Pagination items={blends && blends.data} page={page} setPage={setPage} />
                {isLoading ? (
                    <LoadingIndicator />
                ) : (
                    <div
                        className={cn(
                            'relative w-full mb-24',
                            'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4',
                        )}
                    >
                        {blends && blends.map((blend, index) => <BlendItem {...props} index={index} blend={blend} />)}
                    </div>
                )}
                {isLoading ? '' : <Pagination items={blends && blends.data} page={page} setPage={setPage} />}
            </div>
        </div>
    )
}

export default NeftyBlendsList
