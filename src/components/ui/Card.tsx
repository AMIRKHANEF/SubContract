import { twMerge } from "tailwind-merge";

interface Props {
    children?: React.ReactNode;
    style?: string;
}

export default function Card({ children, style }: Props) {
    return (
        <div className={twMerge("card", style)}>
            {children}
        </div>
    );
}
