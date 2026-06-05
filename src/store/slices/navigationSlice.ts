import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Direction, NavigationState, Page } from "../types";

const initialState: NavigationState = {
    currentPage: "Home",
    direction: 1 // "forward"
};

const navigationSlice = createSlice({
    name: "navigation",
    initialState,
    reducers: {
        navigateTo: (state, action: PayloadAction<{ to: Page, direction?: Direction }>) => {
            state.direction = (action.payload.direction ?? "forward") === "forward" ? 1 : -1;
            state.currentPage = action.payload.to;
        },
        goHome: (state) => {
            state.direction = -1; // "back"
            state.currentPage = "Home";
        },
    },
});

export const { navigateTo, goHome } = navigationSlice.actions;
export default navigationSlice.reducer;
