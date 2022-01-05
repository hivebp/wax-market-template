import React, {useEffect, useState} from 'react';
import cn from "classnames";
import WindowButton from './WindowButton';
import config from '../../config.json'

import {
    getValues
} from '../helpers/Helpers';

import LoadingIndicator from "../loadingindicator/LoadingIndicator";
import {getAssets, getDelphiMedian, getDropKeys, getProofOwn, getWhiteList} from "../api/Api";
import PrivateKey from "eosjs";

function BuyDropPopup(props) {
    const drop = props['drop'];
    const amount = props['amount'];

    const ual = props['ual'] ? props['ual'] : {'activeUser': null};
    const activeUser = ual['activeUser'];
    const callBack = props['callBack'];
    const closeCallBack = props['closeCallBack'];
    const userName = activeUser ? activeUser['accountName'] : null;
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingValidation, setIsLoadingValidation] = useState(false);
    const [quantity, setQuantity] = useState(null);
    const [delphiMedian, setDelphiMedian] = useState(0);
    const [requiredAssets, setRequiredAssets] = useState(null);
    const [whitelist, setWhitelist] = useState(null);
    const [publicKey, setPublicKey] = useState(null);

    const values = getValues();

    const key = values['key'];

    const { name, listingPrice } = drop;

    const parseUSDListingPrice = (median, amount, usd) => {
        if (median) {
            setQuantity( (amount * usd) / (median / 10000.0));
            setDelphiMedian(median);
        }
    };

    const compareResult = (result, amount, operator) => {
        if (result && result.data) {
            const lenResults = result.data.length;
            switch (operator) {
                case 0: return lenResults === amount;
                case 1: return lenResults !== amount;
                case 2: return lenResults > amount;
                case 3: return lenResults >= amount;
                case 4: return lenResults < amount;
                case 5: return lenResults <= amount;
                default: return false;
            }
        }

        return false;
    };

    const validateAssets = (assets, amount, comparison_operator) => {
        if (compareResult(assets, amount, comparison_operator)) {
            const assetIds = [];
            for (let i = 0; i < amount; ++i) {
                assetIds.push(assets.data[i].asset_id);
            }
            return assetIds;
        }

        return null;
    }

    const validateSchema = async (collection_name, schema_name, amount, comparison_operator) => {
        const assets = await getAssets(
            {'collections': [collection_name], 'schema': schema_name, 'limit': amount + 1, 'user': userName}
        );

        return validateAssets(assets, amount, comparison_operator);
    }

    const validateCollection = async (collection_name, amount, comparison_operator) => {
        const assets = await getAssets(
            {'collections': [collection_name], 'limit': amount + 1, 'user': userName}
        );

        return validateAssets(assets, amount, comparison_operator);
    }

    const validateByTemplate = async (collection_name, template_id, amount, comparison_operator) => {
        const assets = await getAssets(
            {'collections': [collection_name], 'template_id': template_id, 'limit': amount + 1, 'user': userName}
        );

        return validateAssets(assets, amount, comparison_operator);
    }

    const getValidation = async () => {
        setIsLoadingValidation(true);
        const wl = await getWhiteList(drop.dropId, userName);

        if (wl) {
            setWhitelist(wl);

            setIsLoadingValidation(false);
            return;
        }

        if (key) {
            const pk = await getDropKeys(drop.dropId);
            if (pk) {
                setPublicKey(pk);

                setIsLoadingValidation(false);
                return;
            }
        }

        const proofOwn = await getProofOwn(drop.dropId);

        let logical_operator = 0;
        if (proofOwn && proofOwn.group && proofOwn.group.logical_operator)
            logical_operator = proofOwn.group.logical_operator;

        const assetIds = [];

        if (proofOwn && proofOwn.group && proofOwn.group.filters) {
            let found = false;
            let foundCounter = 0;
            for (let i = 0; i < proofOwn.group.filters.length; ++i) {
                const filter = proofOwn.group.filters[i];
                if (filter.length >= 2 && (!found || logical_operator === 0)) {
                    const type = filter[0];
                    const data = filter[1];
                    let assets = null;
                    switch (type) {
                        case 'SCHEMA_HOLDINGS':
                            assets = await validateSchema(data['collection_name'], data['schema_name'], data['amount'], data['comparison_operator']);
                            break;
                        case 'COLLECTION_HOLDINGS':
                            assets = await validateCollection(data['collection_name'], data['amount'], data['comparison_operator']);
                            break;
                        case 'TEMPLATE_HOLDINGS':
                            assets = await validateByTemplate(data['collection_name'], data['template_id'], data['amount'], data['comparison_operator']);
                            break;
                    }

                    if (assets) {
                        found = true;
                        ++foundCounter;
                        assets.map(assetId => assetIds.push(assetId));
                    }
                }
            }

            if ((logical_operator === 0 && foundCounter === proofOwn.group.filters.length)
                || (logical_operator === 1 && foundCounter > 0)) {
                setRequiredAssets(assetIds);
            }
        }

        setIsLoadingValidation(false);
    };

    useEffect(() => {
        if (listingPrice.includes(' WAX')) {
            setQuantity(amount * parseFloat(listingPrice.replace(' WAX', '')));
        } else if (listingPrice.includes(' USD')) {
            getDelphiMedian().then(res => parseUSDListingPrice(
                res, amount, parseFloat(listingPrice.replace(' USD', ''))));
        }
        if (drop.authRequired) {
            getValidation();
        }
    }, []);

    const free = listingPrice === '0 NULL';

    const purchase = async () => {
        closeCallBack();
        setIsLoading(true);

        const actions = [];

        if (!free) {
            actions.push({
                account: drop.listingPrice.includes(' YOSHIBK') ? 'tokenizednft' : 'eosio.token',
                name: 'transfer',
                authorization: [{
                    actor: userName,
                    permission: activeUser['requestPermission'],
                }],
                data: {
                    from: userName,
                    to: config.drops_contract,
                    quantity: drop.listingPrice,
                    memo: 'deposit'
                },
            });
        }

        const data = {
            referrer: config.market_name,
            drop_id: drop.dropId,
            country: 'none',
            intended_delphi_median: delphiMedian ? delphiMedian : 0,
            amount: amount,
            claimer: userName,
            currency: free ? '0,NULL' : (drop.listingPrice.includes(' YOSHIBK') ? '4,YOSHIBK' : '8,WAX')
        };

        if (requiredAssets) {
            data['asset_ids'] = requiredAssets;
        }

        if (publicKey) {
            const signatureNonce = Math.floor(Math.random() * (2 ** 32));
            const dropPrivateKey = PrivateKey.fromString(key);
            const claimSignature = dropPrivateKey.sign(
                `${drop.dropId}-${userName}-${signatureNonce}`, true,
                'utf8',
            ).toString();

            data['authkey_key'] = dropPrivateKey.getPublicKey().toString();
            data['signature_nonce'] = signatureNonce;
            data['claim_signature'] = claimSignature;
        }

        actions.push({
            account: config.drops_contract,
            name: drop.authRequired ? (
                whitelist ? 'claimdropwl' : publicKey ? 'claimdropkey' : 'claimwproof'
            ) : 'claimdrop',
            authorization: [{
                actor: userName,
                permission: activeUser['requestPermission'],
            }],
            data: data
        });

        try {
            await activeUser.signTransaction({
                actions: actions
            }, {
                expireSeconds: 300, blocksBehind: 0,
            });

            callBack({'bought': true});
        } catch (e) {
            callBack({'bought': false, 'error': e.message});
        } finally {
            setIsLoading(false);
        }
    };

    const cancel = () => {
        callBack(false);
        closeCallBack();
    };

    const fullfilled = requiredAssets || key || whitelist;

    return (
        <div className={cn(
            'fixed top-40 left-popup',
            'w-full max-w-popup lg:max-w-popup-lg h-auto',
            'p-3 lg:p-8 m-0',
            'text-sm text-neutral font-light opacity-100',
            'bg-paper rounded-xl shadow-lg z-100',
            'backdrop-filter backdrop-blur-lg',
        )}>
            <img className="absolute z-50 cursor-pointer top-4 right-4 w-4 h-4" onClick={cancel} src="/close_btn.svg" alt="X" />
            <div className="text-3xl mt-4 lg:mt-0 text-center">{name}</div>
            <div className="text-lg text-center my-4">
                {free? `Do you want to claim this Drop for free?` : `Do you want to buy this Drop for ${drop.listingPrice}`}
            </div>
            {drop.authRequired ? <div className={'w-full m-auto text-center mb-5'}>
                <div className={'m-2'}>Authorization Required!</div>
                {isLoadingValidation ? <LoadingIndicator /> : <div className={cn(
                    'flex justify-evenly',
                    {'text-green-400': fullfilled},
                    {'text-red-400': !fullfilled}
                )}>
                    {fullfilled ? 'Fullfilled' : 'Not Fullfilled'}
                </div>}
            </div> : ''}
            <div className={cn(
                'relative m-auto h-20 lg:h-8',
                'flex justify-evenly flex-wrap lg:justify-end'
            )}>
                <WindowButton text="Cancel" onClick={cancel} className="text-neutral bg-paper border-neutral" />
                <WindowButton text={free ? "Claim" : "Purchase"} onClick={purchase} disabled={isLoadingValidation || (
                    drop.authRequired && !fullfilled
                ) ? 'disabled' : ''} />
            </div>
            {isLoading ? <div className="absolute t-0 w-full h-full backdrop-filter backdrop-blur-md">
                <LoadingIndicator text="Loading Transaction" />
            </div> : '' }
        </div>
    );
}

export default BuyDropPopup;