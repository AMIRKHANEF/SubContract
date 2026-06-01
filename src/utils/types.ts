import type { HexString } from "polkadot-api";

export interface DropdownOption {
    text: string;
    value: string;
}

export interface Chain {
    name: string;
    fullName: string;
    genesisHash: HexString;
    decimal: number;
    token: string;
    ss58Format: number;
}
