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
        updateContractInfo(state, action: PayloadAction<Contract>) {
            const updatedContract = action.payload;

            // Update activeContract if it matches the updated contract
            if (
                state.activeContract &&
                state.activeContract.address === updatedContract.address &&
                state.activeContract.chainGenesisHash === updatedContract.chainGenesisHash
            ) {
                state.activeContract = updatedContract;
            }

            // Update contract in watched list if it matches the updated contract
            const contractToUpdateIndex = state.watchedContracts.findIndex(({ address, chainGenesisHash }) =>
                address === updatedContract.address && chainGenesisHash === updatedContract.chainGenesisHash
            );

            if (contractToUpdateIndex !== -1) {
                state.watchedContracts[contractToUpdateIndex] = updatedContract;
            }
        }
    },
});

export const {
    setActiveContract,
    clearActiveContract,
    addWatchedContract,
    removeWatchedContract,
    clearWatchedContracts,
    updateContractInfo
} = contractsSlice.actions;

export default contractsSlice.reducer;
