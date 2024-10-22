import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { ClaimReward } from '../wrappers/ClaimReward';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('ClaimReward', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('ClaimReward');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let claimReward: SandboxContract<ClaimReward>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        claimReward = blockchain.openContract(ClaimReward.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await claimReward.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: claimReward.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and claimReward are ready to use
    });
});
