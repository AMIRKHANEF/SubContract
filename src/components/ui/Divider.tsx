import { twMerge } from "tailwind-merge";

interface Props {
    orientation?: 'horizontal' | 'vertical';
    style?: string;
}

export default function Divider({ orientation = 'horizontal', style }: Props) {
    return (
        <hr
            className={twMerge(DividerStyle[orientation], style)}
        />
    );
}

const DividerStyle = {
    horizontal: "w-full h-px text-border-secondary",
    vertical: "w-px h-full text-border-secondary"
};
