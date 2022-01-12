import cn from 'classnames'
import React, { useContext, useEffect, useState } from 'react'
import { post } from '../../api/fetch'
import config from '../../config.json'
import { getFilters, getValues } from '../helpers/Helpers'
import LoadingIndicator from '../loadingindicator/LoadingIndicator'
import { Context } from '../marketwrapper'
import Pagination from '../pagination/Pagination'
import BlenderizerItem from './BlenderizerItem'

function BlenderizerList(props) {
    const [state, dispatch] = useContext(Context)

    const [blends, setBlends] = useState([])
    const [page, setPage] = useState(1)
    const [isLoading, setIsLoading] = useState(false)

    const values = getValues()
    values['user'] = props['user']

    const initialized = state.collections !== null && state.collections !== undefined

    const getBlends = async () => {
        const blends = []

        let nextKey = '0'

        while (nextKey) {
            const body = {
                json: true,
                code: 'blenderizerx',
                scope: 'blenderizerx',
                table: 'blenders',
                table_key: '',
                lower_bound: nextKey,
                upper_bound: '',
                index_position: 1,
                key_type: '',
                limit: 2000,
                reverse: false,
                show_payer: false,
            }

            const url = config.api_endpoint + '/v1/chain/get_table_rows'
            const res = await post(url, body)
            nextKey = res.body && res.body.next_key

            res.body.rows.map((row) => {
                if (state.collections.includes(row.collection)) {
                    blends.push(row)
                }
            })
        }

        setBlends(blends)
        setIsLoading(false)
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
                        {blends &&
                            blends.map((blend, index) => <BlenderizerItem {...props} index={index} blend={blend} />)}
                    </div>
                )}
                {isLoading ? '' : <Pagination items={blends && blends.data} page={page} setPage={setPage} />}
            </div>
        </div>
    )
}

export default BlenderizerList
