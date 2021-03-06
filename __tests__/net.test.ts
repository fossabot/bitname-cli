import { fundTx, getAllTX, getFeesSatoshiPerKB, getBlockHeight, getTX, postTX } from '../lib/net';

import ElectrumClient from 'electrum-client';

import { address as Address, tx as TX } from 'bcoin';

describe('network data', () => {
    const expectedTxids = [
        '4725685d4df950f189fc2e0d7d13b9b96747da91468df0fec077530250323e7a',
        'b058c0370a2dee52aae63af664804607095b8b61de9a1f836fccbf7cd21b1e00',
        'd9b495951954e29aa4f07dacdeef7f858d1f5e0099009ac159496375c427c99e',
        '77c650e4e3e01f43360cc1ea1d0ec4ebaa0842cfd9b976424e15d2e3714ce15e',
        '794f212860b0b2f269ace5d32f839d6abfe5b29d62e4570549dd026d1de447e9',
        '095ee2d0a82a9e93a11e946616f3ad503aa3caf26d2259da31daa977cf2529c5',
        '90a74125bbb0381d0128555ab3ac31f60765248a98f64f178202416c3c41ec1e',
        '9464e553907a85188e28e0ace9bfa10e61a9c5b8aa4be826770e6ce47e92fe62',
        '5da1536a879111d2586da4635388dff162cc45290ac386882c2c854b6719442a',
        'd2aa97120ac2456472b6b10109a89242eddbf0a69387dd7910a328a9ad04eeb0',
        '50c68982ee137036f991182ece20d0ac303a073a267a9fdba3cb6c84863e6302',
        '179afc4997aaa848a88b937c446c5fb81edb0561cdffb6df463b1b7c61068c83',
        '793e5ba7f78a6e6d7bf67541491ecc892ec6459dfbf8899a54afd4001a149f4c',
        '71b3b03377833485ac10250ac6e84dac6386c76e800c4cac4dbdfc320d2f1fbe',
        'a672fbd0ed39db91e22c839099c4bf54a237469ff617dc982cf77c806d037c7a',
        'e6c12999afcf9944175151506854cfc626a696b46fd0174c9ff35f4daf46f271',
        'd593b2a55eac720c9e9650bd84361269a865f9bcafa8d4f269d14c36ad9de558',
        'e69a49b57a1f57eed4216fcd929e59207d6ca25c0f548208ad796ebf2c76815f',
        'b2aa8a0daa851f13bb7ffc6c411562161347b8f641ca7ec7576f018ef8858f17',
        '07c66041e70cfed5cafcaf956ea506b57f30282e82c26ea420d2d626b4c65e08',
        'cf6d723d743b2247145e9591daa517938b1ade44c3a5a5b81135e999ffac2c33',
        '30b60d2984c8b86ec5485932f84a15a9a08867db356271187394b41d9d3e1410',
        'afb7c2ca61ccbb302033ef2605f3ae02b85484a01b364f93ea999f2935004d19',
        '41444f91dce1a420998d1136ed742fb2030536a35d3b8cbe28581aa73bb7c621',
        'ad7e5a1c7b07e7d08cd184eae1a9bc6d51f911c94f9018a262fe643cc52986a3',
        'a3baec16f9c93e465863f9b3f9000d327f24620f43bb402a68f119ff6bad47c6',
        'b747938eac6b75170fcb65acb37f773d4b370f1d462a23e2aad27fdd402a4136',
        'd5dfe44619e5e2a806399309880944714fdbfe4524852be97287ef80eb844332',
    ];

    it('gets the estimated fee', async () => {
        const fee = await getFeesSatoshiPerKB('testnet');

        expect(fee).toBe(100);
    });

    it('gets the estimated fee on regtest', async () => {
        const fee = await getFeesSatoshiPerKB('regtest');

        expect(fee).toBe(10000);
    });

    it('gets the current block height', async () => {
        const height = await getBlockHeight('testnet');

        expect(height).toBe(1280175);
    });

    it('selects a regtest server', async () => {
        const height = await getBlockHeight('regtest');

        expect(height).toBe(1280175);
    });

    it('errors on an invalid network', async () => {
        await expect(getBlockHeight('litecoin')).rejects.toThrow('Unknown network \'litecoin\'');
    });

    it('correctly funds a transaction', async () => {
        const addr = Address.fromBase58('mmGx9VsBsn1Mv3gERhXTAChASu8vqkeke6');
        const coins = await fundTx(addr, 2024152, 'testnet');

        const expected = [
            {
                version: 1,
                height: 1260163,
                value: 115368335,
                script: '76a9143f2acedfda87b9a111bdd4a0b0d8b04cb34e515488ac',
                address: '16kzrSnD4ka78wCci8Z5LHUqauYDxLS8QD',
                coinbase: false,
                hash: '3a03f98f6f5632c7cebc3d1a9eb3ac64c8bd23fb5b0fdeeba29c835a545642be',
                index: 3,
            },
        ];

        expect(JSON.stringify(coins)).toBe(JSON.stringify(expected));
    });

    it('errors if there are insufficient funds for a tx', async () => {
        const addr = Address.fromBase58('muYWRM71cj5LH1aJ16FLFP2PHn2SHs3FpA');
        await expect(fundTx(addr, 2024152, 'testnet')).rejects.toThrow('Insufficient funds available');
    });

    it('errors if there are no funds for a tx', async () => {
        const addrStr = '14qyvufyTr9j52SPaXN1iY18vE8nyXi37b';
        const addr = Address.fromBase58(addrStr);
        await expect(fundTx(addr, 2024152, 'main')).rejects.toThrow(`No unspent txs found for ${addrStr}`);
    });

    it('gets a valid txid', async () => {
        const txid = 'bae2969230ac7104db17a2de96d4dd5c069acd9db49b40540cb24ff70c61e875';
        const fullTx = await getTX(txid, 'testnet');

        expect(fullTx.toRaw()).toMatchSnapshot();
    });

    it('throws if an unknown txid is found', async () => {
        const txid = '1111111111111111111111111111111111111111111111111111111111111111';

        await expect(getTX(txid, 'testnet')).rejects.toThrow();
    });

    it('publishes a valid transaction', async () => {
        // tslint:disable-next-line:max-line-length
        const rawTx = '010000000136b3f495418e8e368a5171f359bfc08147ec80eae1115cd8ca3a3e6ac568ca57010000006b483045022100d73b4e20d7fb787b9b6a21904db5cd1a0e546ae93a034b3491eff1764759254e0220620913f62dc63ea8f43cc75615b78076e2bc378d96276321277f446b5b25706a012103c7ea37388348c29a52cbc02fc29bc85d7962c1eb4f72fe57d44b5cbe619b34c1ffffffff040000000000000000226a20c83a8f415ee1147b90ed364e36564ed0a467e81ddb7c2c429b2563cac50b4f9020a10700000000001976a91499dcfe8133d8db60cb98df44397f6f1a2cdb776688ac6c761e000000000017a91436c74d83ced4969b1d8f8ce742559dde1626659c878a640007000000001976a9143f2acedfda87b9a111bdd4a0b0d8b04cb34e515488ac00000000';

        const fullTx = TX.fromRaw(rawTx, 'hex');

        await postTX(fullTx, 'testnet');

        const ex = new ElectrumClient(0, '', '');
        expect(ex.blockchainTransaction_broadcast).toBeCalled();
        expect(ex.blockchainTransaction_broadcast).toBeCalledWith(rawTx);
    });

    it('errors on an invalid transaction', async () => {
        const blankTx = new TX();

        await expect(postTX(blankTx, 'testnet')).rejects.toThrow();
    });

    it('generates a tx list from network data', async () => {
        const addr = Address.fromBase58('mk8cJh83q2JKBNguuzamfN1LZ9aECtnVJ7');
        const txList = await getAllTX(addr, 'testnet');

        expect(txList.getTxids()).toEqual(expectedTxids);
    });

    it('generates a tx list from network data on regtest', async () => {
        const addr = Address.fromBase58('mk8cJh83q2JKBNguuzamfN1LZ9aECtnVJ7');
        const txList = await getAllTX(addr, 'regtest');

        expect(txList.getTxids()).toEqual(expectedTxids);
    });
});
