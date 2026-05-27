import { twMerge } from "tailwind-merge";

interface Props {
    children?: React.ReactNode;
    style?: string;
}

export default function Card({ children, style }: Props) {
    return (
        <div className={twMerge("bg-bg-secondary border-default rounded-lg p-4 shadow-md card-transition hover:border-border-secondary", style)}>
            {children}
        </div>
    );
}
