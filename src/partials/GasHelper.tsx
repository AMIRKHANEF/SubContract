import { useState } from "react";
import Button from "@/components/ui/Button";
import Divider from "@/components/ui/Divider";
import Input from "@/components/ui/Input";
import PopupTitle from "@/components/ui/PopupTitle";
import { PopUps } from "@/utils/constants";
import { Gauge, RefreshCw } from "lucide-react";
import DescriptionText from "@/components/ui/DescriptionText";
import useCoinPrice from "@/hooks/useCoinPrice";

const GWEI_TO_NATIVE_DECIMALS = 9;

export default function GasHelper({ setPopup }: { setPopup: React.Dispatch<React.SetStateAction<PopUps>> }) {
    const dotPrice = useCoinPrice("polkadot");

    const [gasLimit, setGasLimit] = useState<string>("21000");
    const [gasPrice, setGasPrice] = useState<string>("100");

    // Only holds a value once the user has typed a custom rate. Until then,
    // the displayed rate is derived straight from dotPrice below — no need
    // to copy it into state or an effect just to mirror it back out.
    const [customUsdRate, setCustomUsdRate] = useState<string>("");
    const [isCustomRate, setIsCustomRate] = useState(false);

    const isPriceLoading = dotPrice === null && !isCustomRate;
    const usdRate = isCustomRate ? customUsdRate : (dotPrice?.toString() ?? "");

    const handleUsdRateChange = (value: string) => {
        setIsCustomRate(true);
        setCustomUsdRate(value);
    };

    const resetToLivePrice = () => {
        setIsCustomRate(false);
    };

    const gasLimitNum = Math.max(0, parseFloat(gasLimit) || 0);
    const gasPriceNum = Math.max(0, parseFloat(gasPrice) || 0);
    const usdRateNum = Math.max(0, parseFloat(usdRate) || 0);

    // Gas price here is in Gwei, same convention as Ethereum: 1 Gwei = 10^9 wei,
    // and Asset Hub's EVM gas pricing follows the standard 18-decimal wei math,
    // so gasUsed * gasPriceGwei / 10^9 gives the fee directly in DOT.
    // (Note: this is different from DOT's own 10-decimal planck balance format —
    // that doesn't come into play in this particular conversion.)
    const rawFeeGwei = gasLimitNum * gasPriceNum;
    const dotFee = rawFeeGwei / 10 ** GWEI_TO_NATIVE_DECIMALS;
    const usdFee = dotFee * usdRateNum;

    return (
        <div className="flex flex-col w-[90vw] p-4.5 pt-3">
            <PopupTitle
                title="Gas & Fee Helper"
                onCloseButton={() => setPopup(PopUps.None)}
                Icon={<Gauge size={28} className="text-accent-primary" />}
            />
            <Divider className="my-2.5" />
            <DescriptionText
                description="Estimate transaction fees in gas units and native DOT/USD equivalent, factoring in Polkadot's unique 10-decimal system."
                className="mb-2.5"
            />

            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                    <label htmlFor="gas-limit" className="text-xs text-text-secondary">Gas Limit</label>
                    <Input
                        placeholder="e.g. 21000"
                        onChange={(e) => setGasLimit(e.target.value)}
                        value={gasLimit}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="gas-price" className="text-xs text-text-secondary">Gas Price (Gwei)</label>
                    <Input
                        placeholder="e.g. 100"
                        onChange={(e) => setGasPrice(e.target.value)}
                        value={gasPrice}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                        <label htmlFor="usd-rate" className="text-xs text-text-secondary">DOT Price (USD) - (Set 1 for PAS)</label>
                        {isCustomRate && dotPrice !== null && (
                            <button
                                type="button"
                                onClick={resetToLivePrice}
                                className="flex items-center gap-1 text-xs text-accent-primary hover:opacity-80"
                            >
                                <RefreshCw size={12} />
                                Use live price
                            </button>
                        )}
                    </div>
                    <Input
                        placeholder={isPriceLoading ? "Fetching live price…" : "e.g. 6.20"}
                        onChange={(e) => handleUsdRateChange(e.target.value)}
                        value={isPriceLoading ? "" : usdRate}
                    />
                </div>
            </div>

            <div className="mt-4 p-4.5 bg-bg-quinary rounded-md border border-border-primary flex flex-col gap-2">
                <div className="flex justify-between items-center">
                    <span className="text-text-secondary font-medium">Estimated Fee:</span>
                    <span className="text-sm font-bold text-accent-primary">{dotFee.toFixed(8)} DOT</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-text-secondary font-medium">USD Value:</span>
                    <span className="text-sm font-bold text-green-400">
                        {isPriceLoading ? "—" : `$${usdFee.toFixed(6)}`}
                    </span>
                </div>
            </div>

            <Button
                onClick={() => setPopup(PopUps.None)}
                title="Done"
                type="quaternary"
                className="mt-4"
            />
        </div>
    );
}
