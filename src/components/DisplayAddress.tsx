import type { FormattedType } from "@/partials/AccountTransform";
import { useMemo } from "react";
import EthereumLogo from "@/assets/pngs/EthereumLogo";
import PolkadotLogo from "@/assets/pngs/PolkadotLogo";
import ScrollingTextBox from "./ui/ScrollingTextBox";
import CopyButton from "./CopyButton";

interface Props {
    formattedAddress: FormattedType;
}

export default function DisplayAddress({ formattedAddress }: Props) {
    const Icon = useMemo(() =>
        formattedAddress.chain === "Polkadot"
            ? PolkadotLogo
            : formattedAddress.chain === "Revive" 
                ? EthereumLogo
                : EthereumLogo, [formattedAddress.chain]); // TODO: replace EthereumLogo with KeyLogo

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2 w-fit items-center">
                <Icon className={"w-7 h-7"} />
                <p>{formattedAddress.chain}</p>
            </div>
            <div className="flex flex-row items-center justify-between">
                <ScrollingTextBox
                    text={formattedAddress.address}
                    width={300}
                    className="text-2xs font-extralight text-text-primary"
                    scrollOnHover
                />
                <CopyButton text={formattedAddress.address} />
            </div>
        </div>
    );
}
