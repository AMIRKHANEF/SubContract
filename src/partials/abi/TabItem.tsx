import type { ABITab } from "@/utils/ABI/ABIParser";
import { twMerge } from "tailwind-merge";

interface Props {
    name: ABITab;
    count: number;
    onClick: (tab: ABITab) => void;
    isSelected?: boolean;
}

export default function TabItem({ count, name, onClick, isSelected }: Props) {
    return (
        <div
            onClick={() => onClick(name)}
            className={twMerge(`
                flex flex-row w-fit items-center justify-between gap-1.5 fast-transition cursor-pointer
                rounded-sm hover:bg-bg-hover p-1.5`,
                isSelected ? " bg-bg-focused" : "")}
        >
            <p className="text-sm font-normal text-white">
                {name}
            </p>
            <p className="rounded-2xs bg-[#21213d] text-[#696995] py-px px-1 text-sm font-normal">
                {count}
            </p>
        </div>
    );
}
