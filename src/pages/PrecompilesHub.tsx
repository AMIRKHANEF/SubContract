import { useEffect, useRef, useState } from "react";
import PageTitle from "@/components/ui/PageTitle";
import DescriptionText from "@/components/ui/DescriptionText";
import { useNavigation } from "@/hooks/useStore";
import { PRECOMPILES_DATA } from "../../content";
import { Cpu, Copy, Check, Terminal } from "lucide-react";
import Divider from "@/components/ui/Divider";

export default function PrecompilesHub() {
    const { goHome } = useNavigation();
    const tabsRef = useRef<HTMLDivElement>(null);

    const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>("Ethereum Native");

    useEffect(() => {
        const el = tabsRef.current;
        if (!el) return;

        const handleWheel = (e: WheelEvent) => {
            const canScroll = el.scrollWidth > el.clientWidth;
            if (!canScroll) return;

            e.preventDefault();
            el.scrollLeft += e.deltaX + e.deltaY;
        };

        el.addEventListener("wheel", handleWheel, { passive: false });
        return () => el.removeEventListener("wheel", handleWheel);
    }, []);

    const handleCopy = async (address: string) => {
        try {
            await navigator.clipboard.writeText(address);
            setCopiedAddress(address);
            setTimeout(() => setCopiedAddress(null), 1500);
        } catch (err) {
            console.error("Failed to copy address:", err);
        }
    };

    return (
        <div className="section-container max-h-screen overflow-y-auto relative">
            <PageTitle
                text="Precompiles Hub"
                Icon={Cpu}
                onBackButton={() => goHome()}
            />
            <DescriptionText
                description="Explore system, ERC20 adapters, cryptographic, and XCM precompiled smart contracts natively supported by Polkadot's Revive pallet."
            />

            {/* Category Selector Tabs */}
            <div
                ref={tabsRef}
                className="flex flex-row shrink-0 gap-1.5 overflow-x-auto scrollbar-none h-fit"
            >
                {PRECOMPILES_DATA.map((cat) => {
                    const isSelected = cat.category === selectedCategory;
                    return (
                        <button
                            key={cat.category}
                            onClick={() => setSelectedCategory(cat.category)}
                            className={`px-3 py-1.5 text-2xs font-semibold rounded-md fast-transition whitespace-nowrap cursor-pointer border-default
                                ${isSelected
                                    ? "bg-accent-primary text-text-primary shadow-sm"
                                    : "text-text-muted hover:text-text-primary hover:bg-bg-hover"}`}
                        >
                            {cat.category}
                        </button>
                    );
                })}
            </div>

            <Divider className="opacity-50 -my-2" />

            {/* Items Content Card List */}
            <div className="flex flex-col gap-3 pb-2">
                {PRECOMPILES_DATA.find((c) => c.category === selectedCategory)?.items.map((item) => {
                    const isCopied = copiedAddress === item.address;

                    return (
                        <div
                            key={item.address}
                            className="bg-bg-quinary border border-border-primary rounded-lg p-3 flex flex-col gap-2 relative group hover:border-accent-primary/50 card-transition"
                        >
                            {/* Title & Copyable Address Header */}
                            <div className="flex items-center justify-between gap-4">
                                <span className="text-xs font-bold text-text-primary group-hover:text-accent-primary fast-transition">
                                    {item.name}
                                </span>

                                <button
                                    onClick={() => handleCopy(item.address)}
                                    title="Copy full precompile address"
                                    className="flex items-center gap-1.5 text-[10px] font-mono text-text-secondary bg-bg-primary hover:bg-bg-hover px-2.5 py-1 rounded border border-border-primary cursor-pointer fast-transition"
                                >
                                    <span>
                                        {item.address.slice(0, 6)}...{item.address.slice(-4)}
                                    </span>
                                    {isCopied ? (
                                        <Check size={11} className="text-green-400" />
                                    ) : (
                                        <Copy size={11} className="text-text-muted hover:text-accent-primary" />
                                    )}
                                </button>
                            </div>

                            {/* Description Block */}
                            <p className="text-[11px] text-text-muted leading-relaxed">
                                {item.description}
                            </p>

                            <Divider className="opacity-40 my-0.5" />

                            {/* Code Signature / Solidity Interface Block */}
                            <div className="bg-bg-primary border border-border-primary rounded p-2 relative">
                                <div className="flex items-center justify-between text-[9px] text-text-muted uppercase tracking-wider mb-1">
                                    <div className="flex items-center gap-1">
                                        <Terminal size={10} />
                                        <span>Solidity Signature / ABI</span>
                                    </div>
                                    <button
                                        onClick={() => handleCopy(item.interface)}
                                        className="hover:text-accent-primary fast-transition cursor-pointer"
                                        title="Copy full Solidity Interface snippet"
                                    >
                                        <Copy size={9} />
                                    </button>
                                </div>
                                <pre className="text-[9px] font-mono text-green-400 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                                    {item.interface}
                                </pre>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
