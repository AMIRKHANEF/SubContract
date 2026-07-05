import CryptoFiatBalance from "@/components/CryptoFiatBalance";
import Divider from "@/components/ui/Divider";
import SectionTitle from "@/components/ui/SectionTitle";
import { amountToHuman, formatDecimal } from "@/utils/amount";
import type { ContractTokenBalance } from "@/utils/types";
import { Fragment, useMemo } from "react";

interface Props {
    balances: ContractTokenBalance[] | undefined;
}

export default function ContractAsset({ balances }: Props) {
    const totalBalanceInDollar = useMemo(() => {
        if (!balances || balances.length === 0) return 0;

        const total = balances.reduce((acc, { balance, decimals, price }) => {
            const balanceInDollar = amountToHuman(balance, decimals);
            return acc + (parseFloat(balanceInDollar) * parseFloat(price))
        }, 0)

        return formatDecimal(total, 2, true, true);
    }, [balances]);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2 items-center">
                <SectionTitle text="Assets" />
                <p className="text-xsm font-normal text-text-secondary">${totalBalanceInDollar}</p>
            </div>
            <div className="flex flex-col gap-2 bg-bg-quinary p-2 px-3 rounded-sm">
                {balances?.map(({ symbol, balance, decimals, price }, index) => {
                    return (
                        <Fragment key={index}>
                            <div className="flex flex-row justify-between items-center">
                                <p className="text-sm font-medium">{symbol}</p>
                                <CryptoFiatBalance
                                    amount={balance}
                                    decimal={decimals}
                                    price={price}
                                />
                            </div>
                            {balances.length > (index + 1) &&
                                <Divider />
                            }
                        </Fragment>
                    );
                })}
            </div>
        </div>
    );
}
