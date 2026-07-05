import { useContracts } from "@/hooks/useStore";
import type { ContractActivity, ContractInfo } from "@/store/types";
import { subscanQueue } from "@/utils/classes/subscanQueue";
import type { ApiResponse, ContractDetail, ContractTokenBalancesResponse, ContractTransaction, ListResponse } from "@/utils/types";
import { getSubscanChainId } from "@/utils/utils";
import { useCallback, useEffect, useRef } from "react";

export default function ContractRelayer() {
    const { activeContract, updateContractInfo } = useContracts();
    const subscanChainId = getSubscanChainId(activeContract?.chainGenesisHash)

    const fetchContractCheck = useRef<{ address: string | undefined }>({ address: undefined });

    const fetchContract = useCallback(async () => {
        try {
            if (!activeContract) return;

            const { data } = await subscanQueue.enqueue<ApiResponse<ContractDetail>>(
                `https://${subscanChainId}.api.subscan.io/api/scan/evm/contract`,
                { method: 'POST', body: JSON.stringify({ "address": activeContract.address }) }
            );

            const abi = data.abi;

            const eventsId = data.event_identifiers ?? {};
            const methodsId = data.method_identifiers ?? {};

            const contractInfo = {
                blockNumber: data.block_num,
                compilerVersion: data.compiler_version,
                contractName: data.contract_name,
                deployAt: data.deploy_at,
                deployer: data.deployer,
                evmVersion: data.evm_version,
                verifySource: data.verify_source,
                verifyStatus: data.verify_status,
                verifyTime: data.verify_time,
                transactionCount: data.transaction_count,
                methodIdentifiers: { ...eventsId, ...methodsId }
            } as ContractInfo;

            updateContractInfo({
                address: activeContract.address,
                chainGenesisHash: activeContract.chainGenesisHash,
                abi: abi ? JSON.stringify(abi) : null,
                info: contractInfo
            });
        } catch (error) {
            console.error("Error Fetching Contract From Subscan:", error);
        }
    }, [activeContract, subscanChainId, updateContractInfo]);

    const fetchContractTX = useCallback(async () => {
        try {
            if (!activeContract) return;

            const { data: { list } } = await subscanQueue.enqueue<ApiResponse<ListResponse<ContractTransaction>>>(
                `https://${subscanChainId}.api.subscan.io/api/scan/evm/v2/transactions`,
                { method: 'POST', body: JSON.stringify({ "contract": activeContract?.address }) }
            );

            const activities = list.map((item) => ({
                blockTimestamp: item.block_timestamp,
                contract: item.contract,
                contractName: item.contract_name,
                effectiveGasPrice: item.effective_gas_price,
                from: item.from,
                gasPrice: item.gas_price,
                gasUsed: item.gas_used,
                hash: item.hash,
                method: item.method,
                success: item.success,
                transactionId: item.transaction_id,
                value: item.value
            } as ContractActivity))

            updateContractInfo({
                address: activeContract.address,
                chainGenesisHash: activeContract.chainGenesisHash,
                activities
            });
        } catch (error) {
            console.error("Error Fetching Contract Transactions From Subscan:", error);
        }
    }, [activeContract, subscanChainId, updateContractInfo]);

    const fetchContractBalance = useCallback(async () => {
        try {
            if (!activeContract) return;

            const { data } = await subscanQueue.enqueue<ApiResponse<ContractTokenBalancesResponse>>(
                `https://${subscanChainId}.api.subscan.io/api/scan/account/tokens`,
                { method: 'POST', body: JSON.stringify({ "address": activeContract.address }) }
            );

            const nativeAssets = data.native || [];
            const assets = data.assets || [];

            const allAssets = [...nativeAssets, ...assets];

            const balances = allAssets.map((item) => ({
                balance: item.balance,
                decimals: item.decimals,
                price: item.price ?? "0", // price might be missing for test net tokens, default to "0"
                symbol: item.symbol
            }));

            updateContractInfo({
                address: activeContract.address,
                chainGenesisHash: activeContract.chainGenesisHash,
                balances
            });
        } catch (error) {
            console.error("Error Fetching Contract Balance From Subscan:", error);
        }
    }, [activeContract, subscanChainId, updateContractInfo]);

    useEffect(() => {
        if (!activeContract || !subscanChainId || fetchContractCheck.current.address === activeContract.address) return;

        fetchContractCheck.current.address = activeContract?.address;

        (async () => {
            await fetchContract();
            await fetchContractTX();
            await fetchContractBalance();
        })();
    }, [activeContract, fetchContract, fetchContractBalance, fetchContractTX, subscanChainId])

    return null;
}
