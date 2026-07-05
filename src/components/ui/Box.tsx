import { twMerge } from "tailwind-merge";

interface Props {
    children?: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export default function Box({ children, className, onClick }: Props) {
    return (
        <div
            className={twMerge(
                "bg-bg-quaternary border border-border-primary p-3.5 rounded-xl hover:bg-bg-quaternary-hover hover:-translate-y-px fast-transition",
                onClick ? "cursor-pointer" : "cursor-default",
                className)}
            onClick={onClick}
        >
            {children}
        </div>
    );
}
