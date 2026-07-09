import { useState, type ReactNode } from "react";
import { ChevronUpIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface Props {
    children: ReactNode;
    defaultOpen?: boolean;
}

export default function DrawerCollapse({ children, defaultOpen = false }: Props) {
    const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);

    return (
        <>
            {/* Fade background */}
            <div
                onClick={() => setIsOpen(false)}
                className={twMerge(
                    "fixed inset-0 h-screen w-screen bg-black/15 backdrop-blur-[1.5px] z-1 fast-transition",
                    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
            />
            <div className="relative flex flex-col w-full">
                {/* The absolute half circle toggle with top arrow */}
                <div className="absolute left-1/2 -top-6 -translate-x-1/2 z-40">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-12 h-6 bg-bg-secondary border border-border-primary rounded-t-full flex items-center justify-center cursor-pointer hover:bg-bg-hover fast-transition shadow-lg"
                        style={{ borderBottom: "none" }}
                    >
                        <ChevronUpIcon
                            className={twMerge(
                                "text-accent-primary transform transition-transform duration-300 mt-0.5 animate-pulse",
                                isOpen ? "rotate-180" : ""
                            )}
                            size={20}
                        />
                    </button>
                </div>

                {/* Collapsible Drawer Content Panel */}
                <div
                    className={twMerge(
                        "w-full bg-bg-secondary border-t border-border-primary transition-all duration-300 ease-in-out px-4.5 overflow-hidden shadow-2xl relative z-30",
                        isOpen ? "max-h-95 py-4" : "max-h-0 py-0"
                    )}
                >
                    <div className="max-h-90 overflow-y-auto pr-1">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}
