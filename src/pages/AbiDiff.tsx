import { useState } from "react";
import PageTitle from "@/components/ui/PageTitle";
import DescriptionText from "@/components/ui/DescriptionText";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useNavigation } from "@/hooks/useStore";
import { GitCompare, Plus, Minus, RefreshCw, AlertCircle } from "lucide-react";
import { parseABI } from "@/utils/ABI/ABIParser";
import { validateAbi } from "@/utils/ABI/validateABI";
import Divider from "@/components/ui/Divider";
import CheckCircleIcon from "@/components/ui/CheckCircleIcon";

interface DiffResultItem {
    name: string;
    type: "function" | "event";
    change: "added" | "removed" | "modified";
    oldSig?: string;
    newSig?: string;
}

export default function AbiDiff() {
    const { goHome } = useNavigation();

    const [abiA, setAbiA] = useState<string>("");
    const [abiB, setAbiB] = useState<string>("");

    const [errorA, setErrorA] = useState<boolean>(false);
    const [errorB, setErrorB] = useState<boolean>(false);

    const [diffResults, setDiffResults] = useState<{
        functions: DiffResultItem[];
        events: DiffResultItem[];
        constructorChanged: boolean;
        hasDiff: boolean;
    } | null>(null);

    const handleValidateAndSetA = (val: string) => {
        setAbiA(val);
        if (!val) {
            setErrorA(false);
            return;
        }
        setErrorA(!validateAbi(val));
    };

    const handleValidateAndSetB = (val: string) => {
        setAbiB(val);
        if (!val) {
            setErrorB(false);
            return;
        }
        setErrorB(!validateAbi(val));
    };

    const handleCompare = () => {
        if (!abiA || !abiB || errorA || errorB) return;

        try {
            const parsedA = parseABI(abiA);
            const parsedB = parseABI(abiB);

            const functionsDiff: DiffResultItem[] = [];
            const eventsDiff: DiffResultItem[] = [];

            // 1. Compare Functions
            const funcMapA = new Map(parsedA.functions.map(f => [f.name, f]));
            const funcMapB = new Map(parsedB.functions.map(f => [f.name, f]));

            // Added/Modified
            parsedB.functions.forEach(fB => {
                const fA = funcMapA.get(fB.name);
                if (!fA) {
                    functionsDiff.push({
                        name: fB.name,
                        type: "function",
                        change: "added",
                        newSig: `${fB.name}(${fB.inputs.map(i => i.type).join(",")})`
                    });
                } else {
                    const sigA = `${fA.name}(${fA.inputs.map(i => i.type).join(",")})`;
                    const sigB = `${fB.name}(${fB.inputs.map(i => i.type).join(",")})`;
                    if (sigA !== sigB || fA.stateMutability !== fB.stateMutability) {
                        functionsDiff.push({
                            name: fB.name,
                            type: "function",
                            change: "modified",
                            oldSig: sigA,
                            newSig: sigB
                        });
                    }
                }
            });

            // Removed
            parsedA.functions.forEach(fA => {
                if (!funcMapB.has(fA.name)) {
                    functionsDiff.push({
                        name: fA.name,
                        type: "function",
                        change: "removed",
                        oldSig: `${fA.name}(${fA.inputs.map(i => i.type).join(",")})`
                    });
                }
            });

            // 2. Compare Events
            const eventMapA = new Map(parsedA.events.map(e => [e.name, e]));
            const eventMapB = new Map(parsedB.events.map(e => [e.name, e]));

            // Added/Modified
            parsedB.events.forEach(eB => {
                const eA = eventMapA.get(eB.name);
                if (!eA) {
                    eventsDiff.push({
                        name: eB.name,
                        type: "event",
                        change: "added",
                        newSig: `${eB.name}(${eB.inputs.map(i => i.type).join(",")})`
                    });
                } else {
                    const sigA = `${eA.name}(${eA.inputs.map(i => i.type).join(",")})`;
                    const sigB = `${eB.name}(${eB.inputs.map(i => i.type).join(",")})`;
                    if (sigA !== sigB) {
                        eventsDiff.push({
                            name: eB.name,
                            type: "event",
                            change: "modified",
                            oldSig: sigA,
                            newSig: sigB
                        });
                    }
                }
            });

            // Removed
            parsedA.events.forEach(eA => {
                if (!eventMapB.has(eA.name)) {
                    eventsDiff.push({
                        name: eA.name,
                        type: "event",
                        change: "removed",
                        oldSig: `${eA.name}(${eA.inputs.map(i => i.type).join(",")})`
                    });
                }
            });

            // 3. Compare Constructor
            const constA = parsedA.special.constructor;
            const constB = parsedB.special.constructor;
            let constructorChanged = false;
            if (constA && constB) {
                const sigA = `constructor(${constA.inputs.map(i => i.type).join(",")})`;
                const sigB = `constructor(${constB.inputs.map(i => i.type).join(",")})`;
                constructorChanged = sigA !== sigB;
            } else if ((constA && !constB) || (!constA && constB)) {
                constructorChanged = true;
            }

            const hasDiff = functionsDiff.length > 0 || eventsDiff.length > 0 || constructorChanged;

            setDiffResults({
                functions: functionsDiff,
                events: eventsDiff,
                constructorChanged,
                hasDiff
            });

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="section-container max-h-screen overflow-y-auto pb-8">
            <PageTitle
                text="ABI Diff Tool"
                Icon={GitCompare}
                onBackButton={() => goHome()}
            />
            <DescriptionText
                description="Compare the public interfaces of two deployed smart contracts. Ideal for verifying interface compatibility between development and production upgrades."
            />

            {/* Inputs Container */}
            <div className="flex flex-col gap-3.5 mt-2">
                <div className="flex flex-col gap-1">
                    <label className="text-2xs font-semibold text-text-secondary uppercase tracking-wider">Contract A (Base / Reference)</label>
                    <Input
                        error={errorA}
                        value={abiA}
                        onChange={(e) => handleValidateAndSetA(e.target.value)}
                        placeholder='Paste ABI of reference contract...'
                        showPasteIcon
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-2xs font-semibold text-text-secondary uppercase tracking-wider">Contract B (Target / New Deployment)</label>
                    <Input
                        error={errorB}
                        value={abiB}
                        onChange={(e) => handleValidateAndSetB(e.target.value)}
                        placeholder='Paste ABI of new contract version...'
                        showPasteIcon
                    />
                </div>

                <Button
                    onClick={handleCompare}
                    type="primary"
                    title="Compare Public Interfaces"
                    className="w-full py-2.5"
                    Icon={<GitCompare size={16} />}
                />
            </div>

            {/* Comparison Outputs */}
            {diffResults && (
                <div className="mt-4 flex flex-col gap-4">
                    <Divider />
                    
                    {!diffResults.hasDiff ? (
                        <div className="p-4 bg-green-950/20 border border-green-500/30 rounded-lg text-center flex flex-col items-center justify-center gap-1.5">
                            <CheckCircleIcon className="text-green-400" size={20} />
                            <p className="text-xs font-semibold text-green-300">Interfaces are 100% Identical</p>
                            <p className="text-[10px] text-text-muted">Both contracts share the exact same public functions, events, and constructors.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-1.5 text-xs text-accent-primary font-bold uppercase tracking-wider">
                                <AlertCircle size={14} />
                                <span>Interface Differences Detected</span>
                            </div>

                            {/* Constructor Change Alert */}
                            {diffResults.constructorChanged && (
                                <div className="p-2.5 bg-yellow-950/20 border border-yellow-500/30 rounded-md text-2xs text-yellow-300 font-medium">
                                    ⚠️ Warning: The deployment Constructor arguments / parameters have changed.
                                </div>
                            )}

                            {/* Functions Changes list */}
                            {diffResults.functions.length > 0 && (
                                <div className="flex flex-col gap-2">
                                    <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Functions</span>
                                    <div className="flex flex-col gap-1.5 bg-bg-quinary border border-border-primary rounded-md p-2 max-h-56 overflow-y-auto">
                                        {diffResults.functions.map((item, idx) => (
                                            <div key={idx} className="flex flex-col gap-1 text-[11px] py-1 border-b border-border-primary/30 last:border-0">
                                                {item.change === "added" && (
                                                    <div className="flex items-start gap-1 text-green-400">
                                                        <Plus size={12} className="mt-0.5" />
                                                        <span className="font-mono break-all">{item.newSig}</span>
                                                    </div>
                                                )}
                                                {item.change === "removed" && (
                                                    <div className="flex items-start gap-1 text-red-400">
                                                        <Minus size={12} className="mt-0.5" />
                                                        <span className="font-mono break-all line-through opacity-70">{item.oldSig}</span>
                                                    </div>
                                                )}
                                                {item.change === "modified" && (
                                                    <div className="flex flex-col gap-0.5 text-yellow-400">
                                                        <div className="flex items-start gap-1">
                                                            <RefreshCw size={11} className="mt-0.5" />
                                                            <span className="font-mono break-all font-semibold">Modified Signature:</span>
                                                        </div>
                                                        <div className="pl-4 font-mono text-[10px] text-text-muted">
                                                            <span className="text-red-400/80">- {item.oldSig}</span>
                                                            <br />
                                                            <span className="text-green-400">+ {item.newSig}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Events Changes List */}
                            {diffResults.events.length > 0 && (
                                <div className="flex flex-col gap-2">
                                    <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Events</span>
                                    <div className="flex flex-col gap-1.5 bg-bg-quinary border border-border-primary rounded-md p-2 max-h-56 overflow-y-auto">
                                        {diffResults.events.map((item, idx) => (
                                            <div key={idx} className="flex flex-col gap-1 text-[11px] py-1 border-b border-border-primary/30 last:border-0">
                                                {item.change === "added" && (
                                                    <div className="flex items-start gap-1 text-green-400">
                                                        <Plus size={12} className="mt-0.5" />
                                                        <span className="font-mono break-all">{item.newSig}</span>
                                                    </div>
                                                )}
                                                {item.change === "removed" && (
                                                    <div className="flex items-start gap-1 text-red-400">
                                                        <Minus size={12} className="mt-0.5" />
                                                        <span className="font-mono break-all line-through opacity-70">{item.oldSig}</span>
                                                    </div>
                                                )}
                                                {item.change === "modified" && (
                                                    <div className="flex flex-col gap-0.5 text-yellow-400">
                                                        <div className="flex items-start gap-1">
                                                            <RefreshCw size={11} className="mt-0.5" />
                                                            <span className="font-mono break-all font-semibold">Modified Parameter Map:</span>
                                                        </div>
                                                        <div className="pl-4 font-mono text-[10px] text-text-muted">
                                                            <span className="text-red-400/80">- {item.oldSig}</span>
                                                            <br />
                                                            <span className="text-green-400">+ {item.newSig}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
