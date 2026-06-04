import { twMerge } from "tailwind-merge";

interface Props {
    orientation?: 'horizontal' | 'vertical';
    className?: string;
}

export default function Divider({ orientation = 'horizontal', className }: Props) {
    return (
        <hr
            className={twMerge(DividerStyle[orientation], className)}
        />
    );
}

const DividerStyle = {
    horizontal: "w-full h-px text-border-secondary",
    vertical: "w-px h-full text-border-secondary"
};
