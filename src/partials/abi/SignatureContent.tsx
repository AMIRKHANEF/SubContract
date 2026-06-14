import CopyButtonWithText from "@/components/CopyButtonWithText";
import Divider from "@/components/ui/Divider";
import type { ParsedError, ParsedEvent, ParsedFunction, ParsedParameter, ParsedSpecialItem } from "@/utils/ABI/ABIParser";
import { Fragment, type ReactNode } from "react";
import { BuildColoredSig, functionVariableNameColor, functionVariableTypeColor } from "./Buildcoloredsig";
import { twMerge } from "tailwind-merge";

function SignaturePlace({ item }: { item: ParsedFunction | ParsedEvent | ParsedError | ParsedSpecialItem }) {
    return (
        <div className="flex flex-row justify-between my-1.5">
            <BuildColoredSig
                type={(item as unknown as { type: string }).type}
                inputs={item.inputs}
                name={item.name}
                outputs={item.outputs}
            />
            <CopyButtonWithText
                text={item.signature}
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
                    <Fragment key={index}>
                        <div className="flex flex-row gap-1.5 items-center h-5">
                            <p className="text-accent-tertiary text-xs">{index}</p>
                            <p className={twMerge("text-text-secondary text-xs", functionVariableTypeColor)}>
                                {item.type}
                            </p>
                            <p className={twMerge("text-text-secondary text-xs", functionVariableNameColor)}>
                                {item.name ?? "Unnamed"}
                            </p>
                            {type === "parameters" &&
                                <p className={twMerge("border-default px-0.75 py-px text-xs rounded-xs ml-1", flagStyle(!!item.indexed))}>
                                    {item.indexed ? "indexed" : "data"}
                                </p>}
                        </div>
                        {(index + 1) !== items.length &&
                            <Divider className="text-accent-secondary/20" />
                        }
                    </Fragment>
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
    console.log('item:', item)
    return (
        <div className="flex flex-col gap-2.5">
            <SignaturePlace item={item} />
            <InOutPut items={item.inputs} type={item.kind === "event" ? "parameters" : "inputs"} />
            {![item.inputs.length, item.outputs.length].includes(0) &&
                <Divider className="bg-accent-secondary my-1" />
            }
            <InOutPut items={item.outputs} type={"returns"} />
        </div>
    );
}
