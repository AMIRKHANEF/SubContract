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
    horizontal: "w-full h-px bg-border-primary",
    vertical: "w-px h-full bg-border-primary"
};
