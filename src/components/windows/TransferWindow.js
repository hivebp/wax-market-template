import cn from 'classnames'
import React, { useState } from 'react'
import config from '../../config.json'
import ErrorMessage from '../common/util/ErrorMessage'
import Input from '../common/util/input/Input'
import LoadingIndicator from '../loadingindicator/LoadingIndicator'
import { transferAction } from '../wax/Wax'
import WindowButton from './WindowButton'
import WindowContent from './WindowContent'

function TransferWindow(props) {
    const asset = props['asset']

    const { collection, schema, name, data } = asset

    const image = data['img'] ? (data['img'].includes('http') ? data['img'] : config.ipfs + data['img']) : ''

    const video = data['video'] ? (data['video'].includes('http') ? data['video'] : config.ipfs + data['video']) : ''

    const ual = props['ual'] ? props['ual'] : { activeUser: null }
    const activeUser = ual['activeUser']

    const callBack = props['callBack']
    const [receiver, setReceiver] = useState('')
    const [memo, setMemo] = useState('')

    const userName = activeUser ? activeUser['accountName'] : null
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState()
    const closeCallBack = props['closeCallBack']

    const transfer = async () => {
        if (!receiver) return
        closeCallBack()
        setIsLoading(true)

        try {
            await transferAction(asset.asset_id, memo, receiver, activeUser)
            callBack({ transferred: true, receiver: receiver })
        } catch (e) {
            callBack({ transferred: false, error: e.message })
            console.log(e)
            setError(e.message)
        } finally {
            setIsLoading(false)
        }
    }

    const cancel = () => {
        callBack({ transferred: false, receiver: null, offer: 0 })
        closeCallBack()
    }

    const changeReceiver = (e) => {
        const val = e.target.value
        setReceiver(val.trim().toLowerCase())
    }

    const changeMemo = (e) => {
        const val = e.target.value
        setMemo(val)
    }

    return (
        <div
            className={cn(
                'fixed top-1/2 transform -translate-y-1/2',
                'left-1/2 transform -translate-x-1/2',
                'w-11/12 max-w-popup lg:max-w-popup-lg h-auto',
                'max-h-popup md:max-h-popup-lg',
                'p-3 lg:p-8 m-0 overflow-y-auto',
                'text-sm text-neutral font-light opacity-100',
                'bg-paper rounded-xl shadow-lg z-40',
                'backdrop-filter backdrop-blur-lg',
            )}
        >
            <img
                className="absolute z-50 cursor-pointer top-4 right-4 w-4 h-4"
                onClick={cancel}
                src="/close_btn.svg"
                alt="X"
            />
            <div className="text-xl sm:text-2xl md:text-3xl mt-4 lg:mt-0 text-center">{name}</div>
            <WindowContent image={image} video={video} collection={collection['name']} schema={schema['schema_name']} />
            <div className="text-base sm:text-lg text-center my-0 md:my-4">
                {`Are you sure you want to transfer ${name} to ${receiver}?`}
            </div>
            {error ? <ErrorMessage error={error} /> : ''}
            <div className={cn('relative m-auto lg:mb-10 py-1', 'flex flex-row items-center justify-evenly')}>
                <div className={cn('flex flex-row', 'items-center')}>
                    <Input
                        type="text"
                        className="w-11/12 bg-gray-700"
                        placeholder="Receiver"
                        onChange={changeReceiver}
                        value={receiver ? receiver : ''}
                    />
                </div>
                <div className={cn('flex flex-row', 'items-center')}>
                    <Input
                        type="text"
                        className="w-11/12 bg-gray-700"
                        placeholder="Memo"
                        onChange={changeMemo}
                        value={memo ? memo : ''}
                    />
                </div>
            </div>
            <div className={cn('relative m-auto mt-5 h-20 lg:h-8', 'flex justify-evenly lg:justify-end')}>
                <WindowButton text="Cancel" onClick={cancel} className="text-neutral bg-paper border-neutral" />
                <WindowButton text="Transfer" onClick={transfer} disabled={!receiver} />
            </div>

            {isLoading ? (
                <div className="absolute t-0 w-full h-full backdrop-filter backdrop-blur-md">
                    <LoadingIndicator text="Loading Transaction" />
                </div>
            ) : (
                ''
            )}
        </div>
    )
}

export default TransferWindow
