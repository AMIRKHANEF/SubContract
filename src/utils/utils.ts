export const sanitizeChainName = (chainName: string | undefined) => {
    if (!chainName) {
        return chainName;
    }

    const sanitizedChainName = chainName
        .replace(' Relay Chain', '')
        .replace(' Network', '')
        .replace(' chain', '')
        .replace(' Chain', '')
        .replace(' Finance', '')
        .replace(' Testnet', '')
        .replace(' Main', '')
        .replace(/\s/g, '');

    return sanitizedChainName;
};
