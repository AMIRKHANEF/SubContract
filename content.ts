import type { Page } from "@/store/types";
import { PopUps } from "@/utils/constants";

export const features = [
  {
    title: 'Gas Helper',
    description: 'Estimate gas & fees',
    icon: '⛽',
    popup: PopUps.GasHelper
  },
  {
    title: 'Selector Lookup',
    description: 'Decode selectors',
    icon: '🔍',
    popup: PopUps.SelectorLookUp
  },
  {
    title: 'Account Transform',
    description: 'SS58 ⇔ H-160',
    icon: '↔️',
    popup: PopUps.AccountTransform
  },
];

export const pages = [
  {
    title: 'ABI Explorer',
    description: 'Inspect contract ABI',
    icon: '📦',
    path: "AbiExplore" as Page
  }
];

