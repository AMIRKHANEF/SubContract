import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AccountState, Account } from "../types";

const initialState: AccountState = {
    accounts: [],
    activeAccount: null,
};

const accountsSlice = createSlice({
    name: "accounts",
    initialState,
    reducers: {
        setAccounts(state, action: PayloadAction<Account[]>) {
            state.accounts = action.payload;
        },
        addAccount(state, action: PayloadAction<Account>) {
            const exists = state.accounts.some((a) => a.address === action.payload.address);

            if (!exists) {
                state.accounts.push(action.payload);
            }
        },
        removeAccount(state, action: PayloadAction<{ address: string }>) {
            state.accounts = state.accounts.filter((a) => a.address !== action.payload.address);

            if (state.activeAccount?.address === action.payload.address) {
                state.activeAccount = null;
            }
        },
        setActiveAccount(state, action: PayloadAction<Account>) {
            state.activeAccount = action.payload;
        },
        clearActiveAccount(state) {
            state.activeAccount = null;
        },
        clearAccounts(state) {
            state.accounts = [];
            state.activeAccount = null;
        },
    },
});

export const {
    setAccounts,
    addAccount,
    removeAccount,
    setActiveAccount,
    clearActiveAccount,
    clearAccounts,
} = accountsSlice.actions;

export default accountsSlice.reducer;
