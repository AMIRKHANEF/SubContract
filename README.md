<div align="center">
<img src="https://img.shields.io/badge/status-in%20development-ff69b4?style=for-the-badge" alt="Status: In Development"/>
<img src="https://img.shields.io/badge/built%20for-Polkadot%20Asset%20Hub-E6007A?style=for-the-badge&logo=polkadot&logoColor=white" alt="Built for Polkadot Asset Hub"/>
<img src="https://img.shields.io/badge/license-MIT-blue?style=for-the-badge" alt="MIT License"/>

<br/><br/>

```
 ____        _      ____            _                  _
/ ___| _   _| |__  / ___|___  _ __ | |_ _ __ __ _  ___| |_
\___ \| | | | '_ \| |   / _ \| '_ \| __| '__/ _` |/ __| __|
 ___) | |_| | |_) | |__| (_) | | | | |_| | | (_| | (__| |_
|____/ \__,_|_.__/ \____\___/|_| |_|\__|_|  \__,_|\___|\__|
```

**A browser-native Solidity smart contract workspace for Polkadot developers.**

*Every tool you reach for daily — in one place, always one click away.*

[Features](#-features) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [Roadmap](#-roadmap) · [Contributing](#-contributing)

---

</div>

## What is SubContract?

SubContract is a **Chrome browser extension** built for Solidity developers working on **Polkadot Asset Hub** — the parachain that brings EVM-compatible smart contracts to the Polkadot ecosystem.

Polkadot's EVM environment is not Ethereum. There are meaningful differences in address formats, fee structures, native precompiles, and cross-chain mechanics that existing Ethereum tooling doesn't understand. Developers currently juggle multiple block explorers, conversion tools, documentation tabs, and custom scripts just to get through a normal development session.

SubContract collapses that workflow into a single, persistent browser companion. It knows the difference between an SS58 and an H160 address. It understands Asset Hub precompiles. It warns you about concepts like existential deposit that simply don't exist on Ethereum. And it does all of this without requiring a login, a private key, a backend, or a subscription.

---

## ✨ Features

### Contract Workspace

| Feature | Description |
|---|---|
| **Contract Watchlist** | Save any contract address locally. Switch between watched contracts in one click — no copy-pasting addresses every session. |
| **Chain Selector** | Switch between Polkadot Asset Hub (mainnet) and Paseo Asset Hub (testnet). Persisted per contract. |
| **Contract Dashboard** | Contract name, verification status, deployer address, deploy date, transaction count, and event count — all in one view. |
| **ABI Viewer** | Browse all functions and events. Copy full ABI or individual signatures. Fully searchable. |
| **Recent Activity Feed** | Latest transactions with decoded function names — not raw transaction hashes. |
| **Explorer Shortcuts** | One-click links to SubScan, copy address, view deploy transaction. |

### Polkadot-Native Utilities

| Feature | Description |
|---|---|
| **SS58 ↔ H160 Converter** | Convert between Substrate and EVM address formats instantly. |
| **Existential Deposit Warning** | Displays a warning badge when a contract's balance approaches the existential deposit threshold. This concept does not exist on Ethereum — Polkadot developers can lose a contract if its balance drops too low. |
| **Gas & Fee Helper** | Estimates fees in gas units and DOT/USD equivalent. Explicitly handles DOT's 10 decimal places, a common source of confusion for developers coming from Ethereum. |

### Developer Utilities

| Feature | Description |
|---|---|
| **Function Selector Decoder** | Paste a 4-byte selector (e.g. `0xa9059cbb`) and instantly see the matching function signature. |
| **Event Topic Hash Lookup** | Compute the `keccak256` hash of any event signature. A lookup developers run constantly and currently have to google every time. |
| **Calldata Decoder** | Paste raw calldata and decode its parameters using the contract's ABI. |
| **Revert Reason Decoder** | Paste a failed transaction hash and get a human-readable revert reason — currently a painful process on Asset Hub. |
| **Unit Converters** | Wei ↔ token amount, hex ↔ UTF-8, Unix timestamp ↔ human-readable date. |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [React 18](https://react.dev) with [TypeScript](https://www.typescriptlang.org) |
| **Build Tool** | [Vite](https://vitejs.dev) + [CRXJS](https://crxjs.dev/vite-plugin) for Chrome Extension support |
| **State Management** | [Redux Toolkit](https://redux-toolkit.js.org) |
| **Persistence** | Chrome `localStorage` + `chrome.storage.local` |
| **Styling** | [Tailwind CSS](https://tailwindcss.com) . [Headless UI](https://headlessui.com) |
| **EVM / Blockchain** | [viem](https://viem.sh) — modern, TypeScript-first EVM library |
| **Data Sources** | [@polkadot-api](papi.how) (primary), [SubScan API](https://pro.subscan.io) |

### Architecture principles

- **Local-first** — all state lives in the browser. No user data ever leaves the device.
- **No authentication** — the extension works immediately after installation, no account required.
- **No private keys** — SubContract is entirely watch-only. It cannot sign transactions.
- **No backend infrastructure** — all data is fetched directly from public APIs and RPC endpoints.
- **Graceful degradation** — if an API is unavailable, the rest of the extension continues to function.

---

## 🚀 Getting Started

> The extension is currently in active development and has not yet been published to the Chrome Web Store. You can run it locally by loading it as an unpacked extension.

### Prerequisites

- [Node.js](https://nodejs.org) v18 or higher
- [pnpm](https://pnpm.io) (recommended) or npm

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/AMIRKHANEF/subcontract.git
cd subcontract
```

**2. Install dependencies**

```bash
pnpm install
```

**3. Build the extension**

```bash
pnpm build
```

This generates a `dist` directory — the compiled extension ready to be loaded.

**4. Load into Chrome**

1. Open Chrome and navigate to `chrome://extensions`
2. Enable **Developer mode** using the toggle in the top-right corner
3. Click **"Load unpacked"**
4. Select the `dist` folder from this repository
5. SubContract will appear in your extensions list and toolbar

**5. Development mode (with hot reload)**

```bash
pnpm dev
```

> No need to add another extension/folder as an unpacked extension. Changes will hot-reload automatically.

---

## 🗺 Roadmap

### v1 — Core Workspace *(90%)*
The first release focuses on establishing the fundamental workflow: watch contracts, understand them, and have the right utility tools always at hand.

- [x] Project scaffolding and architecture
- [x] Chain selector (Asset Hub mainnet + Paseo testnet)
- [x] Contract watchlist with local persistence
- [x] SS58 ↔ H160 address converter
- [x] ABI viewer with search and copy
- [x] Contract dashboard (verification, deployer, stats)
- [x] Recent activity feed with decoded function names
- [x] Event topic hash lookup
- [x] Calldata decoder
- [x] Revert reason decoder
- [x] Gas & fee helper (DOT/USD)
- [ ] Existential deposit warning
- [ ] Unit converters
- [x] Explorer shortcuts (SubScan)

### v2 — Deeper Tooling *(current)*
- [x] Asset Hub precompile registry — browse and call native precompiles
- [ ] Watch-only account monitoring — track deployer wallets
- [ ] ABI diff — compare interfaces between two contract addresses
- [x] Event log filtering by event type
- [x] Constructor arguments viewer

### v3 — Developer Workflow Automation
- [ ] XCM origin badge — visually flag cross-chain transactions
- [ ] Local activity alerts via Chrome notifications
- [ ] Hardhat / Foundry plugin — auto-register deployed contracts

---

## 🤝 Contributing

SubContract is open source and welcomes contributions. If you're a Polkadot or Solidity developer and something is missing or broken, please open an issue.

```bash
# Fork the repo, then:
git checkout -b feature/your-feature-name
pnpm dev
# Make your changes
git commit -m "feat: your feature description"
git push origin feature/your-feature-name
# Open a pull request
```

---

## 📄 License

MIT — see [LICENSE](./LICENSE) for details.

---

<div align="center">

Built with care for the Polkadot developer ecosystem.

*If you find SubContract useful, consider starring the repo — it will cheer me up.*

</div>
