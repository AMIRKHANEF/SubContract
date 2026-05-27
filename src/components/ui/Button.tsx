import { twMerge } from "tailwind-merge";

interface Props {
    title: string;
    onClick: () => void;
    type: "primary" | "secondary";
    style?: string;
}

const base =
    "cursor-pointer inline-flex items-center justify-center gap-2 h-10 px-4 rounded-md text-text-primary button-transition";

const variants = {
    primary:
        "bg-accent-primary font-semibold text-xsm hover:bg-accent-primary-hover active:scale-[0.99]",
    secondary:
        "border border-border-primary bg-bg-secondary text-sm font-medium hover:bg-bg-hover hover:border-border-secondary"
};

export default function Button({ title, onClick, type, style }: Props) {
    return (
        <button
            className={twMerge(`${base} ${variants[type]}`, style)}
            onClick={onClick}
        >
            {title}
        </button>
    );
}
