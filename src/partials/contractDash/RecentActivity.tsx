import TxStatusBadge from "@/components/TxStatusBadge";
import Box from "@/components/ui/Box";
import ScrollingTextBox from "@/components/ui/ScrollingTextBox";
import SectionTitle from "@/components/ui/SectionTitle";
import type { ContractActivity, ContractInfo } from "@/store/types";
import { findMethodName, toShortAddress } from "@/utils/utils";

interface Props {
    activities: ContractActivity[] | undefined;
    info: ContractInfo | undefined;
}

export default function RecentActivity({ activities, info }: Props) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2 items-center">
                <SectionTitle text="Recent Activity" />
                <p className="text-xsm font-normal text-text-secondary">({activities?.length ?? 0})</p>
            </div>
            {activities?.map((activity) => {
                return (
                    <Box className="flex flex-row gap-3.5 items-center" key={activity.hash}>
                        <TxStatusBadge isSuccessful={activity.success} />
                        <div className="flex flex-col">
                            <ScrollingTextBox
                                text={findMethodName(info?.methodIdentifiers, activity.method) ?? "Unknown Method"}
                                width={210}
                                className="text-xsm font-medium"
                                scrollOnHover
                            />
                            <p className="text-2xs font-light text-text-secondary">{toShortAddress(activity.from, 6)}</p>
                        </div>
                    </Box>
                );
            })}
        </div>
    );
}
