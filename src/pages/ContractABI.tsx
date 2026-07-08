import DescriptionText from "@/components/ui/DescriptionText";
import PageTitle from "@/components/ui/PageTitle";
import { useContracts, useNavigation } from "@/hooks/useStore";
import ABIStructured from "@/partials/abi/ABIStructured";
import { ABITab, parseABI } from "@/utils/ABI/ABIParser";
import { BookText } from "lucide-react";
import { useMemo } from "react";

export default function ContractABI() {
    const { goHome } = useNavigation();
    const { activeContract } = useContracts();

    const parsedABI = useMemo(() => {
        if (!activeContract?.abi) return undefined;

        return parseABI(activeContract.abi);
    }, [activeContract]);

    const tabContent = useMemo(() => {
        if (!parsedABI) return undefined;

        return [
            { name: ABITab.Functions, count: parsedABI.stats.functions },
            { name: ABITab.Events, count: parsedABI.stats.events },
            { name: ABITab.Errors, count: parsedABI.stats.errors },
            { name: ABITab.Specials, count: parsedABI.stats.special }
        ];
    }, [parsedABI]);

    return (
        <div className="section-container max-h-screen overflow-y-auto">
            <PageTitle
                text="ABI Explorer"
                Icon={BookText}
                onBackButton={() => goHome()}
            />
            <DescriptionText
                description="Explore your contract ABI with all functions, events, and errors organized by signature, type, and state mutability."
            />
            {tabContent &&
                <ABIStructured
                    tabContent={tabContent}
                    parsedABI={parsedABI}
                />
            }
        </div>
    );
}
