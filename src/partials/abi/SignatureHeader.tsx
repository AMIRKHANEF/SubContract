import ScrollingTextBox from "@/components/ui/ScrollingTextBox";
import Badge from "./Badge";
import type { StateType } from "@/utils/ABI/ABIParser";

interface SignatureHeaderProps {
    state: StateType;
    // shortSignature: string;
    name: string;
}

export default function SignatureHeader({ name, state }: SignatureHeaderProps) {
    return (
        <div className="flex flex-row items-center gap-2">
            <Badge state={state} />
            <ScrollingTextBox
                text={name}
                width={260}
                textClassName="font-medium text-sm font-['JetBrains_Mono', monospace]"
                scrollOnHover
                preserveWidth
            />
            {/* <ScrollingTextBox
                text={shortSignature}
                width={170}
                textClassName="font-light text-xs text-text-muted"
                scrollOnHover
            /> */}
        </div>
    );
}
