import React, {Fragment, useEffect, useState} from 'react';
import { Menu, Transition } from '@headlessui/react'

import Link from '../common/util/input/Link';
import Logo from '../common/util/Logo';
import { useRouter } from 'next/router'
import {getRefundBalance, getWaxBalance} from "../api/Api";
import {formatNumber} from "../helpers/Helpers";
import cn from "classnames";

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

    const performLogout = () => {
        ual.logout();
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
            'fixed w-full h-60 sm:h-28',
            'bg-page shadow-sm border-b border-paper',
            'z-50'
        )}>
            <div className={cn(
                'relative container mx-auto',
                'flex flex-col md:flex-row justify-between items-center',
            )}>
                <Logo />
                <div className={cn(
                    'w-full flex-wrap md:w-auto flex flex-row justify-between gap-y-1 md:gap-x-4 items-center',
                    'uppercase font-bold text-base',
                )}>
                    <Link href={'/explorer'}>
                        <span className={cn(
                            'pb-px md:pb-2',
                            router.pathname.indexOf('/explorer') > -1 ? 'border-b-4 border-primary' : '',
                        )}>
                            Explorer
                        </span>
                    </Link>
                    <Link href={'/market'}>
                        <span className={cn(
                            'pb-px md:pb-2',
                            router.pathname.indexOf('/market') > -1 ? 'border-b-4 border-primary' : '',
                        )}>
                            Market
                        </span>
                    </Link>
                    <Link href={'/auctions'}>
                        <span className={cn(
                            'pb-px md:pb-2',
                            router.pathname.indexOf('/auctions') > -1 ? 'border-b-4 border-primary' : '',
                        )}>
                            Auctions
                        </span>
                    </Link>
                    <Link href={'/drops'}>
                        <span className={cn(
                            'pb-px md:pb-2',
                            router.pathname.indexOf('/drops') > -1 ? 'border-b-4 border-primary' : '',
                        )}>
                            Drops
                        </span>
                    </Link>
                    {isLoading ? <LoadingIndicator /> : userName ?
                        <div className="w-full md:w-auto flex justify-center items-center pb-4 md:pb-0">
                            <div className="text-primary">
                                <Menu as="div" className="relative inline-block text-left">
                                    <div>
                                        <Menu.Button
                                            className={cn(
                                                'flex flex-col items-center w-full px-2 py-1 text-sm font-medium text-white bg-paper rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75',
                                                'border border-primary rounded-lg',
                                                'border-opacity-0 hover:border-opacity-75',
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    'flex justify-center items-center',
                                                    'px-1 py-px text-base'
                                                )}>
                                                <p>{userName}</p>
                                                <img src="/arrow-drop-down.svg" className="w-5 h-5" alt="arrow-down" />
                                            </div>

                                            { balance &&
                                            <div className={cn(
                                                'font-light text-sm text-center'
                                            )}>
                                                {formatNumber(balance)} WAX
                                            </div>
                                            }
                                        </Menu.Button>
                                    </div>
                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items className={cn(
                                            'z-50 absolute right-0 w-36 mt-1 origin-top-right',
                                            'text-white',
                                            'bg-paper rounded-xl shadow-lg',
                                            'ring-1 ring-black ring-opacity-5 focus:outline-none'
                                        )}>
                                            <div className="py-4 text-center">
                                                <Menu.Item className={cn('mb-3')}>
                                                    <Link href={'/inventory/' + userName}>
                                                        <span className={cn(
                                                            'pb-px',
                                                            'cursor-pointer',
                                                            'hover:text-primary transition-colors',
                                                            router.pathname.indexOf('/inventory') > -1 ? 'border-b-2 border-primary' : '',
                                                        )}>
                                                            Inventory
                                                        </span>
                                                    </Link>
                                                </Menu.Item>
                                                <Menu.Item className={cn('m-auto')}>
                                                    <Link href={'/packs/' + userName}>
                                                        <span className={cn(
                                                            'pb-px',
                                                            'cursor-pointer',
                                                            'hover:text-primary transition-colors',
                                                            router.pathname.indexOf('/packs') > -1 ? 'border-b-2 border-primary' : '',
                                                        )}>
                                                            Packs
                                                        </span>
                                                    </Link>
                                                </Menu.Item>
                                                <Menu.Item className={cn('mb-3')}>
                                                    <Link href={'/bids/' + userName}>
                                                        <span className={cn(
                                                            'pb-px',
                                                            'cursor-pointer',
                                                            'hover:text-primary transition-colors',
                                                            router.pathname.indexOf('/bids') > -1 ? 'border-b-2 border-primary' : '',
                                                        )}>
                                                            Bids
                                                        </span>
                                                    </Link>
                                                </Menu.Item>
                                                <Menu.Item className={cn('mb-3')}>
                                                    <Link href={'/won/' + userName}>
                                                        <span className={cn(
                                                            'pb-px',
                                                            'cursor-pointer',
                                                            'hover:text-primary transition-colors',
                                                            router.pathname.indexOf('/won') > -1 ? 'border-b-2 border-primary' : '',
                                                        )}>
                                                            Won Auctions
                                                        </span>
                                                    </Link>
                                                </Menu.Item>
                                                <Menu.Item className={cn('mt-3')}>
                                                    <div onClick={performLogout}>
                                                        <span className={cn(
                                                            'cursor-pointer',
                                                            'hover:text-primary transition-colors',
                                                        )}>
                                                            Logout
                                                        </span>
                                                    </div>
                                                </Menu.Item>
                                            </div>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                                { refundBalance ?
                                    <div className={cn(
                                        'font-light text-sm text-center'
                                    )}>
                                        <div className={cn('cursor-pointer')} onClick={() => claimRefund(refundBalance)}>
                                            Refund: {formatNumber(refundBalance)} WAX
                                        </div>
                                    </div> : '' }
                            </div>
                        </div>
                        :
                        <div
                            className={cn(
                                'flex justify-center items-center',
                                'cursor-pointer',
                            )}
                            onClick={performLogin}
                        >
                            <div className="mr-1" >
                                <img src="/person-outline.svg" className="w-5 h-5" alt="Login" title={"Login"} />
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
