/* eslint-disable @typescript-eslint/no-explicit-any */

export enum ABITab {
    Functions = "Functions",
    Events = "Events",
    Errors = "Errors",
    Specials = "Specials"
}

export type StateMutability =
    | "pure"
    | "view"
    | "nonpayable"
    | "payable";

export type ABIItemType =
    | "function"
    | "event"
    | "error"
    | "constructor"
    | "fallback"
    | "receive";

export interface ABIParameter {
    name: string;
    type: string;
    indexed?: boolean;
    internalType?: string;
    components?: ABIParameter[];
}

export interface ABIItem {
    type: ABIItemType;
    name?: string;
    inputs?: ABIParameter[];
    outputs?: ABIParameter[];
    stateMutability?: StateMutability;
    anonymous?: boolean;
}

export interface ParsedParameter {
    name: string;
    type: string;
    indexed?: boolean;
    internalType?: string;
    components?: ParsedParameter[];
}

export interface ParsedFunction {
    kind: "function";
    name: string;
    signature: string;
    shortSignature: string;
    stateMutability: StateMutability;
    inputs: ParsedParameter[];
    outputs: ParsedParameter[];
    inputsCount: number;
    outputsCount: number;
    searchableText: string;
}

export interface ParsedEvent {
    kind: "event";
    name: string;
    signature: string;
    anonymous: boolean;
    inputs: ParsedParameter[];
    indexedInputs: ParsedParameter[];
    nonIndexedInputs: ParsedParameter[];
    searchableText: string;
}

export interface ParsedError {
    kind: "error";
    name: string;
    signature: string;
    inputs: ParsedParameter[];
    searchableText: string;
}

export interface ParsedSpecialItem {
    kind: "constructor" | "fallback" | "receive";
    name: string;
    signature: string;
    stateMutability?: StateMutability;
    inputs: ParsedParameter[];
}

export interface ParsedABI {
    stats: {
        total: number;
        functions: number;
        events: number;
        errors: number;
        special: number;
    };

    functions: ParsedFunction[];
    events: ParsedEvent[];
    errors: ParsedError[];

    special: {
        constructor: ParsedSpecialItem | null;
        fallback: ParsedSpecialItem | null;
        receive: ParsedSpecialItem | null;
    };

    allItems: (
        | ParsedFunction
        | ParsedEvent
        | ParsedError
        | ParsedSpecialItem
    )[];

    byName: Record<string, any>;
}

function parseParameter(param: ABIParameter): ParsedParameter {
    return {
        name: param.name,
        type: param.type,
        indexed: param.indexed,
        internalType: param.internalType,
        components: param.components?.map(parseParameter),
    };
}

export function buildSignature(item: ABIItem): string {
    const params = (item.inputs ?? [])
        .map((p) => `${p.type}${p.name ? ` ${p.name}` : ""}`)
        .join(", ");

    return `${item.name ?? item.type} (${params})`;
}

export function parseABI(raw: string | ABIItem[]): ParsedABI {
    const abi: ABIItem[] =
        typeof raw === "string"
            ? JSON.parse(raw.trim())
            : raw;

    if (!Array.isArray(abi)) {
        throw new Error("ABI must be an array.");
    }

    const functions: ParsedFunction[] = abi
        .filter((i) => i.type === "function")
        .map((fn) => ({
            kind: "function",
            name: fn.name!,
            signature: buildSignature(fn),
            shortSignature: `${fn.name} (${(fn.inputs ?? [])
                    .map((x) => x.type)
                    .join(",")
                })`,
            stateMutability: fn.stateMutability ?? "nonpayable",
            inputs: (fn.inputs ?? []).map(parseParameter),
            outputs: (fn.outputs ?? []).map(parseParameter),
            inputsCount: fn.inputs?.length ?? 0,
            outputsCount: fn.outputs?.length ?? 0,
            searchableText: `${fn.name} ${buildSignature(fn)} `.toLowerCase(),
        }));

    const events: ParsedEvent[] = abi
        .filter((i) => i.type === "event")
        .map((event) => ({
            kind: "event",
            name: event.name!,
            signature: buildSignature(event),
            anonymous: event.anonymous ?? false,
            inputs: (event.inputs ?? []).map(parseParameter),
            indexedInputs: (event.inputs ?? [])
                .filter((x) => x.indexed)
                .map(parseParameter),
            nonIndexedInputs: (event.inputs ?? [])
                .filter((x) => !x.indexed)
                .map(parseParameter),
            searchableText: `${event.name} ${buildSignature(event)} `.toLowerCase(),
        }));

    const errors: ParsedError[] = abi
        .filter((i) => i.type === "error")
        .map((error) => ({
            kind: "error",
            name: error.name!,
            signature: buildSignature(error),
            inputs: (error.inputs ?? []).map(parseParameter),
            searchableText: `${error.name} ${buildSignature(error)} `.toLowerCase(),
        }));

    function parseSpecial(
        type: "constructor" | "fallback" | "receive"
    ): ParsedSpecialItem | null {
        const item = abi.find((x) => x.type === type);

        if (!item) return null;

        return {
            kind: type,
            name: "", // just to satisfy the ParsedSpecialItem type
            signature: buildSignature(item),
            stateMutability: item.stateMutability,
            inputs: (item.inputs ?? []).map(parseParameter),
        };
    }

    const special = {
        constructor: parseSpecial("constructor"),
        fallback: parseSpecial("fallback"),
        receive: parseSpecial("receive"),
    };

    const allItems = [
        ...functions,
        ...events,
        ...errors,
        ...Object.values(special).filter(Boolean),
    ];

    const byName: Record<string, any> = {};

    allItems.forEach((item: any) => {
        if ("name" in item && item.name) {
            byName[item.name] = item;
        }
    });

    const filtered = allItems.filter((item) => !!item)

    return {
        stats: {
            total: allItems.length,
            functions: functions.length,
            events: events.length,
            errors: errors.length,
            special: Object.values(special).filter(Boolean).length,
        },

        functions,
        events,
        errors,
        special,

        allItems: filtered,

        byName,
    };
}
