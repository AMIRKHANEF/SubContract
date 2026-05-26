import { twMerge } from "tailwind-merge";

interface Props {
    title: string;
    onClick: () => void;
    type: "primary" | "secondary";
    style?: string;
}

export default function Button({ title, onClick, type, style }: Props) {
    return (
        <button 
            className={twMerge(`button-${type}`, style)} 
            onClick={onClick}
        >
            {title}
        </button>
    );
}
