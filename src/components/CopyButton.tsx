import { Copy } from "lucide-react";

export default function CopyButton({ text }: { text: string }) {
    return (
        <Copy
            onClick={() => navigator.clipboard.writeText(text)}
            size={24}
            className="p-1.5 rounded-md hover:bg-bg-hover cursor-pointer"
        />
    );
}
