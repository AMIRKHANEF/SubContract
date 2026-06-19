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
        .find(({ genesisHash, chain }) => (genesisHash === network || chain === network))
        ?.chain;

    if (!chainName) return "assethub-polkadot";

    if (chainName.toLowerCase().includes("paseo")) return "assethub-paseo";

    return "assethub-polkadot";
}

/**
 * Ensures a hexadecimal string is represented with a `0x` prefix.
 *
 * @param value - The hexadecimal string to normalize.
 * @returns The normalized hexadecimal string.
 *
 * @example
 * normalizeHex("84a15da1");    // "0x84a15da1"
 * normalizeHex("0x84a15da1");  // "0x84a15da1"
 */
function normalizeHex(value: string): string {
    return value.startsWith("0x") ? value : `0x${value}`;
}

/**
 * Finds the first key whose value matches the provided method.
 *
 * @param methods - A map of method names to their identifiers.
 * @param method - The method identifier to search for.
 *
 * @returns The corresponding method name if found; otherwise `undefined`.
 *
 * @example
 * const methods = {
 *   transfer: "0x84a15da1",
 *   approve: "0x095ea7b3",
 * };
 *
 * findMethodName(methods, "0x095ea7b3");
 * // => "approve"
 */
export function findMethodName(
    methods: Record<string, string> | null | undefined,
    method: string | undefined
): string | undefined {
    if (!methods || !method) return method;

    const normalizedMethod = normalizeHex(method);

    for (const [name, value] of Object.entries(methods)) {
        if (normalizeHex(value) === normalizedMethod) {
            return formatFunctionSignature(name);
        }
    }

    return method;
}

    }
}
