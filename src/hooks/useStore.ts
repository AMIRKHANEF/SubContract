import { useAppSelector, useAppDispatch } from "./useAppStore";
import { setSelectedChain, clearSelectedChain } from "../store/slices/networkSlice";
import { setActiveContract, clearActiveContract, addWatchedContract, removeWatchedContract, } from "../store/slices/contractsSlice";
import { setAccounts, addAccount, removeAccount, setActiveAccount, clearActiveAccount, } from "../store/slices/accountsSlice";
import type { Contract, Account } from "../store/types";
import type { Chain } from "@/utils/types";

// ─── Network ──────────────────────────────────────────────────────────────────

export function useNetwork() {
    const dispatch = useAppDispatch();
    const selectedChain = useAppSelector((s) => s.network.selectedChain);

    return {
        selectedChain,
        setSelectedChain: (chain: Chain) => dispatch(setSelectedChain(chain)),
        clearSelectedChain: () => dispatch(clearSelectedChain()),
    };
}

// ─── Contracts ────────────────────────────────────────────────────────────────

export function useContracts() {
    const dispatch = useAppDispatch();
    const activeContract = useAppSelector((s) => s.contracts.activeContract);
    const watchedContracts = useAppSelector((s) => s.contracts.watchedContracts);

    return {
        activeContract,
        watchedContracts,
        setActiveContract: (contract: Contract) => dispatch(setActiveContract(contract)),
        clearActiveContract: () => dispatch(clearActiveContract()),
        addWatchedContract: (contract: Contract) => dispatch(addWatchedContract(contract)),
        removeWatchedContract: (contract: Contract) => dispatch(removeWatchedContract(contract)),
    };
}

// ─── Accounts ─────────────────────────────────────────────────────────────────

export function useAccounts() {
    const dispatch = useAppDispatch();
    const accounts = useAppSelector((s) => s.accounts.accounts);
    const activeAccount = useAppSelector((s) => s.accounts.activeAccount);

    return {
        accounts,
        activeAccount,
        setAccounts: (list: Account[]) => dispatch(setAccounts(list)),
        addAccount: (account: Account) => dispatch(addAccount(account)),
        removeAccount: (address: string) => dispatch(removeAccount({ address })),
        setActiveAccount: (account: Account) => dispatch(setActiveAccount(account)),
        clearActiveAccount: () => dispatch(clearActiveAccount()),
    };
}
