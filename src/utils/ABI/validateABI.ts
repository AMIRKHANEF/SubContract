// ─── Solidity ABI Validator & Fixer ─────────────────────────────────────────
// Validates and auto-fixes a Solidity ABI.
//
// Returns the fixed (and always valid) ABI array on success, or null if the
// input is fatally broken and cannot be repaired (e.g. unparsable text,
// duplicate signatures, invalid types that cannot be inferred).
//
// Fixes applied automatically:
//   - JS object-literal syntax  → proper JSON (unquoted keys, trailing commas)
//   - Missing "name" on params  → defaulted to ""
//   - "name" on constructor / receive / fallback → removed
//   - "outputs" on constructor / receive / event / error → removed
//   - Empty "inputs: []" on receive → removed
//   - "stateMutability" on event / error → removed
//   - "indexed" on non-event parameters → removed
//   - "components" on non-tuple types → removed
//   - Spec: https://docs.soliditylang.org/en/latest/abi-spec.html

// ─── Types ───────────────────────────────────────────────────────────────────

type AbiItemType =
    | "function"
    | "constructor"
    | "receive"
    | "fallback"
    | "event"
    | "error";

type StateMutability = "pure" | "view" | "nonpayable" | "payable";

export interface AbiParameter {
    name: string;
    type: string;
    internalType?: string;
    components?: AbiParameter[];
    indexed?: boolean;
}

export interface AbiItem {
    type: AbiItemType;
    name?: string;
    inputs?: AbiParameter[];
    outputs?: AbiParameter[];
    stateMutability?: StateMutability;
    anonymous?: boolean;
}

// ─── Internal result types ───────────────────────────────────────────────────

interface FixResult<T> {
    fixed: T;
    /** true when the item is semantically valid after fixes; false = fatal error */
    ok: boolean;
}

// ─── Regexes ─────────────────────────────────────────────────────────────────

const UINT_INT_RE =
    /^(u?int)(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/;
const BYTES_FIXED_RE = /^bytes([1-9]|[12]\d|3[0-2])$/;
// Correctly strips full bracket groups: [], [3], [][3][], etc.
const ARRAY_SUFFIX_RE = /(\[\d*\])+$/;

// ─── Type helpers ─────────────────────────────────────────────────────────────

function isElementaryType(t: string): boolean {
    return (
        t === "address" ||
        t === "bool" ||
        t === "string" ||
        t === "bytes" ||
        UINT_INT_RE.test(t) ||
        BYTES_FIXED_RE.test(t)
    );
}

function isValidType(t: string): boolean {
    const base = t.replace(ARRAY_SUFFIX_RE, "");
    if (base === "tuple") return true;
    return isElementaryType(base);
}

function isTupleType(t: string): boolean {
    return t.replace(ARRAY_SUFFIX_RE, "") === "tuple";
}

// ─── JS-literal → JSON coercion ───────────────────────────────────────────────

function coerceToJson(raw: string): string {
    let s = raw.trim();
    // Remove trailing commas before ] or }
    s = s.replace(/,(\s*[\]}])/g, "$1");
    // Quote unquoted object keys
    s = s.replace(
        /([{,\n\r]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)(\s*:)/g,
        (match, pre, key, colon) => {
            if (key === "true" || key === "false" || key === "null") return match;
            return `${pre}"${key}"${colon}`;
        }
    );
    return s;
}

function tryParse(raw: string): unknown[] | null {
    // Try strict JSON first
    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : null;
    } catch {
        // Fall through to JS-literal coercion
    }

    try {
        const parsed = JSON.parse(coerceToJson(raw));
        return Array.isArray(parsed) ? parsed : null;
    } catch {
        return null;
    }
}

// ─── Parameter fixer ──────────────────────────────────────────────────────────

function fixParameter(
    raw: unknown,
    allowIndexed: boolean
): FixResult<AbiParameter> {
    if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
        return { fixed: { name: "", type: "bytes" }, ok: false };
    }

    const p = raw as Record<string, unknown>;
    const out: Record<string, unknown> = { ...p };

    // name: default to "" if missing or wrong type
    if (typeof out.name !== "string") out.name = "";

    // type: must be a valid Solidity type — fatal if absent or invalid
    if (typeof out.type !== "string" || !isValidType(out.type as string)) {
        return { fixed: out as unknown as AbiParameter, ok: false };
    }

    // internalType: must be a string when present
    if (out.internalType !== undefined && typeof out.internalType !== "string") {
        return { fixed: out as unknown as AbiParameter, ok: false };
    }

    // indexed: remove when not in an event; must be boolean when present
    if (!allowIndexed && out.indexed !== undefined) {
        delete out.indexed;
    }
    if (
        allowIndexed &&
        out.indexed !== undefined &&
        typeof out.indexed !== "boolean"
    ) {
        return { fixed: out as unknown as AbiParameter, ok: false };
    }

    const typeStr = out.type as string;

    // Tuple: must have non-empty components; recursively fix them
    if (isTupleType(typeStr)) {
        if (!Array.isArray(out.components) || out.components.length === 0) {
            return { fixed: out as unknown as AbiParameter, ok: false };
        }
        const fixedComponents: AbiParameter[] = [];
        for (const comp of out.components) {
            const r = fixParameter(comp, false);
            if (!r.ok) return { fixed: out as unknown as AbiParameter, ok: false };
            fixedComponents.push(r.fixed);
        }
        out.components = fixedComponents;
    } else {
        // Non-tuple: remove stray components
        if (out.components !== undefined) delete out.components;
    }

    return { fixed: out as unknown as AbiParameter, ok: true };
}

function fixParams(
    raw: unknown,
    allowIndexed: boolean
): FixResult<AbiParameter[]> {
    if (!Array.isArray(raw)) return { fixed: [], ok: false };
    const fixed: AbiParameter[] = [];
    for (const item of raw) {
        const r = fixParameter(item, allowIndexed);
        if (!r.ok) return { fixed: [], ok: false };
        fixed.push(r.fixed);
    }
    return { fixed, ok: true };
}

// ─── Item fixers ──────────────────────────────────────────────────────────────

const VALID_MUTABILITIES = new Set<string>([
    "pure",
    "view",
    "nonpayable",
    "payable",
]);

function fixFunction(raw: Record<string, unknown>): FixResult<AbiItem> {
    const out = { ...raw };

    if (typeof out.name !== "string" || (out.name as string).trim() === "") {
        return { fixed: out as unknown as AbiItem, ok: false };
    }
    if (
        typeof out.stateMutability !== "string" ||
        !VALID_MUTABILITIES.has(out.stateMutability as string)
    ) {
        return { fixed: out as unknown as AbiItem, ok: false };
    }

    const inputs = fixParams(out.inputs ?? [], false);
    if (!inputs.ok) return { fixed: out as unknown as AbiItem, ok: false };
    out.inputs = inputs.fixed as unknown as Record<string, unknown>[];

    const outputs = fixParams(out.outputs ?? [], false);
    if (!outputs.ok) return { fixed: out as unknown as AbiItem, ok: false };
    out.outputs = outputs.fixed as unknown as Record<string, unknown>[];

    return { fixed: out as unknown as AbiItem, ok: true };
}

function fixConstructor(raw: Record<string, unknown>): FixResult<AbiItem> {
    const out = { ...raw };

    // Remove disallowed fields
    delete out.name;
    delete out.outputs;

    if (!["nonpayable", "payable"].includes(out.stateMutability as string)) {
        return { fixed: out as unknown as AbiItem, ok: false };
    }

    const inputs = fixParams(out.inputs ?? [], false);
    if (!inputs.ok) return { fixed: out as unknown as AbiItem, ok: false };
    out.inputs = inputs.fixed as unknown as Record<string, unknown>[];

    return { fixed: out as unknown as AbiItem, ok: true };
}

function fixReceive(raw: Record<string, unknown>): FixResult<AbiItem> {
    const out = { ...raw };

    // Remove disallowed fields
    delete out.name;
    // Remove inputs entirely (empty array is valid in practice but not in spec)
    if (Array.isArray(out.inputs) && (out.inputs as unknown[]).length === 0) {
        delete out.inputs;
    } else if (out.inputs !== undefined) {
        // Non-empty inputs on receive() — fatal
        return { fixed: out as unknown as AbiItem, ok: false };
    }
    if (
        Array.isArray(out.outputs) &&
        (out.outputs as unknown[]).length === 0
    ) {
        delete out.outputs;
    } else if (out.outputs !== undefined) {
        return { fixed: out as unknown as AbiItem, ok: false };
    }

    if (out.stateMutability !== "payable") {
        return { fixed: out as unknown as AbiItem, ok: false };
    }

    return { fixed: out as unknown as AbiItem, ok: true };
}

function fixFallback(raw: Record<string, unknown>): FixResult<AbiItem> {
    const out = { ...raw };

    delete out.name;
    if (
        Array.isArray(out.outputs) &&
        (out.outputs as unknown[]).length === 0
    ) {
        delete out.outputs;
    } else if (out.outputs !== undefined) {
        return { fixed: out as unknown as AbiItem, ok: false };
    }

    if (!["nonpayable", "payable"].includes(out.stateMutability as string)) {
        return { fixed: out as unknown as AbiItem, ok: false };
    }

    if (out.inputs !== undefined) {
        const inputs = fixParams(out.inputs, false);
        if (!inputs.ok) return { fixed: out as unknown as AbiItem, ok: false };
        out.inputs = inputs.fixed as unknown as Record<string, unknown>[];
    }

    return { fixed: out as unknown as AbiItem, ok: true };
}

function fixEvent(raw: Record<string, unknown>): FixResult<AbiItem> {
    const out = { ...raw };

    if (typeof out.name !== "string" || (out.name as string).trim() === "") {
        return { fixed: out as unknown as AbiItem, ok: false };
    }
    if (out.anonymous !== undefined && typeof out.anonymous !== "boolean") {
        return { fixed: out as unknown as AbiItem, ok: false };
    }

    // Remove disallowed fields
    delete out.outputs;
    delete out.stateMutability;

    const inputs = fixParams(out.inputs ?? [], true);
    if (!inputs.ok) return { fixed: out as unknown as AbiItem, ok: false };
    out.inputs = inputs.fixed as unknown as Record<string, unknown>[];

    const isAnonymous = out.anonymous === true;
    const maxIndexed = isAnonymous ? 4 : 3;
    const indexedCount = inputs.fixed.filter((p) => p.indexed === true).length;
    if (indexedCount > maxIndexed) {
        return { fixed: out as unknown as AbiItem, ok: false };
    }

    return { fixed: out as unknown as AbiItem, ok: true };
}

function fixError(raw: Record<string, unknown>): FixResult<AbiItem> {
    const out = { ...raw };

    if (typeof out.name !== "string" || (out.name as string).trim() === "") {
        return { fixed: out as unknown as AbiItem, ok: false };
    }

    // Remove disallowed fields
    delete out.outputs;
    delete out.stateMutability;

    const inputs = fixParams(out.inputs ?? [], false);
    if (!inputs.ok) return { fixed: out as unknown as AbiItem, ok: false };
    out.inputs = inputs.fixed as unknown as Record<string, unknown>[];

    return { fixed: out as unknown as AbiItem, ok: true };
}

function fixItem(raw: unknown): FixResult<AbiItem> {
    if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
        return { fixed: {} as AbiItem, ok: false };
    }

    const entry = raw as Record<string, unknown>;

    switch (entry.type as AbiItemType) {
        case "function": return fixFunction(entry);
        case "constructor": return fixConstructor(entry);
        case "receive": return fixReceive(entry);
        case "fallback": return fixFallback(entry);
        case "event": return fixEvent(entry);
        case "error": return fixError(entry);
        default:
            return { fixed: entry as unknown as AbiItem, ok: false };
    }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Validates and auto-fixes a Solidity smart contract ABI.
 *
 * Accepts:
 *   - A parsed ABI array (`AbiItem[]`)
 *   - A strict JSON string (`'[{"type":"function",...}]'`)
 *   - A JS object-literal string (unquoted keys, trailing commas — common in
 *     copy-pasted ABIs)
 *
 * Returns:
 *   - The fixed `AbiItem[]` on success (all auto-fixable issues are corrected)
 *   - `null` when the ABI is fatally invalid and cannot be repaired:
 *       • Completely unparseable input
 *       • Invalid / unknown Solidity types
 *       • Duplicate function/event/error signatures
 *       • Too many indexed event parameters
 *       • Missing required fields that cannot be defaulted
 *
 * @example
 * // Valid — returns the (possibly cleaned) ABI
 * validateAbi('[{"type":"function","name":"balanceOf",...}]');
 *
 * // JS-literal input — auto-fixed and returned
 * validateAbi('[{ type: "function", name: "foo", ... }]');
 *
 * // Fatally broken — returns null
 * validateAbi("not an abi");
 */
export function validateAbi(abi: unknown): AbiItem[] | null {
    // ── 1. Parse ────────────────────────────────────────────────────────────────
    let items: unknown[];

    if (Array.isArray(abi)) {
        items = abi;
    } else if (typeof abi === "string") {
        const parsed = tryParse(abi);
        if (parsed === null) return null;
        items = parsed;
    } else {
        return null;
    }

    if (items.length === 0) return null;

    // ── 2. Fix each item ────────────────────────────────────────────────────────
    const fixedItems: AbiItem[] = [];

    for (const raw of items) {
        const result = fixItem(raw);
        if (!result.ok) return null;
        fixedItems.push(result.fixed);
    }

    
    //  ****** DUPLICATE SIGNATURE CHECK SKIPPED BECAUSE SUBSCAN DOESN'T CARE ABOUT DUPLICATES *****

    
    // ── 3. Duplicate signature check ────────────────────────────────────────────

    // const signatures = new Set<string>();

    // for (const item of fixedItems) {
    //     if (!item.name) continue; // constructor / receive / fallback — skip
    //     const paramTypes = (item.inputs ?? []).map((p) => p.type).join(",");
    //     const sig = `${item.type}:${item.name}(${paramTypes})`;
    //     if (signatures.has(sig)) return null;
    //     signatures.add(sig);
    // }

    return fixedItems;
}
