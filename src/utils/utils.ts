import { isEthereumAddress } from '@polkadot/util-crypto'

export const sanitizeChainName = (chainName: string | undefined) => {
    if (!chainName) {
        return chainName;
    }

    const sanitizedChainName = chainName
        .replace(' Relay Chain', '')
        .replace(' Network', '')
        .replace(' chain', '')
        .replace(' Chain', '')
        .replace(' Finance', '')
        .replace(' Testnet', '')
        .replace(' Main', '')
        .replace(/\s/g, '');

    return sanitizedChainName;
};

export const isValidContractAddr = (contractAddr: string | undefined) => {
    if (!contractAddr) return false;

    const hexCheck = contractAddr.startsWith('0x');
    const lengthCheck = contractAddr.length === 42;
    const isEthereumAddr = isEthereumAddress(contractAddr);

    return hexCheck && lengthCheck && isEthereumAddr;
};

export const toShortAddress = (addr: string, count: number = 4) => {
    return addr.slice(0, count) + '...' + addr.slice(-count);
}

export const toEllipsisAddress = (addr: string | undefined, count: number = 6) => {
    if (!addr) return undefined;

    return addr.slice(0, count) + '...';
}
