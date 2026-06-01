import type { Contract } from "@/store/types";
import { toShortAddress } from "@/utils/utils";
import { Star, Trash2 } from "lucide-react";
import { twMerge } from "tailwind-merge";

const iconsBaseStyle = "p-2 hover:bg-bg-hover fast-transition rounded-full cursor-pointer";

interface ContractItemProps {
    contract: Contract;
    isActive?: boolean;
    onActive?: (contract: Contract) => void;
    onRemove?: (contract: Contract) => void;
}

export default function ContractItem({ contract, isActive, onActive, onRemove }: ContractItemProps) {
    return (
        <div className="flex flex-row gap-2 items-center justify-between px-1.5">
            <p>{toShortAddress(contract.address)}</p>
            <p>{contract.label}</p>
            <div className="flex flex-row gap-1.5 items-center">
                <Trash2
                    onClick={() => onRemove?.(contract)}
                    size={32}
                    className={iconsBaseStyle}
                />
                <Star
                    onClick={() => onActive?.(contract)}
                    size={34}
                    className={twMerge(iconsBaseStyle, isActive ? "text-yellow-400 fill-yellow-400" : "")}
                />
            </div>
        </div>
    );
}