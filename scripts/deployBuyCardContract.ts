import { Address, toNano } from '@ton/core';
import { BuyCardContract } from '../wrappers/BuyCardContract';
import { compile, NetworkProvider } from '@ton/blueprint';
import { InfoEntry, InfoEntryBuyDic } from '../wrappers/ClaimReward';

export async function run(provider: NetworkProvider) {
    const entries: InfoEntryBuyDic = 
        {
            address: Address.parse('UQCQOurVXARJMr-nTDVS34MFxLVC9onE4YV9d0s8xTCfGLXn'),
            isBuy: BigInt('1'),
            key: BigInt(hashStringToInt('UQCQOurVXARJMr-nTDVS34MFxLVC9onE4YV9d0s8xTCfGLXn')),
            queryId: BigInt(Date.now())
        };
        console.log("entries",entries);
    const buyCardContract = provider.open(BuyCardContract.createFromConfig({
        owner_address:provider.sender().address as Address,
        monitor: Address.parse('UQA0uRu08Cac-erlTdmnk_siJcafywxMvPGYp2qIHwaDIzgM'),
        dict_box:entries,
        dict_save: entries,
        dict_auto_merge:  entries,
        dict_lucky:entries,
        // dict_buy_box:entries,
        price_box:toNano('0.3'),
        price_save:toNano('0.2'),
        price_auto_merge:toNano('0.3'),
        price_lucky:toNano('0.1'), 
        // price_buy_box:toNano('0.2')
    }, await compile('BuyCardContract')));

    await buyCardContract.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(buyCardContract.address);

    // run methods on `buyCardContract`
}
function hashStringToInt(str: string) {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = (hash * 33) ^ str.charCodeAt(i);
    }
    return hash >>> 0; // Ensure the hash is a positive integer
}