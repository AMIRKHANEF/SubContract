import { SUPPORTED_CHAINS } from "@/utils/constants";
import type { RootState } from "./types";
import { initialState as navigationInitState } from "./slices/navigationSlice";

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
    navigation: navigationInitState
};
