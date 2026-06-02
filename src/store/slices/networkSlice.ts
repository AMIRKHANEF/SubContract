import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { NetworkState } from "../types";
import type { Chain } from "@/utils/types";

const initialState: NetworkState = {
    selectedChain: null,
};

const networkSlice = createSlice({
    name: "network",
    initialState,
    reducers: {
        setSelectedChain(state, action: PayloadAction<Chain>) {
            state.selectedChain = action.payload;
        },
        clearSelectedChain(state) {
            state.selectedChain = null;
        },
    },
});

export const { setSelectedChain, clearSelectedChain } = networkSlice.actions;
export default networkSlice.reducer;
