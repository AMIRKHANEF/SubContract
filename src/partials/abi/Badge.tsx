import type { StateType } from "@/utils/ABI/ABIParser";
import { twMerge } from "tailwind-merge";

interface Props {
    state: StateType;
    className?: string;
}

export default function Badge({ state, className }: Props) {
    const badgeText = state === "nonpayable" ? "write" : state;
    const badgeStyle = variants[badgeText] ?? variants["write"];

    return (
        <div className={twMerge("font-light text-xs border-default bg-bg-secondary rounded-2xs p-1 py-0.5", badgeStyle, className)}>
            {badgeText}
        </div>
    );
}

const variants = {
    write: 'bg-info/10 text-info',
    view: 'bg-success/10 text-success',
    event: 'bg-event/10 text-event',
    error: 'bg-error/10 text-error',
    payable: 'bg-warning/10 text-warning',
    ctor: 'bg-info/10 text-info'
};
