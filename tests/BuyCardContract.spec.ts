import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { BuyCardContract } from '../wrappers/BuyCardContract';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('BuyCardContract', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('BuyCardContract');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let buyCardContract: SandboxContract<BuyCardContract>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        buyCardContract = blockchain.openContract(BuyCardContract.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await buyCardContract.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: buyCardContract.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and buyCardContract are ready to use
    });
});
