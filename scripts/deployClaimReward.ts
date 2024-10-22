import { Address, beginCell, Cell, toNano } from '@ton/core';
import { ClaimReward, generateEntriesDictionary, InfoEntry } from '../wrappers/ClaimReward';
import { compile, NetworkProvider } from '@ton/blueprint';
import { JettonMinter } from '../wrappers/JettonMinter';
export async function run(provider: NetworkProvider) {
    const entries: InfoEntry = 
        {
            address: Address.parse('0QDE0iKpkaZl5-ZpkluwHRNm9ffUnVN-EllkIm61zqoMX660'),
            amount: toNano('15'),
            key: BigInt(hashStringToInt('0QDE0iKpkaZl5-ZpkluwHRNm9ffUnVN-EllkIm61zqoMX660'))
        };
    // const jettonMinterAddress = Address.parse('EQDqVwsEjdVoWlBitqpSENKx-IEz6SwHlM9xiDsmHB3tj-11'); // XG testnest
    const jettonMinterAddress = Address.parse('EQBLpngRyPYjRpdy89FLkee0TjrBMXmXYdw8p8En713S4XsL'); // XG testnest
    // mainnet usdt EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs
    // const jettonMinterAddress = Address.parse('EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs');
    const jettonMinter = provider.open(JettonMinter.createFromAddress(jettonMinterAddress));
    const claimReward = provider.open(ClaimReward.createFromConfig({
        jetton_usdt:provider.sender().address as Address,
        owner_address:provider.sender().address as Address,
        monitor:provider.sender().address as Address,
        entries:entries,
        total_add: 0,
        budget:  100
    }, await compile('ClaimReward')));
    // await jettonMinter.getWalletAddressOf(claimReward.address)
    await claimReward.sendDeploy(provider.sender(), toNano('0.05'),{jettonWallet: await jettonMinter.getWalletAddressOf(claimReward.address), queryId:Date.now()});
    await provider.waitForDeploy(claimReward.address);

    // run methods on `claimReward`
}
function hashStringToInt(str: string) {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = (hash * 33) ^ str.charCodeAt(i);
    }
    return hash >>> 0; // Ensure the hash is a positive integer
}