import type { ReactNode } from "react";
import { XCircle } from "lucide-react";

interface Props {
    title: string;
    Icon?: ReactNode;
    placement?: "left" | "right";
    onCloseButton?: () => void;
}

export default function PopupTitle({ title, onCloseButton, placement = "left", Icon }: Props) {
    return (
        <div className={`relative w-full h-fit flex items-center justify-center gap-2 ${placement === "right" ? "flex-row-reverse" : "flex-row"}`}>
            {Icon}
            <p className="text-title">
                {title}
            </p>
            {onCloseButton &&
                <XCircle
                    size={32}
                    className="absolute cursor-pointer right-0 top-1 rounded-full p-1 text-text-muted stroke-3 hover:bg-bg-hover"
                    onClick={onCloseButton}
                />
            }
        </div>
    );
}
