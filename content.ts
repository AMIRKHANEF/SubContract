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
  },
  {
    title: 'Precompiles Hub',
    description: 'Precompiled contracts',
    icon: '📃',
    path: "PrecompilesHub" as Page
  },
  {
    title: 'ABI Diff Tool',
    description: 'Compare contract interfaces',
    icon: '⚖️',
    path: "AbiDiff" as Page
  }
];

// Complete high-fidelity Precompile specs based on official Polkadot Revive Pallet documentation
export const PRECOMPILES_DATA = [
  {
    category: "Ethereum Native",
    items: [
      {
        address: "0x0000000000000000000000000000000000000001",
        name: "ECRecover",
        description: "Recovers the Ethereum address associated with a public key signature. Computes ECDSA cryptographic operations natively.",
        interface: "function ecrecover(bytes32 hash, uint8 v, bytes32 r, bytes32 s) external view returns (address);"
      },
      {
        address: "0x0000000000000000000000000000000000000002",
        name: "SHA256",
        description: "Implements the standard SHA-256 hash function natively within the runtime level.",
        interface: "function sha256(bytes memory data) external pure returns (bytes32);"
      },
      {
        address: "0x0000000000000000000000000000000000000003",
        name: "RIPEMD160",
        description: "Implements the RIPEMD-160 hash function. Commonly used for legacy address derivations.",
        interface: "function ripemd160(bytes memory data) external pure returns (bytes32);"
      },
      {
        address: "0x0000000000000000000000000000000000000004",
        name: "Identity",
        description: "Optimized buffer-copy precompile. Commonly used for standard memory transfer and return tests.",
        interface: "function identity(bytes memory input) external pure returns (bytes memory);"
      },
      {
        address: "0x0000000000000000000000000000000000000009",
        name: "Blake2F",
        description: "Calculates Blake2 compression function F natively. Relies on 213-byte formatted input parameters.",
        interface: "function blake2F(bytes memory input) external view returns (bytes memory);"
      }
    ]
  },
  {
    category: "ERC-20 Adapters",
    items: [
      {
        address: "0x000007C000000000000000000000000001200000",
        name: "Trust-Backed ERC20 precompile",
        description: "Standard ERC20 adapter suffix mapped to Trust-Backed assets (e.g. USDt). Maps Asset ID directly inside the hex layout.",
        interface: "interface IERC20 {\n    function totalSupply() external view returns (uint256);\n    function balanceOf(address account) external view returns (uint256);\n    function transfer(address to, uint256 amount) external returns (bool);\n}"
      },
      {
        address: "0x0000000000000000000000000000000002200000",
        name: "Foreign Assets ERC20 precompile",
        description: "Bridges Foreign assets originating from different chains (identified by XCM multilocation) to ERC20 compatibility.",
        interface: "interface IERC20 {\n    function allowance(address owner, address spender) external view returns (uint256);\n    function approve(address spender, uint256 amount) external returns (bool);\n}"
      }
    ]
  },
  {
    category: "System & Cryptographics",
    items: [
      {
        address: "0x0000000000000000000000000000000000000900",
        name: "ISystem (System precompile)",
        description: "Exposes system-level cryptographic operations, account transforms, weight/gas queries, and lifecycle actions.",
        interface: "interface ISystem {\n    function hashBlake256(bytes memory input) external pure returns (bytes32);\n    function toAccountId(address input) external view returns (bytes memory);\n    function minimumBalance() external view returns (uint);\n    function weightLeft() external view returns (uint64 refTime, uint64 proofSize);\n    function terminate(address beneficiary) external;\n    function sr25519Verify(uint8[64] calldata signature, bytes calldata msg, bytes32 pubKey) external view returns (bool);\n}"
      }
    ]
  },
  {
    category: "Cross-Chain XCM",
    items: [
      {
        address: "0x00000000000000000000000000000000000a0000",
        name: "IXcm (XCM precompile)",
        description: "Low-level messaging interface for cross-chain execution, destination transfers, and scale-encoded weight measurement.",
        interface: "interface IXcm {\n    struct Weight { uint64 refTime; uint64 proofSize; }\n    function execute(bytes calldata message, Weight calldata weight) external;\n    function send(bytes calldata destination, bytes calldata message) external;\n    function weighMessage(bytes calldata message) external view returns (Weight memory);\n}"
      }
    ]
  }
];

