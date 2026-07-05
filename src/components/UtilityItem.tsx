import type { ReactNode } from "react";
import Box from "./ui/Box";

interface Props {
    title: string;
    description: string;
    icon: ReactNode;
    onClick: () => void;
}

export default function UtilityItem({ description, icon, onClick, title }: Props) {
    return (
        <Box onClick={onClick}>
            <div className="utility-icon">{icon}</div>
            <p className="mt-1 text-sm font-semibold">
                {title}
            </p>
            <p className="mt-0.5 text-xs font-light text-text-secondary">
                {description}
            </p>
        </Box>
    );
}
