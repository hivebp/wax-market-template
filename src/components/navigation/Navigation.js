import React, {useEffect, useState} from 'react';

import Link from '../common/util/input/Link';
import Logo from '../common/util/Logo';
import { useRouter } from 'next/router'
import {getRefundBalance, getWaxBalance, post} from "../api/Api";
import {formatNumber} from "../helpers/Helpers";
import cn from "classnames";

import config from "../../config.json";
import LoadingIndicator from "../loadingindicator/LoadingIndicator";

const Navigation = React.memo(props => {
    const router = useRouter()

    const ual = props['ual'] ? props['ual'] : {'activeUser': null};

    const [isLoading, setIsLoading] = useState(null);
    const [balance, setBalance] = useState(null);
    const [refundBalance, setRefundBalance] = useState(null);

    const activeUser = ual['activeUser'];
    const userName = activeUser ? activeUser['accountName'] : null;

    const performLogin = async () => {
        ual.showModal();
    };

    const parseWaxBalance = (res) => {
        if (res && res.status === 200) {
            let wax = 0;
            const data = res.data;

            if (data && Object.keys(data).includes('rows'))
                data['rows'].map(row => {
                    wax += parseFloat(row['balance'].replace(' WAX', ''))
                });

            setBalance(wax);
        }
    };

    const parseRefundBalance = (res) => {
        if (res && res.status === 200) {
            let atomic = 0;
            const data = res.data;

            if (data && Object.keys(data).includes('rows'))
                data['rows'].map(row => {
                    if (Object.keys(row).includes('quantities'))
                        row['quantities'].map(quantity => {
                            if (quantity.includes(' WAX')) {
                                atomic += parseFloat(quantity.replace(' WAX', ''))
                            }
                        });
                });

            setRefundBalance(atomic);
        }
    };

    const claimRefund = async (quantity) => {
        try {
            setIsLoading(true);
            await activeUser.signTransaction({
                actions: [
                    {
                        account: 'atomicmarket',
                        name: 'withdraw',
                        authorization: [{
                            actor: userName,
                            permission: activeUser['requestPermission'],
                        }],
                        data: {
                            owner: userName,
                            token_to_withdraw: `${quantity.toFixed(8)} WAX`
                        },
                    }]
            }, {

                expireSeconds: 300, blocksBehind: 0,
            });
        } catch (e) {
            console.log(e);
        } finally {
            setTimeout(function () {
                getWaxBalance(userName).then(res => parseWaxBalance(res))
                getRefundBalance(userName).then(res => parseRefundBalance(res));
                setIsLoading(false);
            }, 2000);
        }
    }

    useEffect(() => {
        getWaxBalance(userName).then(res => parseWaxBalance(res));
        getRefundBalance(userName).then(res => parseRefundBalance(res));
    }, [userName]);

    return (
        <div className={cn(
            'Navigation w-full',
            'bg-page shadow-sm border-b border-paper',
            'z-100'
        )}>
            <div className={cn(
                'h-auto h-20 w-full mx-auto px-4',
                'flex flex-col md:flex-row justify-between items-center',
            )}>
                 <Logo />
                <div className={cn(
                    'flex flex-nowrap items-center',
                    'uppercase font-bold text-sm md:text-base',
                )}>

                    <Link href={'/explorer'} className="ml-4 md:ml-7">
                        <span className={cn(
                            'pb-2',
                            router.pathname.indexOf('/explorer') > -1 ? 'border-b-4 border-primary' : '',
                        )}>
                            Explorer
                        </span>
                    </Link>
                    <Link href={'/market'} className="ml-4 md:ml-7">
                        <span className={cn(
                            'cursor-pointer pb-2',
                            router.pathname.indexOf('/market') > -1 ? 'border-b-4 border-primary' : '',
                        )}>
                            Market
                        </span>
                    </Link>
                    <Link href={'/auctions'} className="ml-4 md:ml-7">
                        <span className={cn(
                            'cursor-pointer pb-2',
                            router.pathname.indexOf('/auctions') > -1 ? 'border-b-4 border-primary' : '',
                        )}>
                            Auctions
                        </span>
                    </Link>
                    <Link href={'/drops'} className="ml-4 md:ml-7">
                        <span className={cn(
                            'cursor-pointer pb-2',
                            router.pathname.indexOf('/drops') > -1 ? 'border-b-4 border-primary' : '',
                        )}>
                            Drops
                        </span>
                    </Link>
                    {
                        userName ?
                            <Link href={'/inventory/' + userName} className="ml-4 md:ml-7">
                                <span className={cn(
                                    'cursor-pointer pb-2',
                                    router.pathname.indexOf('/inventory') > -1 ? 'border-b-4 border-primary' : '',
                                )}>
                                    Inventory
                                </span>
                            </Link> : ''
                    }
                    {
                        isLoading ? <LoadingIndicator /> : userName ?
                        <div className={cn(
                            'ml-4 md:ml-7'
                        )} onClick={performLogin}>
                            <div>{userName}</div>
                            { balance && 
                                <div className={cn(
                                    'font-light text-sm text-center'
                                )}>
                                    {formatNumber(balance)} WAX
                                </div>
                            }
                            { refundBalance ?
                            <div className={cn(
                                'font-light text-sm text-center'
                            )}>
                                <div className={cn('cursor-pointer')} onClick={() => claimRefund(refundBalance)}>
                                    Refund: {formatNumber(refundBalance)} WAX
                                </div>
                            </div> : '' }
                        </div> : <div className={cn(
                                'flex ml-7 cursor-pointer'
                            )} onClick={performLogin}>
                            <div className="Icon" >
                                <img src="/person-outline.svg" alt="Login" title={"Login"} />
                            </div>
                            <span className={cn(
                                'hover:underline cursor-pointer',
                            )}>
                                Login
                            </span>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
});

export default Navigation;
