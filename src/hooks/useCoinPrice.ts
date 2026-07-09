import { useEffect, useState } from "react";

export default function useCoinPrice(coinId: string) {
    const [price, setPrice] = useState<number | null>(null);

    useEffect(() => {
        fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`, { headers: { "X-CoinGecko-Api-Key": process.env.COINGECKO_API_KEY || "" } })
            .then((response) => response.json())
            .then((data) => {
                setPrice(data[coinId].usd);
                // console.log(`Price of ${coinId}:`, data[coinId].usd);
            })
            .catch((error) => {
                console.error("Error fetching coin price:", error);
            });
    }, [coinId]);

    return price;
}
