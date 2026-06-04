import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface Props {
    title?: string;
    onClick: () => void;
    type: "primary" | "secondary" | "tertiary" | "quaternary";
    className?: string;
    Icon?: ReactNode;
}

const base =
    "cursor-pointer inline-flex items-center justify-center gap-2 h-10 px-2.5 rounded-md text-text-primary button-transition";

const variants = {
    primary:
        "bg-accent-primary font-semibold text-xsm hover:bg-accent-primary-hover active:scale-[0.99]",
    secondary:
        "border border-border-primary bg-bg-secondary text-sm font-medium hover:bg-bg-hover hover:border-border-secondary",
    tertiary:
        "bg-accent-primary/10 text-accent-primary text-sm font-medium hover:bg-accent-primary/20 active:scale-[0.99]", // accepted for now
    quaternary:
        "backdrop-blur-md bg-white/5 border border-white/10 text-text-primary text-sm font-medium hover:bg-white/10 hover:border-white/20 active:scale-[0.99]",
};

export default function Button({ Icon, title, onClick, type, className }: Props) {
    return (
        <button
            className={twMerge(`${base} ${variants[type]}`, className)}
            onClick={onClick}
        >
            {title}
            {Icon}
        </button>
    );
}
