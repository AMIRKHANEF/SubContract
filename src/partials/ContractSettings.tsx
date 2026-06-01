import { useContracts, useNetwork } from "@/hooks/useStore";
import { Fragment, useMemo } from "react";
import Divider from "@/components/ui/Divider";
import Button from "@/components/ui/Button";
import { PopUps } from "@/utils/constants";
import ContractItem from "@/components/ContractItem";

export default function ContractSettings({ setPopup }: { setPopup: React.Dispatch<React.SetStateAction<PopUps>> }) {
    const { activeContract, watchedContracts, setActiveContract, removeWatchedContract } = useContracts();
    const { selectedChain } = useNetwork();

    const contractsOnChain = useMemo(() =>
        watchedContracts.filter(({ chainGenesisHash }) => chainGenesisHash === selectedChain?.genesisHash), [selectedChain?.genesisHash, watchedContracts]);

    return (
        <div className="flex flex-col w-[80vw] py-3 px-4.5">
            {contractsOnChain.length > 0 &&
                <>
                    <p className="text-smd font-light text-text-primary mb-2.5">Contracts on selected chain:</p>
                    <div className="bg-bg-tertiary flex flex-col gap-2 rounded-md p-1.5">
                        {contractsOnChain.map((contract, index) => {
                            const isActive = activeContract?.address === contract.address;

                            return (
                                <Fragment key={index}>
                                    <ContractItem
                                        contract={contract}
                                        isActive={isActive}
                                        onActive={setActiveContract}
                                        onRemove={removeWatchedContract}
                                    />
                                    {contractsOnChain.length - 1 !== index && <Divider />}
                                </Fragment>
                            );
                        })}
                    </div>
                </>}
            {contractsOnChain.length === 0 &&
                <p className="text-smd font-light text-text-primary py-10 text-center">No contract added yet</p>
            }
            <Button
                onClick={() => setPopup(PopUps.None)}
                type="primary"
                title="Done"
                style="mt-3.5"
            />
        </div>
    );
}
