import { SUPPORTED_CHAINS } from "@/utils/constants";
import type { RootState } from "./types";

// ─── Cold Start State ─────────────────────────────────────────────────────────

export const COLD_START_STATE: RootState = {
    network: {
        selectedChain: SUPPORTED_CHAINS[0],
    },
    contracts: {
        activeContract: null,
        watchedContracts: [],
    },
    accounts: {
        accounts: [],
        activeAccount: null,
    },
};
