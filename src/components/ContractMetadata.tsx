import type { ContractInfo } from "@/store/types";
import { toShortAddress } from "@/utils/utils";
import { Hammer, Layers, ShieldAlert, User } from "lucide-react";
import ScrollingTextBox from "./ui/ScrollingTextBox";

interface Props {
    info: ContractInfo | undefined;
}

const titleStyle = "text-xs font-medium text-text-muted";
const dataStyle = "text-xs text-text-primary";

export default function ContractMetadata({ info }: Props) {
    return (
        <div className="grid grid-cols-2 gap-2.5 mt-1 p-2.5 bg-bg-quinary rounded-md border border-border-primary">
            <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1">
                    <User size={13} className="text-accent-primary" />
                    <span className={titleStyle}>Deployer</span>
                </div>
                <p className={dataStyle}>
                    {info?.deployer ? toShortAddress(info.deployer, 6) : "N/A"}
                </p>
            </div>

            <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1">
                    <Hammer size={13} className="text-accent-primary" />
                    <span className={titleStyle}>Compiler</span>
                </div>
                <ScrollingTextBox
                    text={info?.compilerVersion || "N/A"}
                    className={dataStyle}
                    width={160}
                />
            </div>

            <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1">
                    <Layers size={13} className="text-accent-primary" />
                    <span className={titleStyle}>EVM / Target</span>
                </div>
                <ScrollingTextBox
                    text={info?.evmVersion || "shanghai"}
                    className={dataStyle + " uppercase"}
                    width={160}
                />
            </div>

            <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1">
                    <ShieldAlert size={13} className="text-accent-primary" />
                    <span className={titleStyle}>Deploy Date</span>
                </div>
                <p className={dataStyle}>
                    {info?.deployAt ? new Date(info.deployAt * 1000).toLocaleDateString() : "N/A"}
                </p>
            </div>
        </div>
    );
}
