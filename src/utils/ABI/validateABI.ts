// ─── Solidity ABI Validator ───────────────────────────────────────────────────
// Validates a smart contract ABI against the Solidity ABI specification.
// Returns true if the ABI is valid, false otherwise.
// Spec: https://docs.soliditylang.org/en/latest/abi-spec.html

// ─── Types ────────────────────────────────────────────────────────────────────

type AbiItemType =
    | "function"
    | "constructor"
    | "receive"
    | "fallback"
    | "event"
    | "error";

type StateMutability = "pure" | "view" | "nonpayable" | "payable";

interface AbiParameter {
    name: string;
    type: string;
    internalType?: string;
    components?: AbiParameter[]; // only for tuple types
    indexed?: boolean;           // only for event parameters
}

interface AbiItem {
    type: AbiItemType;
    name?: string;
    inputs?: AbiParameter[];
    outputs?: AbiParameter[];
    stateMutability?: StateMutability;
    anonymous?: boolean;         // only for events
}

// ─── Solidity Base Types ──────────────────────────────────────────────────────

// Matches: uint, uint8..uint256, int, int8..int256
const UINT_INT_RE = /^(u?int)(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/;

// Matches: bytes1..bytes32
const BYTES_FIXED_RE = /^bytes([1-9]|[12]\d|3[0-2])$/;

// Matches any valid Solidity elementary type
function isElementaryType(type: string): boolean {
    return (
        type === "address" ||
        type === "bool" ||
        type === "string" ||
        type === "bytes" ||
        UINT_INT_RE.test(type) ||
        BYTES_FIXED_RE.test(type)
    );
}

// ─── Type Validator ───────────────────────────────────────────────────────────
//
// Handles:
//   - Elementary types              (uint256, address, bool …)
//   - Fixed arrays                  (uint256[3])
//   - Dynamic arrays                (uint256[])
//   - Multi-dimensional arrays      (uint256[][3][])
//   - Tuples                        (tuple)  — components validated separately
//   - Tuple arrays                  (tuple[], tuple[3])

function isValidType(type: string): boolean {
    // Strip all trailing array dimensions, e.g. "uint256[][3][]" → "uint256"
    const base = type.replace(/(\[\d*\])+$/, "");

    if (base === "tuple") return true;
    return isElementaryType(base);
}

// ─── Parameter Validator ──────────────────────────────────────────────────────

function isValidParameter(param: unknown, allowIndexed: boolean): boolean {
    if (typeof param !== "object" || param === null || Array.isArray(param)) {
        return false;
    }

    const p = param as Record<string, unknown>;

    // `name` must be a string (can be empty for unnamed outputs)
    if (typeof p.name !== "string") return false;

    // `type` must be a valid Solidity type string
    if (typeof p.type !== "string" || !isValidType(p.type)) return false;

    // `internalType` is optional but must be a string when present
    if (p.internalType !== undefined && typeof p.internalType !== "string") {
        return false;
    }

    // `indexed` is only allowed when explicitly permitted (event inputs)
    if (!allowIndexed && p.indexed !== undefined) return false;
    if (allowIndexed && p.indexed !== undefined && typeof p.indexed !== "boolean") {
        return false;
    }

    // Tuple types must have a `components` array; non-tuples must not
    const isTuple = (p.type as string).replace(/(\[\d*\])+$/, "") === "tuple";

    if (isTuple) {
        if (!Array.isArray(p.components) || p.components.length === 0) return false;
        for (const component of p.components) {
            if (!isValidParameter(component, false)) return false;
        }
    } else {
        if (p.components !== undefined) return false;
    }

    return true;
}

// ─── ABI Item Validators ──────────────────────────────────────────────────────

const VALID_STATE_MUTABILITIES = new Set<string>([
    "pure", "view", "nonpayable", "payable",
]);

function validateFunction(item: Record<string, unknown>): boolean {
    // Functions require a non-empty name
    if (typeof item.name !== "string" || item.name.trim() === "") return false;

    // stateMutability is required for functions
    if (
        typeof item.stateMutability !== "string" ||
        !VALID_STATE_MUTABILITIES.has(item.stateMutability)
    ) {
        return false;
    }

    // inputs must be an array of valid parameters
    if (!Array.isArray(item.inputs)) return false;
    for (const input of item.inputs) {
        if (!isValidParameter(input, false)) return false;
    }

    // outputs must be an array of valid parameters (can be empty)
    if (!Array.isArray(item.outputs)) return false;
    for (const output of item.outputs) {
        if (!isValidParameter(output, false)) return false;
    }

    return true;
}

function validateConstructor(item: Record<string, unknown>): boolean {
    // constructors have no name, no outputs
    if (item.name !== undefined) return false;
    if (item.outputs !== undefined) return false;

    // stateMutability must be "nonpayable" or "payable"
    if (
        typeof item.stateMutability !== "string" ||
        !["nonpayable", "payable"].includes(item.stateMutability)
    ) {
        return false;
    }

    if (!Array.isArray(item.inputs)) return false;
    for (const input of item.inputs) {
        if (!isValidParameter(input, false)) return false;
    }

    return true;
}

function validateReceive(item: Record<string, unknown>): boolean {
    // receive() has no name, no inputs, no outputs, must be payable
    if (item.name !== undefined) return false;
    if (item.inputs !== undefined && (item.inputs as unknown[]).length !== 0) return false;
    if (item.outputs !== undefined && (item.outputs as unknown[]).length !== 0) return false;
    if (item.stateMutability !== "payable") return false;
    return true;
}

function validateFallback(item: Record<string, unknown>): boolean {
    // fallback() has no name, no outputs, must be nonpayable or payable
    if (item.name !== undefined) return false;
    if (item.outputs !== undefined && (item.outputs as unknown[]).length !== 0) return false;
    if (
        typeof item.stateMutability !== "string" ||
        !["nonpayable", "payable"].includes(item.stateMutability)
    ) {
        return false;
    }

    // fallback may optionally accept bytes input
    if (item.inputs !== undefined) {
        if (!Array.isArray(item.inputs)) return false;
        for (const input of item.inputs) {
            if (!isValidParameter(input, false)) return false;
        }
    }

    return true;
}

function validateEvent(item: Record<string, unknown>): boolean {
    // Events require a non-empty name
    if (typeof item.name !== "string" || item.name.trim() === "") return false;

    // `anonymous` must be a boolean when present
    if (item.anonymous !== undefined && typeof item.anonymous !== "boolean") {
        return false;
    }

    // Events have no outputs, no stateMutability
    if (item.outputs !== undefined) return false;
    if (item.stateMutability !== undefined) return false;

    if (!Array.isArray(item.inputs)) return false;

    // At most 3 indexed parameters for non-anonymous events, 4 for anonymous
    const isAnonymous = item.anonymous === true;
    const maxIndexed = isAnonymous ? 4 : 3;
    let indexedCount = 0;

    for (const input of item.inputs) {
        if (!isValidParameter(input, true)) return false;
        const p = input as Record<string, unknown>;
        if (p.indexed === true) indexedCount++;
    }

    if (indexedCount > maxIndexed) return false;

    return true;
}

function validateError(item: Record<string, unknown>): boolean {
    // Custom errors require a non-empty name, have inputs only
    if (typeof item.name !== "string" || item.name.trim() === "") return false;
    if (item.outputs !== undefined) return false;
    if (item.stateMutability !== undefined) return false;

    if (!Array.isArray(item.inputs)) return false;
    for (const input of item.inputs) {
        if (!isValidParameter(input, false)) return false;
    }

    return true;
}

// ─── ABI Item Dispatcher ──────────────────────────────────────────────────────

function isValidAbiItem(item: unknown): boolean {
    if (typeof item !== "object" || item === null || Array.isArray(item)) {
        return false;
    }

    const entry = item as Record<string, unknown>;

    switch (entry.type as AbiItemType) {
        case "function": return validateFunction(entry);
        case "constructor": return validateConstructor(entry);
        case "receive": return validateReceive(entry);
        case "fallback": return validateFallback(entry);
        case "event": return validateEvent(entry);
        case "error": return validateError(entry);
        default: return false; // unknown type
    }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Validates a Solidity smart contract ABI.
 *
 * Accepts either a parsed ABI array or a raw JSON string.
 * Returns `true` if the ABI is fully valid, `false` otherwise.
 *
 * @example
 * validateAbi([{ type: "function", name: "balanceOf", ... }]); // true
 * validateAbi("not json");                                       // false
 */
export function validateAbi(abi: unknown): boolean {
    // Accept raw JSON strings
    let parsed = abi;
    if (typeof abi === "string") {
        try {
            parsed = JSON.parse(abi);
        } catch {
            return false;
        }
    }

    // ABI must be a non-empty array
    if (!Array.isArray(parsed) || parsed.length === 0) return false;

    // Every item must be valid
    for (const item of parsed) {
        if (!isValidAbiItem(item)) return false;
    }

    // No duplicate function/event/error signatures allowed
    const signatures = new Set<string>();
    for (const item of parsed as AbiItem[]) {
        if (!item.name) continue; // constructor / receive / fallback

        const paramTypes = (item.inputs ?? [])
            .map((p) => p.type)
            .join(",");
        const sig = `${item.type}:${item.name}(${paramTypes})`;

        if (signatures.has(sig)) return false;
        signatures.add(sig);
    }

    return true;
}
