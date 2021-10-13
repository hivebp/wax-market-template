import cn from "classnames";
import Link from '../common/util/input/Link';
import React, {useContext, useEffect, useState} from "react";
import moment from "moment";
import {Context} from "../marketwrapper";
import LoadingIndicator from "../loadingindicator/LoadingIndicator";
import Input from '../common/util/input/Input';
import Button from '../common/util/input/Button'

const DropButtons = (props) => {
    const drop = props['drop'];
    const preview = props['preview'];
    const handleBought = props['handleBought'];
    const setIsLoading = props['setIsLoading'];
    const setError = props['setError'];
    const error = props['error'];
    const isLoading = props['isLoading'];

    const [dropInterval, setDropInterval] = useState(null);
    const [dropTimeLeft, setDropTimeLeft] = useState('');
    const [dropReady, setDropReady] = useState(false);
    const [dropEnded, setDropEnded] = useState(false);
    const [soldOut, setSoldOut] = useState(false);
    const [claimAmount, setClaimAmount] = useState(1);

    const [state, dispatch] = useContext(Context);

    const claim = () => {
        if (claimAmount) {
            setIsLoading(true);
            dispatch({type: 'SET_ASSET', payload: drop});
            dispatch({type: 'SET_AMOUNT', payload: claimAmount});
            dispatch({type: 'SET_CALLBACK', payload: (bought) => handleBought(bought)});
            dispatch({type: 'SET_ACTION', payload: 'buy_drop'});
            dispatch({ type: 'SET_TRIGGERED', payload: true });
        }
    };

    const changeAmount = (e) => {
        const val = e.target.value;
        if (/^\d*$/.test(val)) {
            let maxAmount = val ? parseInt(val) : '';
            if (!maxAmount) {
                setClaimAmount('');
            } else if (drop.accountLimit && drop.accountLimit < maxAmount) {
                setClaimAmount(drop.accountLimit);
            } else if (drop.maxClaimable && drop.maxClaimable - drop.currentClaimed < maxAmount) {
                setClaimAmount(drop.maxClaimable - drop.currentClaimed);
            } else {
                setClaimAmount(maxAmount);
            }
        }
    };

    const disMissError = () => {
        setError(null);
    };

    useEffect(() => {
        const currentTime = moment();

        if (drop.maxClaimable > 0 && drop.currentClaimed === drop.maxClaimable) {
            setSoldOut(true);
            return;
        }

        if (drop.endTime && currentTime.unix() > drop.endTime) {
            setDropEnded(true);
            return;
        }

        const diffTime = drop.startTime - currentTime.unix();

        if (diffTime > 0) {
            if (dropInterval) {
                clearInterval(dropInterval);
            }

            let duration = moment.duration(diffTime * 1000, 'milliseconds');
            const interval = 1000;

            setDropInterval(setInterval(function() {
                duration = moment.duration(duration - interval, 'milliseconds');

                if (dropInterval) {
                    clearInterval(dropInterval);
                }

                if (duration.asSeconds() < 0)
                    setDropTimeLeft(null);
                else
                    setDropTimeLeft(`${duration.days()}d ${duration.hours()}h ${
                        duration.minutes()}m ${duration.seconds()}s`);
            }, interval));
        } else {
            setDropReady(true);
        }
    }, [dropReady === false]);

    return <div>
        <div className="relative">
            <p className={cn(
                'w-full pt-4 px-2 mb-5',
                'text-center text-base font-light text-neutral',
                'overflow-visible',
            )}>
                {!drop.listingPrice || drop.listingPrice === '0 NULL' ? 'Free' : drop.listingPrice}
            </p>
        </div>
        <div className="relative">
            <p className={cn(
                'w-full pt-4 px-2 mb-5',
                'text-center text-base font-light text-neutral',
                'overflow-visible',
            )}>
                Account Limit: {drop.accountLimit}
            </p>
        </div>
        {!isLoading && (error) ? <div className={cn(
            'absolute bg-red-800 rounded p-4 mx-auto leading-5 flex justify-center',
            'text-center font-medium text-xs z-30',
            'border border-solid border-red-800 rounded outline-none',
            'error-note-size',
        )} onClick={disMissError}>{error}</div> : ''}
        {dropTimeLeft && !dropReady && <div
            className={cn('text-center')}
        >
            Starts In: {dropTimeLeft}
        </div> }
        {dropReady && !dropEnded && <div
            className={cn('text-center cursor-pointer')}
        >
            {preview ? <Link href={`/drop/${drop.dropId}`}><div>Drop Live</div></Link> :
                isLoading ? <LoadingIndicator />
                    : <div className={cn(
                        'relative w-1/2 m-auto px-4 h-auto',
                        'flex flex-wrap lg:justify-center'
                    )}>
                        <Input
                            type="text"
                            className="w-full bg-gray-700"
                            placeholder="Amount"
                            onChange={changeAmount}
                            value={claimAmount ? claimAmount : ''}
                        />
                        <Button
                            className={cn(
                                'bg-primary py-1 px-8 text-secondary mt-3 mb-3 mx-auto',
                                'cursor-pointer text-sm font-bold leading-relaxed uppercase',
                                'rounded-3xl outline-none',
                            )}
                            onClick={claim}>
                            Claim
                        </Button>
                    </div>}
        </div> }
        {dropEnded && <div
            className={cn('text-center')}
        >
            <div>Drop Ended</div>
        </div> }
        {soldOut && <div
            className={cn('text-center')}
        >
            <div>Sold Out</div>
        </div> }
    </div>
};

export default DropButtons;