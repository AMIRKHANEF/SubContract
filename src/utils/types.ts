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

export interface ApiResponse<T> {
    code: number;
    message: string;
    generated_at: number;
    data: T;
}

export interface ListResponse<T> {
    count: number;
    list: T[];
}

export interface ContractDetail {
    address: string;
    abi: unknown[] | null;
    deployer: string;
    block_num: number;
    deploy_at: number;
    verify_status: string;
    verify_type: string;
    contract_name: string;
    compiler_version: string;
    evm_version: string;
    external_libraries: string;
    optimize: string;
    optimization_runs: string;
    extrinsic_index: string;
    transaction_hash: string;
    verify_time: number;
    transaction_count: number;
    precompile: string;
    eip_standard: string;
    proxy_implementation: string;
    constructor_arguments: string;
    deploy_code_hash: string;
    same_contract_address: string;
    verify_source: string;
    pvm: boolean;
    source_code: string;
    creation_code: string;
    creation_bytecode: string;
    method_identifiers: Record<string, string> | null;
    event_identifiers: Record<string, string> | null;
}

export interface ContractTransaction {
    hash: string;
    from: string;
    value: string;
    gas_price: string;
    gas_used: string;
    success: boolean;
    block_timestamp: number;
    contract: string;
    contract_name: string;
    method: string
    effective_gas_price: string;
    transaction_id: number;
    // txn_type: number;
}
