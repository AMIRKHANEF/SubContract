import type { ReactNode } from "react";

interface Props {
    title: string;
    description: string;
    icon: ReactNode;
    onClick: () => void;
}

export default function UtilityItem({ description, icon, onClick, title }: Props) {
    return (
        <div
            className="
                bg-(--bg-quaternary) border border-(--border-primary) p-3.5 rounded-xl
                cursor-pointer hover:bg-(--bg-quaternary-hover) hover:-translate-y-px"
            onClick={onClick}
        >
            <div className="utility-icon">{icon}</div>
            <p className="mt-3 text-sm font-semibold">
                {title}
            </p>
            <p className="mt-1 text-xsm font-thin">
                {description}
            </p>
        </div>
    );
}
