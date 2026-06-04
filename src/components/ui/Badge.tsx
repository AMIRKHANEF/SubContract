import { twMerge } from "tailwind-merge"

interface Props {
    className?: string;
    text?: string;
    type: 'success' | 'error' | 'warning' | 'info';
}

export default function Badge({ text, type, className }: Props) {
    return (
        <div className={twMerge(`
            inline-flex items-center justify-center py-1
            px-2.5 rounded-[999px] text-xs font-medium
            ${variants[type]}
        `, className)}>
            {text}
        </div>
    );
}

const variants = {
    success: 'bg-success/10 text-success',
    error: 'bg-error/10 text-error',
    warning: 'bg-warning/10 text-warning',
    info: 'bg-info/10 text-info',
};
