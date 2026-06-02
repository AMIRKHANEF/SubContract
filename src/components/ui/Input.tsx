import { ClipboardList, ClipboardX } from "lucide-react"
import { useCallback, useMemo } from "react";
import { twMerge } from "tailwind-merge";

interface Props {
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onEnter?: () => void;
    style?: string;
    error?: boolean;
    showPasteIcon?: boolean;
}

export default function Input({ onChange, onEnter, placeholder, style, value, error = false, showPasteIcon = false, }: Props) {
    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && onEnter) {
            onEnter();
        }
    }, [onEnter]);

    const handlePaste = useCallback(async () => {
        try {
            const text = await navigator.clipboard.readText();

            onChange?.({ target: { value: text } } as React.ChangeEvent<HTMLInputElement>);
        } catch (error) {
            console.error(error);
        }
    }, [onChange]);

    const handleClear = useCallback(() => {
        onChange?.({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
    }, [onChange]);

    const hasValue = useMemo(() => Boolean(value && value.length > 0), [value]);

    return (
        <>
            <div className="relative flex items-center w-full">
                <input
                    key={error ? "error" : "normal"} /* re-mounts to retrigger animation */
                    className={twMerge(
                        `w-full h-10.5 border-default rounded-md bg-bg-primary
                        text-text-primary outline-none input-transition
                        placeholder:text-text-muted placeholder:text-xsm placeholder:font-extralight
                        focus:border-accent-primary focus:border-2`,

                        // Padding: more right padding when icon is shown
                        showPasteIcon ? "pl-3 pr-9" : "px-3",

                        // Error styles
                        error ? "border-red-500 border-2 text-red-500 input-wiggle" : "",
                        style
                    )}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onKeyDown={handleKeyDown}
                />

                {showPasteIcon && (
                    <button
                        type="button"
                        tabIndex={-1}
                        onClick={hasValue ? handleClear : handlePaste}
                        className="absolute right-2"
                        aria-label={hasValue ? "Clear input" : "Paste from clipboard"}
                    >
                        {hasValue ? <ClipboardX size={19} className="input-icon" /> : <ClipboardList size={19} className="input-icon" />}
                    </button>
                )}
            </div>
        </>
    );
}
