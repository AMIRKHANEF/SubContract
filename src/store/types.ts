import type { Chain } from "@/utils/types";

export interface Contract {
    address: string;
    chainGenesisHash: string;
    abi?: unknown[];
    label?: string;
}

export interface Account {
    address: string;
    label?: string;
}

// ─── Slice State Shapes ───────────────────────────────────────────────────────

export interface NetworkState {
    selectedChain: Chain | null;
}

export interface ContractState {
    activeContract: Contract | null;
    watchedContracts: Contract[];
}

export interface AccountState {
    accounts: Account[];
    activeAccount: Account | null;
}

// ─── Root State ───────────────────────────────────────────────────────────────

export interface RootState {
    network: NetworkState;
    contracts: ContractState;
    accounts: AccountState;
}
