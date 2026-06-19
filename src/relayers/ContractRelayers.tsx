import { useContracts } from "@/hooks/useStore";
import type { ContractInfo } from "@/store/types";
import { subscanQueue } from "@/utils/classes/subscanQueue";
import type { ApiResponse, ContractDetail, ContractTransaction, ListResponse } from "@/utils/types";
import { getSubscanChainId } from "@/utils/utils";
import { useEffect } from "react";

export default function ContractRelayer() {
    const { activeContract, updateContractInfo } = useContracts();
    const subscanChainId = getSubscanChainId(activeContract?.chainGenesisHash)

    const fetchContract = async () => {
        try {
            const { data } = await subscanQueue.enqueue<ApiResponse<ContractDetail>>(
                `https://${subscanChainId}.api.subscan.io/api/scan/evm/contract`,
                { method: 'POST', body: JSON.stringify({ "address": activeContract?.address }) }
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
            } as ContractInfo

            console.log("Contract:", data);

            updateContractInfo({
                ...activeContract!,
                abi: abi ? JSON.stringify(abi) : null,
                info: contractInfo
            });
        } catch (error) {
            console.error("Error fetching from Subscan:", error);
        }
    };

    const fetchContractTX = async () => {
        const { data: { list } } = await subscanQueue.enqueue<ApiResponse<ListResponse<ContractTransaction>>>(
            `https://${subscanChainId}.api.subscan.io/api/scan/evm/v2/transactions`,
            { method: 'POST', body: JSON.stringify({ "contract": activeContract?.address }) }
        );

        console.log("Contract Transactions:", list);
    };

    useEffect(() => {
        fetchContract();
        fetchContractTX();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return null;
}
