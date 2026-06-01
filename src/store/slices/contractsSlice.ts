import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ContractState, Contract } from "../types";

const initialState: ContractState = {
    activeContract: null,
    watchedContracts: [],
};

const contractsSlice = createSlice({
    name: "contracts",
    initialState,
    reducers: {
        setActiveContract(state, action: PayloadAction<Contract>) {
            state.activeContract = action.payload;
        },
        clearActiveContract(state) {
            state.activeContract = null;
        },
        addWatchedContract(state, action: PayloadAction<Contract>) {
            const exists = state.watchedContracts.some(
                (c) => c.address === action.payload.address && c.chainGenesisHash === action.payload.chainGenesisHash
            );

            if (!exists) {
                state.watchedContracts.push(action.payload);
            }
        },
        removeWatchedContract(state, action: PayloadAction<Contract>) {
            const toRemoveAddr = action.payload.address;
            const toRemoveChain = action.payload.chainGenesisHash;

            if (state.activeContract?.address === toRemoveAddr && state.activeContract.chainGenesisHash === toRemoveChain) {
                state.activeContract = null;
            }

            state.watchedContracts = state.watchedContracts.filter(
                (c) =>
                    !(c.address === action.payload.address && c.chainGenesisHash === action.payload.chainGenesisHash)
            );
        },
        clearWatchedContracts(state) {
            state.watchedContracts = [];
        },
    },
});

export const {
    setActiveContract,
    clearActiveContract,
    addWatchedContract,
    removeWatchedContract,
    clearWatchedContracts,
} = contractsSlice.actions;

export default contractsSlice.reducer;
