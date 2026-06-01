import Button from "@/components/ui/Button";
import Card from "./ui/Card";
import Input from "./ui/Input";
import SectionTitle from "./ui/SectionTitle";
import { useCallback, useState } from "react";
import { isValidContractAddr } from "@/utils/utils";
import { useContracts, useNetwork } from "@/hooks/useStore";
import type { Contract } from "@/store/types";

export default function WatchContract() {
    const { selectedChain } = useNetwork();
    const { addWatchedContract, setActiveContract } = useContracts();

    const [contractAddr, setContractAddr] = useState<string | undefined>();

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement, Element>) => {
        const addr = e.target.value;

        if (!isValidContractAddr(addr)) return;

        setContractAddr(addr);
    }, []);

    const handleAddContract = useCallback(() => {
        if (!contractAddr || !selectedChain) return;

        const contract: Contract = {
            address: contractAddr,
            chainGenesisHash: selectedChain.genesisHash
        };

        addWatchedContract(contract);
        setActiveContract(contract);
        setContractAddr("");
    }, [addWatchedContract, contractAddr, selectedChain, setActiveContract]);

    return (
        <Card style="flex flex-col gap-3.5">
            <SectionTitle text="Watch Smart Contract" />
            <Input
                placeholder="Paste contract address..."
                onChange={handleInputChange}
                value={contractAddr}
            />
            <div className="flex flex-row gap-3.5">
                <Button
                    onClick={handleAddContract}
                    title="Add To Watchlist"
                    type="primary"
                    style="flex-1"
                />
                <Button
                    onClick={() => null}
                    title="⚙"
                    type="secondary"
                />
            </div>
        </Card>
    );
}
