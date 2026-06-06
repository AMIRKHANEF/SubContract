import { useContracts, useNetwork } from "@/hooks/useStore";
import { toEllipsisAddress, toShortAddress } from "@/utils/utils";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import Divider from "./ui/Divider";
import type { Contract } from "@/store/types";
import { twMerge } from "tailwind-merge";
import { useMemo } from "react";

function EmptyList () {
    return (
        <p className="text-sm font-medium py-4 px-2">
            No contract has been added!
        </p>
    );
}

interface ContractItemProps {
    contract: Contract;
    isActive?: boolean;
}

function ContractItem({ contract, isActive }: ContractItemProps) {
    return (
        <div className={twMerge("flex flex-row items-center justify-between p-1.5 min-w-28 hover:bg-bg-hover rounded-sm cursor-pointer hover:text-accent-primary-hover fast-transition",
            isActive ? 'text-accent-primary' : ''
        )}>
            <p>{toShortAddress(contract.address)}</p>
            <p>{contract.label}</p>
        </div>
    );
}

interface Props {
    filterBaseOnSelectedChain?: boolean;
}

export default function ContractSwitch({ filterBaseOnSelectedChain = false }: Props) {
    const { activeContract, watchedContracts } = useContracts();
    const { selectedChain } = useNetwork();

    const contractsToShow = useMemo(() => {
        if (filterBaseOnSelectedChain) {
            return watchedContracts
                .filter(({ chainGenesisHash }) => chainGenesisHash === selectedChain?.genesisHash);
        }

        return watchedContracts;
    }, [filterBaseOnSelectedChain, selectedChain?.genesisHash, watchedContracts]);

    return (
        <Popover className="relative">
            <PopoverButton
                className="
                    border-default w-fit h-fit rounded-full
                    cursor-pointer py-1 px-3 hover:border-border-secondary
                    fast-transition outline-0 text-accent-primary
                    hover:text-accent-primary-hover font-bold bg-bg-secondary"
            >
                {activeContract?.label ?? toEllipsisAddress(activeContract?.address) ?? 'None'}
            </PopoverButton>
            <PopoverPanel
                anchor="bottom end"
                className="
                    bg-bg-secondary flex flex-col mt-1 w-fit h-fit
                    rounded-md border-secondary transition duration-150
                    ease-in-out data-closed:opacity-0 shadow-2xl p-2 gap-1"
                transition
            >
                {contractsToShow.map((contract, index) => {
                    const isActive = contract.address === activeContract?.address;

                    return (
                        <>
                            <ContractItem
                                key={index}
                                contract={contract}
                                isActive={isActive}
                            />
                            {(contractsToShow.length - 1 > index) && <Divider />}
                        </>
                    )
                })}
                {contractsToShow.length === 0 &&
                    <EmptyList />   
                }
            </PopoverPanel>
        </Popover>
    );
}
