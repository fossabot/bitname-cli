import { address as Address } from 'bcoin';
import fetch from 'node-fetch';

async function fetchUnspentTX(addr: Address, network: string): Promise<any> {
    let netSuffix = 'main';
    if (network === 'testnet') {
        netSuffix = 'test3';
    }

    const b58 = addr.toBase58(network);

    const url = `https://api.blockcypher.com/v1/btc/${netSuffix}/addrs/${b58}?unspentOnly=true&includeScript=true`;

    const resp = await fetch(url);
    return resp.json();
}

async function fetchAllTX(addr: Address, network: string): Promise<any[]> {
    let netSuffix = 'main';
    if (network === 'testnet') {
        netSuffix = 'test3';
    }

    const b58 = addr.toBase58(network);

    const baseURL = `https://api.blockcypher.com/v1/btc/${netSuffix}/addrs/${b58}/full?includeHex=true&limit=50`;

    let curResp = await fetch(baseURL);
    let curData = await curResp.json();

    let data = curData.txs;

    let reqs = 1;

    while (curData.hasOwnProperty('hasMore')) {
        const lastHeight = curData.txs[curData.txs.length - 1].block_height;
        const url = `${baseURL}&before=${lastHeight}`;
        curResp = await fetch(baseURL);
        curData = await curResp.json();

        // data.push(curData);
        data = data.concat(curData.txs);
        reqs += 1;
    }

    return data;
}

async function fetchMetadata(network: string) {
    let netSuffix = 'main';
    if (network === 'testnet') {
        netSuffix = 'test3';
    }
    const url = `https://api.blockcypher.com/v1/btc/${netSuffix}`;

    const resp = await fetch(url);
    const data = await resp.json();

    return data;
}

async function fetchTX(txid: string, network: string) {
    let netSuffix = 'main';
    if (network === 'testnet') {
        netSuffix = 'test3';
    }

    const url = `https://api.blockcypher.com/v1/btc/${netSuffix}/txs/${txid}?includeHex=true`;

    const resp = await fetch(url);
    const data = await resp.json();

    return data;
}

export {
    fetchUnspentTX,
    fetchAllTX,
    fetchMetadata,
    fetchTX,
};
