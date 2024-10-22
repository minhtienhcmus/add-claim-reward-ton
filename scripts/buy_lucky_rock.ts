import { Address, toNano } from '@ton/core';
import { NetworkProvider, sleep } from '@ton/blueprint';
import { BuyCardContract } from '../wrappers/BuyCardContract';
import data from './result_round02.json';
export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const address = Address.parse(args.length > 0 ? args[0] : await ui.input('CampaignFactory address'));

    if (!(await provider.isContractDeployed(address))) {
        ui.write(`Error: Contract at address ${address} is not deployed!`);
        return;
    }

    const affPool = provider.open(BuyCardContract.createFromAddress(address));

    const hashInt = hashStringToInt(('0QDE0iKpkaZl5-ZpkluwHRNm9ffUnVN-EllkIm61zqoMX660'));
    // const entries: InfoEntry[] = []
    // data.forEach((item: any) => {
    //     const temp = {
    //         address : Address.parse(item.address.toString()),
    //         amount: BigInt(BigInt(Math.pow(10,6)) * BigInt(item.amount)),
    //         key: BigInt(hashStringToInt(item.address.toString()))
    //     }
    //     entries.push(temp);
    // });
    // const entries: InfoEntry[] = [
    //     {
    //         address: Address.parse('0QA_CD8I3WydIyX4iskOps4g9vd2RJceLzPsUYMZNUhFagD9'),
    //         amount: toNano('120'),
    //         key: BigInt(hashStringToInt("0QA_CD8I3WydIyX4iskOps4g9vd2RJceLzPsUYMZNUhFagD9"))
    //     },
    //     {
    //         address: Address.parse('0QBuKnv23FRVXI0faZjhKkhviaiTmx_Bu65POcTYILLLboVo'),
    //         amount: toNano('110'),
    //         key: BigInt(hashStringToInt('0QBuKnv23FRVXI0faZjhKkhviaiTmx_Bu65POcTYILLLboVo'))
    //     },
    // ];
    // console.log("====entries=====",entries)
    await affPool.sendBuyLuckyRock(provider.sender(), toNano('0.43'), {
        queryId: (Date.now()),
        key: BigInt(hashInt),
        numberPearl:BigInt(2)
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