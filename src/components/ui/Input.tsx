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
            className={twMerge("input", style)}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
        />
    );
}
