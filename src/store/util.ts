import { STORAGE_KEY } from "@/utils/constants";
import type { RootState } from "./types";

// ─── Save ─────────────────────────────────────────────────────────────────────

export function saveStateToStorage(state: RootState): void {
    try {
        const serialized = JSON.stringify(state);

        localStorage.setItem(STORAGE_KEY, serialized);
    } catch (err) {
        console.error("[STORAGE] Failed to save state:", err);
    }
}

// ─── Load ─────────────────────────────────────────────────────────────────────

export function loadStateFromStorage(): RootState | undefined {
    try {
        const serialized = localStorage.getItem(STORAGE_KEY);

        if (!serialized) return undefined;

        return JSON.parse(serialized) as RootState;
    } catch (err) {
        console.error("[STORAGE] Failed to load state:", err);
        return undefined;
    }
}

// ─── Clear ────────────────────────────────────────────────────────────────────

export function clearStorage(): void {
    localStorage.removeItem(STORAGE_KEY);
}
