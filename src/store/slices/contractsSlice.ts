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
        updateContractInfo(state, action: PayloadAction<Partial<Contract>>) {
            const patch = action.payload;

            if (
                state.activeContract &&
                state.activeContract.address === patch.address &&
                state.activeContract.chainGenesisHash === patch.chainGenesisHash
            ) {
                state.activeContract = {
                    ...state.activeContract,
                    ...patch,
                };
            }

            const index = state.watchedContracts.findIndex(c =>
                c.address === patch.address &&
                c.chainGenesisHash === patch.chainGenesisHash
            );

            if (index !== -1) {
                state.watchedContracts[index] = {
                    ...state.watchedContracts[index],
                    ...patch,
                };
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
