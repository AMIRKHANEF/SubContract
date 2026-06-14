import CopyButtonWithText from "@/components/CopyButtonWithText";
import Divider from "@/components/ui/Divider";
import ScrollingTextBox from "@/components/ui/ScrollingTextBox";
import type { ParsedError, ParsedEvent, ParsedFunction, ParsedParameter, ParsedSpecialItem } from "@/utils/ABI/ABIParser";
import type { ReactNode } from "react";

function SignaturePlace({ signature }: { signature: string }) {
    return (
        <div className="flex flex-row justify-between my-1.5">
            <ScrollingTextBox
                text={signature}
                width={285}
                textClassName="font-light text-2xs text-text-secondary"
                className="p-2 rounded-sm bg-bg-quinary"
                scrollOnHover
                preserveWidth
            />
            <CopyButtonWithText
                text={signature}
            />
        </div>
    );
}

const flagStyle = (isIndex: boolean) => {
    if (isIndex)
        return "bg-[#c850a01f] text-[#c060a0] border-[#c850a033]";
    else
        return "bg-[#5050781f] text-[#6060a0] border-[#50507833]";
}

function InOutPut({ items, type }: { items: ParsedParameter[]; type: string }) {
    if (items.length === 0) return null;

    return (
        <div className="flex flex-col gap-1.5">
            <p className="uppercase text-xs text-accent-secondary font-medium mb-1">
                {type}
            </p>
            {items.map((item, index) => {
                return (
                    <div className="flex flex-row gap-1.5">
                        <p className="text-accent-tertiary text-xs">{index}</p>
                        <p className="text-text-secondary text-xs">{item.type}</p>
                        <p className="text-text-secondary text-xs">{item.name ?? "Unnamed"}</p>
                        <p className={`border-default ${flagStyle(!!item.indexed)} p-0.5 text-xs rounded-xs mr-0 ml-auto`}>
                            {item.indexed ? "Indexed" : "Data"}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}

interface SignatureItemProps {
    item: ParsedFunction | ParsedEvent | ParsedError | ParsedSpecialItem;
}

export default function SignatureContent({ item }: SignatureItemProps): ReactNode {
    return (
        <div className="flex flex-col gap-2.5">
            <SignaturePlace signature={item.signature} />
            <InOutPut items={item.inputs} type={item.inputs?.[0]?.type === "event" ? "parameters" : "inputs"} />
            {![item.inputs.length, item.outputs.length].includes(0) &&
                <Divider className="bg-accent-secondary my-1" />
            }
            <InOutPut items={item.outputs} type={"returns"} />
        </div>
    );
}
