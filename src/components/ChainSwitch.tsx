import { POLKADOT_ASSET_HUB_CHAIN, SUPPORTED_CHAINS } from '@/utils/constants';
import { Popover, PopoverButton, PopoverPanel, useClose } from '@headlessui/react'
import Divider from './ui/Divider';
import { useNetwork } from '@/hooks/useStore';
import { useCallback } from 'react';
import type { Chain } from '@/utils/types';

function ChainItem({ chain }: { chain: Chain }) {
    const close = useClose();
    const { setSelectedChain } = useNetwork();

    const handleClick = useCallback(() => {
        setSelectedChain(chain);
        close();
    }, [chain, close, setSelectedChain]);

    return (
        <div
            onClick={handleClick}
            className="rounded-sm p-3 w-full cursor-pointer hover:bg-bg-hover hover:text-accent-primary fast-transition"
        >
            {chain.fullName}
        </div>
    );
}

export default function ChainSwitch() {
    const { selectedChain } = useNetwork();

    return (
        <Popover className="relative">
            <PopoverButton
                className="
                    border-default w-fit h-fit rounded-full
                    cursor-pointer py-1 px-3 hover:border-border-secondary
                    fast-transition outline-0 text-accent-primary
                    hover:text-accent-primary-hover font-bold bg-bg-secondary"
            >
                {selectedChain?.name ?? POLKADOT_ASSET_HUB_CHAIN.name}
            </PopoverButton>
            <PopoverPanel
                anchor="bottom end"
                className="
                    bg-bg-secondary flex flex-col mt-1 w-fit h-fit
                    rounded-md border-secondary transition duration-150
                    ease-in-out data-closed:opacity-0 shadow-2xl p-2 gap-1"
                transition
            >
                {SUPPORTED_CHAINS.map((item, index) => (
                    <>
                        <ChainItem key={index} chain={item} />
                        {(SUPPORTED_CHAINS.length - 1 > index) && <Divider orientation='horizontal' />}
                    </>
                ))}
            </PopoverPanel>
        </Popover>
    );
}
