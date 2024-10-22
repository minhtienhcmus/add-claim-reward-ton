import { Address, beginCell, BitBuilder, Cell, Contract, contractAddress, ContractProvider, Dictionary, Sender, SendMode, Slice, TupleBuilder } from '@ton/core';
import { InfoEntry, InfoEntryBuyDic,InfoEntryBuyDicNotKey, infoEntryBuyDic, InfoEntryDic } from './ClaimReward';

export type BuyCardContractConfig = {
    owner_address: Address,
    monitor: Address,
    dict_box: InfoEntryBuyDic;
    dict_save: InfoEntryBuyDic;
    dict_auto_merge: InfoEntryBuyDic;
    dict_lucky: InfoEntryBuyDic;
    // dict_buy_box: InfoEntryBuyDic;
    price_box: bigint,
    price_save: bigint
    price_auto_merge: bigint
    price_lucky: bigint
    // price_buy_box: bigint
};

export function buyCardContractConfigToCell(config: BuyCardContractConfig): Cell {
    let dict_box: Dictionary<bigint, InfoEntryBuyDicNotKey> = Dictionary.empty(Dictionary.Keys.BigUint(256), infoEntryBuyDic);
    // const dictCell = beginCell().storeDict(null).endCell();
    dict_box.set(config.dict_box.key, config.dict_box);
    let dict_save: Dictionary<bigint, InfoEntryBuyDicNotKey> = Dictionary.empty(Dictionary.Keys.BigUint(256), infoEntryBuyDic);
    // const dictCell = beginCell().storeDict(null).endCell();
    dict_save.set(config.dict_save.key, config.dict_save);

    let dict_auto_merge: Dictionary<bigint, InfoEntryBuyDicNotKey> = Dictionary.empty(Dictionary.Keys.BigUint(256), infoEntryBuyDic);
    // const dictCell = beginCell().storeDict(null).endCell();
    dict_auto_merge.set(config.dict_auto_merge.key, config.dict_auto_merge);

    let dict_lucky: Dictionary<bigint, InfoEntryBuyDicNotKey> = Dictionary.empty(Dictionary.Keys.BigUint(256), infoEntryBuyDic);
    // const dictCell = beginCell().storeDict(null).endCell();
    dict_lucky.set(config.dict_lucky.key, config.dict_lucky);
    // let dict_buy_box: Dictionary<bigint, InfoEntryBuyDicNotKey> = Dictionary.empty(Dictionary.Keys.BigUint(256), infoEntryBuyDic);
    // // const dictCell = beginCell().storeDict(null).endCell();
    // dict_buy_box.set(config.dict_lucky.key, config.dict_buy_box);
    return beginCell().storeAddress(config.owner_address).storeAddress(config.monitor).storeDict(dict_box).storeDict(dict_save).storeDict(dict_auto_merge).storeDict(dict_lucky).storeUint(config.price_box, 64).storeUint(config.price_save, 64).storeUint(config.price_auto_merge, 64).storeUint(config.price_lucky, 64).endCell();
}

export class BuyCardContract implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) { }

    static createFromAddress(address: Address) {
        return new BuyCardContract(address);
    }

    static createFromConfig(config: BuyCardContractConfig, code: Cell, workchain = 0) {
        const data = buyCardContractConfigToCell(config);
        const init = { code, data };
        return new BuyCardContract(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
    async sendChangeOwner(
        provider: ContractProvider,
        via: Sender,
        opts: {
            newOwner: Address;
            value: bigint;
            queryId: number;
        }
    ) {
        // const nftContent = beginCell();
        // nftContent.storeBuffer(Buffer.from(opts.itemContent));

        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x21746f75, 32)
                .storeUint(opts.queryId, 64)
                .storeAddress(opts.newOwner)
                .endCell(),
        });
    }

    async sendChangeMonitor(
        provider: ContractProvider,
        via: Sender,
        opts: {
            newOwner: Address;
            value: bigint;
            queryId: number;
        }
    ) {
        // const nftContent = beginCell();
        // nftContent.storeBuffer(Buffer.from(opts.itemContent));

        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0xa81f6ff3, 32)
                .storeUint(opts.queryId, 64)
                .storeAddress(opts.newOwner)
                .endCell(),
        });
    }
    
    async sendClaimAllTonAdmin(
        provider: ContractProvider,
        via: Sender,
        opts: {
            // amount: bigint;
            value: bigint;
            queryId: number;
        }
    ) {
        // const nftContent = beginCell();
        // nftContent.storeBuffer(Buffer.from(opts.itemContent));

        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x4b237971, 32)
                .storeUint(opts.queryId, 64)
                // .storeUint(opts.amount,64)
                .endCell(),
        });
    }
    async sendClaimTonAdmin(
        provider: ContractProvider,
        via: Sender,
        opts: {
            amount: bigint;
            value: bigint;
            queryId: number;
        }
    ) {
        // const nftContent = beginCell();
        // nftContent.storeBuffer(Buffer.from(opts.itemContent));

        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x4b237979, 32)
                .storeUint(opts.queryId, 64)
                .storeUint(opts.amount,64)
                .endCell(),
        });
    }
    async getDictBox(provider: ContractProvider, key: bigint): Promise<[Slice]> {
        let builder = new TupleBuilder();
        console.log("key", key)
        builder.writeNumber(key)
        const result = await provider.get('get_dict_box', builder.build());
        return [this.readDataFromCellKey(result.stack.readCell())];
    }
    async getBuySavePearl(provider: ContractProvider, key: bigint): Promise<[Slice]> {
        let builder = new TupleBuilder();
        console.log("key", key)
        builder.writeNumber(key)
        const result = await provider.get('get_dict_save', builder.build());
        return [this.readDataFromCellKey(result.stack.readCell())];
    }
    async getBuyAutoMerge(provider: ContractProvider, key: bigint): Promise<[Slice]> {
        let builder = new TupleBuilder();
        console.log("key", key)
        builder.writeNumber(key)
        const result = await provider.get('get_dict_auto_merge', builder.build());
        return [this.readDataFromCellKey(result.stack.readCell())];
    }
    async getBuyLuckyRock(provider: ContractProvider, key: bigint): Promise<[Slice]> {
        let builder = new TupleBuilder();
        console.log("key", key)
        builder.writeNumber(key)
        const result = await provider.get('get_dict_lucky', builder.build());
        return [this.readDataFromCellKey(result.stack.readCell())];
    }
    async sendBuyBox(
        provider: ContractProvider,
        via: Sender,
        value: bigint,
        opts: {
            queryId: number;
            key: bigint;
            // value: Slice;
            // validUntil: bigint;
            // owner_address:  Address;
            // amount: bigint;
            // entries: InfoEntry[];
        }
    ) {
        // const dict = generateEntriesDictionary(opts.entries);
        // const dictCell = beginCell().storeDict(dict).endCell();
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x4df6b22f, 32)
                .storeUint(opts.queryId, 64)
                .storeUint(opts.key, 64)
                // .storeUint(opts.key, 256)
                // .storeUint(opts.validUntil, 64)
                // .storeRef(dictCell)
                .endCell(),
        });
    }
    async sendBuySavePearl(
        provider: ContractProvider,
        via: Sender,
        value: bigint,
        opts: {
            queryId: number;
            key: bigint;
            numberPearl:bigint;
            // value: Slice;
            // validUntil: bigint;
            // owner_address:  Address;
            // amount: bigint;
            // entries: InfoEntry[];
        }
    ) {
        // const dict = generateEntriesDictionary(opts.entries);
        // const dictCell = beginCell().storeDict(dict).endCell();
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x4df6b21f, 32)
                .storeUint(opts.queryId, 64)
                .storeUint(opts.key, 64)
                .storeUint(opts.numberPearl, 64)
                // .storeUint(opts.key, 256)
                // .storeUint(opts.validUntil, 64)
                // .storeRef(dictCell)
                .endCell(),
        });
    }
    async sendBuyAutoMerge(
        provider: ContractProvider,
        via: Sender,
        value: bigint,
        opts: {
            queryId: number;
            key: bigint;
            // numberPearl:bigint;
            // value: Slice;
            // validUntil: bigint;
            // owner_address:  Address;
            // amount: bigint;
            // entries: InfoEntry[];
        }
    ) {
        // const dict = generateEntriesDictionary(opts.entries);
        // const dictCell = beginCell().storeDict(dict).endCell();
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x4df6b11f, 32)
                .storeUint(opts.queryId, 64)
                .storeUint(opts.key, 64)
                // .storeUint(opts.numberPearl, 64)
                // .storeUint(opts.key, 256)
                // .storeUint(opts.validUntil, 64)
                // .storeRef(dictCell)
                .endCell(),
        });
    }
    async sendBuyLuckyRock(
        provider: ContractProvider,
        via: Sender,
        value: bigint,
        opts: {
            queryId: number;
            key: bigint;
            numberPearl:bigint;
            // value: Slice;
            // validUntil: bigint;
            // owner_address:  Address;
            // amount: bigint;
            // entries: InfoEntry[];
        }
    ) {
        // const dict = generateEntriesDictionary(opts.entries);
        // const dictCell = beginCell().storeDict(dict).endCell();
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x4df6b10f, 32)
                .storeUint(opts.queryId, 64)
                .storeUint(opts.key, 64)
                .storeUint(opts.numberPearl, 64)
                // .storeUint(opts.key, 256)
                // .storeUint(opts.validUntil, 64)
                // .storeRef(dictCell)
                .endCell(),
        });
    }
    async sendPriceLuckyGems(
        provider: ContractProvider,
        via: Sender,
        value: bigint,
        opts: {
            queryId: number;
            new_price: bigint;
            // value: Slice;
            // validUntil: bigint;
            // owner_address:  Address;
            // amount: bigint;
            // entries: InfoEntry[];
        }
    ) {
        // const dict = generateEntriesDictionary(opts.entries);
        // const dictCell = beginCell().storeDict(dict).endCell();
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x4df6c40f, 32)
                .storeUint(opts.queryId, 64)
                .storeUint(opts.new_price, 64)
                // .storeUint(opts.key, 256)
                // .storeUint(opts.validUntil, 64)
                // .storeRef(dictCell)
                .endCell(),
        });
    }
    async getAddressUserMonitor(provider: ContractProvider) {
        const result = await provider.get('get_address_monitor', []);
        return result.stack.readAddress();
    }
    async getAddressUserOwner(provider: ContractProvider) {
        const result = await provider.get('get_address_owner', []);
        return result.stack.readAddress();
    }

    readDataFromCellKey(cell: Cell): any {
        // Convert the cell into a slice for reading
        const slice = cell.beginParse();

        // Read the first integer (42) with 32 bits
        const itemOwnerAddress = slice.loadAddress();
        // console.log(`itemOwnerAddress value: ${itemOwnerAddress}`);

        // Read the second integer (256) with 16 bits
        const isBuy = slice.loadUint(64);
        const queryId = slice.loadUint(64);

        // console.log(`jetton_wallet_aff value: ${type_campaign}`);
        return { itemOwnerAddress, isBuy,queryId };
    }
}
