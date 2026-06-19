import Badge from "@/components/ui/Badge";
import ScrollingTextBox from "@/components/ui/ScrollingTextBox";
import { toShortAddress } from "@/utils/utils";

interface Props {
    contractName: string | undefined;
    contractAddress: string;
    isVerified: boolean;
}

export default function ContractInfo({ contractAddress, contractName, isVerified }: Props) {
    return (
        <div className="flex flex-row justify-between">
            <div className="flex flex-col">
                {contractName &&
                    <ScrollingTextBox
                        text={contractName}
                        className="text-lmd font-bold"
                        scrollOnHover
                        width={230}
                    />
                }
                <p className="text-xsm font-light text-text-secondary">{toShortAddress(contractAddress, 6)}</p>
            </div>
            <Badge
                text={isVerified ? "Verified" : "Unverified"}
                type={isVerified ? "success" : "error"}
            />
        </div>
    );
}
