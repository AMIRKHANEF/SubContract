import { twMerge } from "tailwind-merge"

interface Props {
    style?: string;
    text?: string;
}

export default function Badge({ text, style }: Props) {
    return (
        <div className={twMerge("badge", style)}>
            {text}
        </div>
    );
}
