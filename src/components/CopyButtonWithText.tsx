import { useState } from "react";
import { twMerge } from "tailwind-merge";

export default function CopyButtonWithText({ text }: { text: string }) {
    const [copied, setCopied] = useState<boolean>(false);

    const copy = () => {
        navigator.clipboard.writeText(text).catch(console.error);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

    return (
        <button
            className={
                twMerge(
                    `font-syne text-3xs font-semibold tracking-[0.08em] bg-[#1a1a2e] text-[#5a5a8a] w-fit whitespace-nowrap
                    border border-[#2a2a4a] rounded-[3px] px-2 py-0.75 cursor-pointer fast-transition`,
                    copied ? "text-[#40c080] border-[#20a060]" : "hover:text-[#9090c0] hover:border-[#4040a0]"
                )}
            onClick={copy}
        >
            {copied ? "✓ COPIED" : "COPY"}
        </button>
    );
}
