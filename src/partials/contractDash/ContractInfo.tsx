import Badge from "@/components/ui/Badge";
import ScrollingTextBox from "@/components/ui/ScrollingTextBox";
import { useNavigation } from "@/hooks/useStore";
import { toShortAddress } from "@/utils/utils";
import { BookOpen } from "lucide-react";

interface Props {
    contractName: string | undefined;
    contractAddress: string;
    isVerified: boolean;
}

export default function ContractInfo({ contractAddress, contractName, isVerified }: Props) {
    const { navigateTo } = useNavigation();

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
            <div className="flex flex-row items-center gap-1.5">
                {isVerified &&
                    <button
                        onClick={() => navigateTo("ContractABI")}
                        title="View Structured ABI (Short: g, a)"
                        className="p-1.5 bg-bg-tertiary hover:bg-bg-hover text-accent-primary hover:text-accent-primary-hover rounded-md fast-transition border border-border-primary flex items-center justify-center cursor-pointer relative"
                    >
                        <BookOpen size={16} />
                    </button>
                }
                <Badge
                    text={isVerified ? "Verified" : "Unverified"}
                    type={isVerified ? "success" : "error"}
                />
            </div>
        </div>
    );
}
