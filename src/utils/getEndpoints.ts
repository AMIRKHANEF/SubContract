// Copyright 2019-2026 @polkadot/extension-polkagate authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { createWsEndpoints } from '@polkagate/apps-config';

import chains from '@/utils/chains';
import type { DropdownOption } from '@/utils/types';
import { sanitizeChainName } from '@/utils/utils';

const supportedLC = ['polkadot', 'kusama', 'westend']; // chains with supported light client
const allEndpoints = createWsEndpoints();

/**
 * @description
 * Find endpoints based on genesisHash and omit light client endpoints for unsupported chains.
 */
export function getEndpoints(genesisHash: string | null | undefined): DropdownOption[] {
    if (!genesisHash) {
        return [];
    }

    const chainName = chains?.find((o) => o.genesisHash === genesisHash)?.name;
    const lsChainName = sanitizeChainName(chainName)?.toLowerCase();

    if (!lsChainName) {
        return [];
    }

    let endpoints = allEndpoints?.filter(({ info, text, value }) => {
        // Ignore endpoints matching 'wss://<any_number>' pattern due to rate limits
        if (!value || /^wss:\/\/\d+$/.test(value) || value.includes('onfinality')) {
            return false;
        }

        const matchesName =
            String(info)?.toLowerCase() === lsChainName ||
            String(text)?.toLowerCase()?.includes(lsChainName);

        return matchesName;
    });

    if (!endpoints.length) {
        return [];
    }

    // Check if all endpoints belong to the same chain
    const { genesisHashRelay, paraId } = endpoints[0];

    const areAllSame = endpoints.every((e) => e.paraId === paraId && e.genesisHashRelay === genesisHashRelay);

    if (!areAllSame) {
        // Fallback: filter by exact name match only
        endpoints = endpoints?.filter(({ info }) => String(info)?.toLowerCase() === lsChainName);
    }

    // Map to DropdownOption
    let endpointOptions = endpoints.map((endpoint) => ({ text: endpoint.textBy, value: endpoint.value }));

    const hasLightClientSupport = supportedLC.includes(lsChainName);

    if (!hasLightClientSupport) {
        endpointOptions = endpointOptions.filter((o) => String(o.value).startsWith('wss'));
    }

    return endpointOptions;
}
