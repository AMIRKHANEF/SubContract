import { isEthereumAddress } from '@polkadot/util-crypto'
import type { HexString } from '@polkadot/util-crypto/cjs/helpers';
import chains from './chains';

export const getChainName = (genesis: string | HexString | undefined) => {
    if (!genesis) return undefined;

    return chains
        .find(({ genesisHash, chain }) => genesisHash === genesis && !!chain)
        ?.chain;
}

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

export const availableWidth = (ref: React.RefObject<null>, maxWidth: number) => {
    const usedWidth = (ref.current as unknown as { clientWidth: number })?.clientWidth ?? 0;

    return maxWidth - usedWidth;
}

/**
 * Capitalizes the first character of a string.
 * @param {string} str - The string to capitalize.
 * @returns {string} The capitalized string.
 */
export function capitalizeFirstWord(str: string | undefined): string {
    if (!str || typeof str !== 'string') return '';

    return str.charAt(0).toUpperCase() + str.slice(1);
}

export const getSubscanChainId = (network: HexString | string | undefined) => {
    if (!network) return undefined;

    const chainName = chains
        .find(({ genesisHash, chain }) => !!chain && (genesisHash === chain || chain === network))
        ?.chain;

    switch (chainName?.toLowerCase()) {
        case 'polkadot asset hub':
            return 'assethub-polkadot';
        case 'paseo asset hub':
            return 'assethub-paseo';

        default:
            return 'assethub-polkadot';
    }
}
