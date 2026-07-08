import type { Chain, ContractTokenBalance } from "@/utils/types";

export interface Contract {
    address: string;
    chainGenesisHash: string;
    abi?: string | null;
    label?: string;
    info?: ContractInfo;
    activities?: ContractActivity[];
    balances?: ContractTokenBalance[];
}

export interface ContractInfo {
    blockNumber: number;
    compilerVersion: string;
    contractName: string;
    deployAt: number;
    deployer: string;
    evmVersion: string;
    verifySource: string;
    verifyStatus: string;
    verifyTime: number;
    transactionCount: number;
    methodIdentifiers: Record<string, string> | null;
}

export interface ContractActivity {
    hash: string;
    from: string;
    value: string;
    gasPrice: string;
    gasUsed: string;
    success: boolean;
    blockTimestamp: number;
    contract: string;
    contractName: string;
    method: string
    effectiveGasPrice: string;
    transactionId: number;
    // txnType: number;
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

export type Page = "Home" | "AbiExplore" | "ContractABI";
export type Direction = 1 | -1; // 1 === "forward" & -1 === "back"

export interface NavigationState {
    currentPage: Page;
    direction: Direction;
}

// ─── Root State ───────────────────────────────────────────────────────────────

export interface RootState {
    network: NetworkState;
    contracts: ContractState;
    accounts: AccountState;
    navigation: NavigationState;
}
