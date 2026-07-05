import Card from "@/components/ui/Card";
import { useContracts } from "@/hooks/useStore";
import ContractInfo from "./ContractInfo";
import RecentActivity from "./RecentActivity";
import ContractAsset from "./ContractAssets";

export default function ContractDashboard() {
    const { activeContract } = useContracts();

    if (!activeContract) return null;

    const { abi, activities, address, balances, info } = activeContract;

    const isVerified = !!abi;

    return (
        <Card className="flex flex-col gap-3.75">
            <ContractInfo
                contractAddress={address}
                contractName={info?.contractName}
                isVerified={isVerified}
            />
            <ContractAsset
                balances={balances}
            />
            <RecentActivity
                activities={activities}
                info={info}
            />
        </Card>
    );
}

{/*
    <div role="status" className="flex flex-col animate-pulse w-full">
        <div className="flex items-center justify-between">
            <div className="h-4 w-35 bg-gray-600/30 rounded-xs" />
            <div className="h-5 w-14 bg-gray-600/30 rounded-lg" />
        </div>
        <div className="h-3 w-25 bg-gray-600/30 rounded-xs mt-1.5 mb-3.5" />
        <div className="flex flex-row items-center justify-between" >
            <div className="h-20 w-28 bg-gray-600/30 rounded-xl" />
            <div className="h-20 w-28 bg-gray-600/30 rounded-xl" />
            <div className="h-20 w-28 bg-gray-600/30 rounded-xl" />
        </div>
        <div className="h-4 w-35 bg-gray-600/30 rounded-xs my-4" />
        <div className="h-15 w-full bg-gray-600/30 rounded-xl mb-3" />
        <div className="h-15 w-full bg-gray-600/30 rounded-xl" />
    </div>
*/}
