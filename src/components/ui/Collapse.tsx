import { useState, type ReactNode } from 'react';
import Card from './Card';
import { ChevronDownIcon } from "lucide-react";
import { twMerge } from 'tailwind-merge';

interface CollapseContentType {
    isOpen: boolean;
    children: ReactNode;
    className?: string;
}

export function CollapseContent({ children, className, isOpen }: CollapseContentType) {
    return (
        <div
            className={twMerge(`transition-all duration-200 ease-in-out px-4.5
                    ${isOpen ? 'pb-4.5 max-h-screen opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`, className)}
        >
            <>
                {children}
            </>
        </div>
    );
}

interface Props {
    collapseChildren: ReactNode;
    children: ReactNode;
    withChevron?: boolean;
}

export default function Collapse({ children, collapseChildren, withChevron }: Props) {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <Card className='p-0'>
            {/* Header / Trigger */}
            <div
                className={'relative cursor-pointer p-4.5'}
                onClick={() => setIsOpen(!isOpen)}
            >
                {collapseChildren}
                {withChevron &&
                    <ChevronDownIcon
                        className={`absolute right-5 top-4 text-(--accent-primary) transform transition-transform
                            ${isOpen ? 'rotate-180' : ''}`}
                        fontSize={20}
                    />
                }
            </div>

            {/* Content Area */}
            <CollapseContent isOpen={isOpen}>
                {children}
            </CollapseContent>
        </Card>
    );
};
