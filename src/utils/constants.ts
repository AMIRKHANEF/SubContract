import type { Chain } from "./types";

export const EXTENSION_NAME = "SubContract";

export const PASEO_ASSET_HUB_GENESIS_HASH = '0xd6eec26135305a8ad257a20d003357284c8aa03d0bdb2b357ab0a22371e11ef2';
export const POLKADOT_ASSET_HUB_GENESIS_HASH = '0x68d56f15f85d3136970ec16946040bc1752654e906147f7e43e9d539d7c3de2f';

export const STORAGE_KEY = "SubContract_storage";

export const DISABLED_NETWORKS = ['3DP network', 'xx network', 'Polkadex Mainnet', 'Stafi', 'Peaq Network', 'Genshiro Network'];

export const POLKADOT_ASSET_HUB_CHAIN: Chain = {
    name: 'Polkadot',
    fullName: 'Polkadot Asset Hub',
    genesisHash: POLKADOT_ASSET_HUB_GENESIS_HASH,
    token: "DOT",
    decimal: 10,
    ss58Format: 0
};

export const PASEO_ASSET_HUB_CHAIN: Chain = {
    name: 'Paseo',
    fullName: 'Paseo Asset Hub',
    genesisHash: PASEO_ASSET_HUB_GENESIS_HASH,
    token: "PAS",
    decimal: 10,
    ss58Format: 0
}

export const SUPPORTED_CHAINS = [
    POLKADOT_ASSET_HUB_CHAIN,
    PASEO_ASSET_HUB_CHAIN
] as const;

export enum PopUps {
    None,
    ContractSettings,
    GasHelper,
    SelectorLookUp,
    AbiViewer,
    AccountTransform
}
