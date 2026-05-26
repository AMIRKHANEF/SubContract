import { useState, type ReactNode } from 'react';
import Card from './Card';
import { ChevronDownIcon } from "lucide-react";

interface Props {
    collapseChildren: ReactNode;
    children: ReactNode;
    withChevron?: boolean;
}

export default function Collapse({ children, collapseChildren, withChevron }: Props) {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <Card>
            {/* Header / Trigger */}
            <div
                className={'relative cursor-pointer -m-4.5 p-4.5' + (isOpen ? ' pb-0 mb-0' : '')}
                onClick={() => setIsOpen(!isOpen)}
            >
                {collapseChildren}
                {withChevron &&
                    <ChevronDownIcon
                        className={`absolute right-5 top-4 text-(--accent-primary) transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        fontSize={20}
                    />
                }
            </div>

            {/* Content Area */}
            <div
                className={`transition-all duration-normal ease-in-out ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}
            >
                {children}
            </div>
        </Card>
    );
};
