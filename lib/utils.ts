import {
    utils,
} from 'bcoin';

export type netStr = 'testnet' | 'main' | 'regtest';

function bech32Encode(pubKey: Buffer, network: netStr): string {
    let hrp: string;

    if (network === 'main') {
        hrp = 'pk';
    } else if (network === 'testnet') {
        hrp = 'tp';
    } else if (network === 'regtest') {
        hrp = 'rp';
    } else {
        throw new Error('Invalid network');
    }

    return utils.bech32.encode(hrp, 0, pubKey);
}

function bech32Decode(data: string): {pubKey: Buffer, network: netStr} | null {
    const decoded = utils.bech32.decode(data);

    const pubKey = decoded.hash;
    const hrp = decoded.hrp;

    let network: netStr;
    if (hrp === 'pk') {
        network = 'main';
    } else if (hrp === 'tp') {
        network = 'testnet';
    } else if (hrp === 'rp') {
        network = 'regtest';
    } else {
        return null;
    }

    return {
        pubKey,
        network,
    };
}

export {
    bech32Encode,
    bech32Decode,
};
