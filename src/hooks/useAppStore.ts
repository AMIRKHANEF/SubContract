import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../store/store";
import type { RootState } from "../store/types";

// ─── Typed hooks (use these everywhere instead of raw useDispatch/useSelector) ─

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T): T =>
    useSelector(selector);
