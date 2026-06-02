import Button from "@/components/ui/Button";
import Card from "./ui/Card";
import Input from "./ui/Input";
import SectionTitle from "./ui/SectionTitle";
import { useCallback, useState } from "react";
import { isValidContractAddr } from "@/utils/utils";
import { useContracts, useNetwork } from "@/hooks/useStore";
import type { Contract } from "@/store/types";
import { Settings } from 'lucide-react';
import { PopUps } from "@/utils/constants";

interface Props {
    setPopup: (popup: PopUps) => void;
}

export default function WatchContract({ setPopup }: Props) {
    const { selectedChain } = useNetwork();
    const { addWatchedContract, setActiveContract } = useContracts();

    const [contractAddr, setContractAddr] = useState<string | undefined>();
    const [badContractAddr, setError] = useState<boolean>(false);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement, Element>) => {
        const addr = e.target.value;

        if (!isValidContractAddr(addr)) setError(true);
        if (!addr || isValidContractAddr(addr)) setError(false);

        setContractAddr(addr);
    }, []);

    const handleAddContract = useCallback(() => {
        if (!contractAddr || !selectedChain || badContractAddr) return;

        const contract: Contract = {
            address: contractAddr,
            chainGenesisHash: selectedChain.genesisHash
        };

        addWatchedContract(contract);
        setActiveContract(contract);
        setContractAddr("");
    }, [addWatchedContract, badContractAddr, contractAddr, selectedChain, setActiveContract]);

    return (
        <Card style="flex flex-col gap-3.5">
            <SectionTitle text="Watch Smart Contract" />
            <Input
                placeholder="Paste contract address..."
                onChange={handleInputChange}
                value={contractAddr}
                onEnter={handleAddContract}
                error={badContractAddr}
                showPasteIcon
            />
            <div className="flex flex-row gap-3">
                <Button
                    onClick={handleAddContract}
                    title="Add To Watchlist"
                    type="primary"
                    style="flex-1"
                />
                <Button
                    onClick={() => setPopup(PopUps.ContractSettings)}
                    Icon={<Settings className="text-text-secondary" size={18} />}
                    type="secondary"
                />
            </div>
        </Card>
    );
}
