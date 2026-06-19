import { amountToHuman, formatDecimal } from "@/utils/amount";
import { useMemo } from "react";

interface Props {
    amount: string | number | undefined;
    decimal: number | undefined;
    price: string | undefined;
}

export default function CryptoFiatBalance({ amount, decimal, price }: Props) {
    const cryptoFiat = useMemo(() => {
        if (!amount || !decimal || !price) return undefined; // { crypto: undefined, fiat: undefined }

        const crypto = amountToHuman(amount, decimal, undefined, true);
        const fiat = formatDecimal(parseFloat(crypto) * parseFloat(price), undefined, true);

        return { crypto, fiat };
    }, [amount, decimal, price]);

    if (!cryptoFiat) return null;

    return (
        <div className="flex flex-col items-end">
            <p className="text-smd font-medium">{cryptoFiat.crypto}</p>
            <p className="text-2xs font-light text-text-secondary">${cryptoFiat.fiat}</p>
        </div>
    );
}
