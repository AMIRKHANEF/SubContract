import { twMerge } from "tailwind-merge";

interface Props {
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    style?: string;
}

export default function Input({ onChange, placeholder, style, value }: Props) {
    return (
        <input
            className={twMerge(`
                w-full h-10.5 px-3 border-default rounded-md bg-bg-primary
                text-text-primary outline-none input-transition
                placeholder:text-text-muted placeholder:text-xsm placeholder:font-extralight
                focus:border-accent-primary focus:border-2
            `, style)}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
        />
    );
}
