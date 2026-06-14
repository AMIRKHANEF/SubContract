/* eslint-disable @typescript-eslint/no-explicit-any */

import Collapse from "@/components/ui/Collapse";
import type { ParsedError, ParsedEvent, ParsedFunction, ParsedSpecialItem } from "@/utils/ABI/ABIParser";
import { type ReactNode } from "react";
import SignatureHeader from "./SignatureHeader";
import SignatureContent from "./SignatureContent";

export default function SignatureItem({ item }: { item: ParsedFunction }): ReactNode
export default function SignatureItem({ item }: { item: ParsedEvent }): ReactNode
export default function SignatureItem({ item }: { item: ParsedError }): ReactNode
export default function SignatureItem({ item }: { item: ParsedSpecialItem }): ReactNode
export default function SignatureItem({ item }: { item: any }): ReactNode {
    return (
        <Collapse
            collapseChildren={
                <SignatureHeader
                    name={item.name}
                    shortSignature={item.shortSignature}
                    state={item.stateMutability ?? item.kind}
                />}
            withChevron
            className="p-2.5"
        >
            <SignatureContent
                item={item}
            />
        </Collapse>
    );
}
