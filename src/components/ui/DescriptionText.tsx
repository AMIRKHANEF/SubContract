import { twMerge } from "tailwind-merge";

interface Props {
    description: string;
    className?: string;
}

export default function DescriptionText({ description, className }: Props) {
    return (
        <p className={twMerge("text-sm font-extralight text-text-primary p-2.5", className)}>
            {description}
        </p>
    );
}
