import { Address, toNano } from '@ton/core';
import { NetworkProvider, sleep } from '@ton/blueprint';
import { ClaimReward } from '../wrappers/ClaimReward';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const address = Address.parse(args.length > 0 ? args[0] : await ui.input('affPool address'));

    if (!(await provider.isContractDeployed(address))) {
        ui.write(`Error: Contract at address ${address} is not deployed!`);
        return;
    }

    const affPool = provider.open(ClaimReward.createFromAddress(address));

    const hashInt = hashStringToInt("0QBuKnv23FRVXI0faZjhKkhviaiTmx_Bu65POcTYILLLboVo");
    console.log("address",(provider.sender().address as Address).toString());
    console.log("hashInt",hashInt)

    await affPool.sendClaimReward(provider.sender(), toNano('0.09'), {
        // amount: toNano(300),
        key: BigInt(hashInt),
        // owner_address: Address.parse('0QBuKnv23FRVXI0faZjhKkhviaiTmx_Bu65POcTYILLLboVo'),
        queryId: Date.now()
    });

    ui.write('Waiting for affPool to increase...');

    // let counterAfter = await couter.getCounter();
    // let attempt = 1;
    // while (counterAfter === counterBefore) {
    //     ui.setActionPrompt(`Attempt ${attempt}`);
    //     await sleep(2000);
    //     counterAfter = await couter.getCounter();
    //     attempt++;
    // }

    ui.clearActionPrompt();
    ui.write('Counter affPool successfully!');
}
function hashStringToInt(str: string) {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = (hash * 33) ^ str.charCodeAt(i);
    }
    return hash >>> 0; // Ensure the hash is a positive integer
}