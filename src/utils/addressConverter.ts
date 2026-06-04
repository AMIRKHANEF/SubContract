import { hexToU8a, u8aToHex } from "@polkadot/util";
import { encodeAddress, decodeAddress, keccak256AsU8a } from "@polkadot/util-crypto";

/**
 * Converts an Ethereum address to SS58 format
 * 
 * Process:
 * 1. Validate Ethereum address (must be 20 bytes)
 * 2. Create 32-byte array filled with 0xEE
 * 3. Copy 20 ETH bytes into first 20 positions
 * 4. Encode with SS58 using selected network prefix
 * 
 * @param {string} ethAddress - Ethereum address (0x + 40 hex chars)
 * @param {number} ss58Prefix - Network prefix
 * @returns {string} SS58-encoded address
 */
export function ethToSS58(ethAddress: string, ss58Prefix: number = 0): string {
    // Validate Ethereum address format
    if (!ethAddress.match(/^0x[0-9a-fA-F]{40}$/)) {
        throw new Error('Invalid Ethereum address format. Expected 0x followed by 40 hex characters.');
    }

    // Convert ETH address to bytes (20 bytes)
    const ethBytes = hexToU8a(ethAddress);

    // Create 32-byte Substrate address: 20 bytes ETH + 12 bytes of 0xEE padding
    const substrateBytes = new Uint8Array(32);
    substrateBytes.fill(0xEE);
    substrateBytes.set(ethBytes, 0);

    // Encode as SS58 address
    return encodeAddress(substrateBytes, ss58Prefix);
}

/**
 * Converts an SS58 address to Ethereum format
 * 
 * Process:
 * 1. Decode SS58 address to 32-byte public key
 * 2. Check last 12 bytes:
 *    - If all 0xEE: This is an ETH-derived address, strip suffix to get original 20 bytes
 *    - Otherwise: This is a native Substrate address, hash with Keccak256 and take last 20 bytes
 * 3. Return checksummed Ethereum address
 * 
 * @param {string} ss58Address - SS58-encoded Substrate address
 * @returns {string} Checksummed Ethereum address
 */
export function ss58ToEth(ss58Address: string): string {
    // Decode SS58 address to get 32-byte public key
    const substrateBytes = decodeAddress(ss58Address);

    // Check if last 12 bytes are all 0xEE (indicates ETH-derived address)
    const isEthDerived = substrateBytes.slice(20).every(byte => byte === 0xEE);

    let ethBytes;
    if (isEthDerived) {
        // ETH-derived: Strip 0xEE suffix to get original 20-byte ETH address
        ethBytes = substrateBytes.slice(0, 20);
    } else {
        // Native Substrate address: Hash with Keccak256 and take last 20 bytes
        const hash = keccak256AsU8a(substrateBytes);
        ethBytes = hash.slice(-20);
    }

    // Convert to hex and apply EIP-55 checksumming
    return toChecksumAddress(u8aToHex(ethBytes));
}

/**
 * Converts an Ethereum address to checksummed format (EIP-55)
 * 
 * @param {string} address - Ethereum address (with or without 0x prefix)
 * @returns {string} Checksummed Ethereum address with 0x prefix
 */
function toChecksumAddress(address: string): string {
    const addr = address.toLowerCase().replace('0x', '');

    if (addr.length !== 40) {
        throw new Error('Invalid Ethereum address length');
    }

    const hash = keccak256AsU8a(new TextEncoder().encode(addr));

    let checksummed = '0x';
    for (let i = 0; i < addr.length; i++) {
        if (hash[Math.floor(i / 2)] >> (i % 2 === 0 ? 4 : 0) & 0x8) {
            checksummed += addr[i].toUpperCase();
        } else {
            checksummed += addr[i];
        }
    }

    return checksummed;
}

/**
 * Validates an Ethereum address format
 */
export function isValidEthAddress(address: string): boolean {
    return /^0x[0-9a-fA-F]{40}$/.test(address);
}

/**
 * Validates an SS58 address by attempting to decode it
 */
export function isValidSS58Address(address: string): boolean {
    try {
        decodeAddress(address);
        return true;
    } catch {
        return false;
    }
}
