import { configureStore } from "@reduxjs/toolkit";
import networkReducer from "./slices/networkSlice";
import contractsReducer from "./slices/contractsSlice";
import accountsReducer from "./slices/accountsSlice";
import navigationReducer from "./slices/navigationSlice";
import { loadStateFromStorage, saveStateToStorage } from "./util";
import { COLD_START_STATE } from "./cold-start";

// ─── Preload from localStorage ────────────────────────────────────────────────

const preloadedState = loadStateFromStorage();

if (preloadedState === undefined) {
    // Persist defaults right away so the next load is no longer a cold start
    saveStateToStorage(COLD_START_STATE);
    console.info("[store] Cold start — defaults applied and saved.");
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const store = configureStore({
    reducer: {
        network: networkReducer,
        contracts: contractsReducer,
        accounts: accountsReducer,
        navigation: navigationReducer
    },
    preloadedState,
});

// ─── Persist to localStorage on every state change ───────────────────────────
// Throttle to avoid excessive writes (every 300ms max)

let persistTimer: ReturnType<typeof setTimeout> | null = null;

store.subscribe(() => {
    if (persistTimer) return;
    persistTimer = setTimeout(() => {
        saveStateToStorage(store.getState());
        persistTimer = null;
    }, 300);
});

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;