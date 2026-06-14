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

function InOutPut({ items, type }: { items: ParsedParameter[]; type: "parameters" | "inputs" | "returns" }) {
    if (items.length === 0 && type === "returns") return null;

    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex flex-row items-center gap-1.5 mb-1">
                <p className="uppercase text-xs text-accent-secondary font-medium w-fit">
                    {type}
                </p>
                <p className="uppercase text-xs text-accent-secondary font-medium w-fit">
                    {items.length}
                </p>
                <Divider className="flex-1 text-accent-secondary/20" />
            </div>
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
            {items.length === 0 &&
                <div className="flex flex-row gap-1.5">
                    <p className="text-accent-tertiary text-xs">-</p>
                    <p className="text-text-secondary text-xs">no parameters</p>
                </div>
            }
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
