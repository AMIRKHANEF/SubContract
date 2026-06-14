import { type JSX, useRef, useEffect, useState, useCallback } from "react";
import { twMerge } from "tailwind-merge";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ABIParameter {
    name?: string;
    type: string;
}

interface ABIItem {
    type: string;
    name?: string;
    inputs?: ABIParameter[];
    outputs?: ABIParameter[];
}

// ─── Hook: slow horizontal scroll on hover ────────────────────────────────────

const SCROLL_SPEED = 100; // px per second

function useHoverScroll() {
    const containerRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number | null>(null);
    const lastTimeRef = useRef<number | null>(null);
    const [isOverflowing, setIsOverflowing] = useState(false);

    // Measure overflow after render
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const check = () => setIsOverflowing(el.scrollWidth > el.clientWidth);
        check();
        const ro = new ResizeObserver(check);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const stopScroll = useCallback(() => {
        if (rafRef.current !== null) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }
        lastTimeRef.current = null;
    }, []);

    const startScroll = useCallback(() => {
        const el = containerRef.current;
        if (!el) return;

        // Reset to start
        el.scrollLeft = 0;

        (() => {
            const tick = (now: number) => {
                if (lastTimeRef.current === null) lastTimeRef.current = now;
                const delta = (now - lastTimeRef.current) / 1000;
                lastTimeRef.current = now;

                el.scrollLeft += SCROLL_SPEED * delta;

                // If we hit the end, stop
                if (el.scrollLeft >= el.scrollWidth - el.clientWidth) {
                    el.scrollLeft = el.scrollWidth - el.clientWidth;
                    return;
                }

                rafRef.current = requestAnimationFrame(tick);
            };
            rafRef.current = requestAnimationFrame(tick);
        })();
    }, []);

    const handleMouseEnter = useCallback(() => {
        if (isOverflowing) startScroll();
    }, [isOverflowing, startScroll]);

    const handleMouseLeave = useCallback(() => {
        stopScroll();
        // Smoothly reset scroll position
        const el = containerRef.current;
        if (el) el.scrollLeft = 0;
    }, [stopScroll]);

    return { containerRef, isOverflowing, handleMouseEnter, handleMouseLeave };
}

const textStyle = "font-light text-xs text-text-muted";
const chars = "font-medium text-[#48487d]";
export const functionVariableTypeColor = "text-[#60b0f0]";
export const functionVariableNameColor = "text-[#a0e0c0]";

export function BuildColoredSig(item: ABIItem): JSX.Element {
    const { containerRef, isOverflowing, handleMouseEnter, handleMouseLeave } = useHoverScroll();

    const inputs = (item.inputs ?? [])
        .map((p) => (
            <span key={p.name}>
                <span className={twMerge(textStyle, functionVariableTypeColor)}>{p.type}</span>
                {p.name && <span className={twMerge(textStyle, functionVariableNameColor)}> {p.name}</span>}
            </span>
        ))
        .reduce<JSX.Element[]>((acc, el, i) => {
            if (i > 0) acc.push(<span className={twMerge(textStyle, "text-[#3a3a6a]")} key={"c" + i}>, </span>);
            acc.push(el);
            return acc;
        }, []);

    const outputs = item.outputs ?? [];

    return (
        <div
            ref={containerRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                maxWidth: "280px",
                width: "280px",
                overflow: "hidden",
                whiteSpace: "nowrap",
                cursor: isOverflowing ? "default" : "inherit",
                // Hide scrollbar across browsers while keeping scroll functional
                scrollbarWidth: "none",           // Firefox
                msOverflowStyle: "none",          // IE / Edge legacy
            }}
            // Hide WebKit scrollbar via inline style string isn't possible;
            // consumers should add this to their stylesheet:
            // .sig-wrapper::-webkit-scrollbar { display: none; }
            // className="sig-wrapper"
            className="px-2 py-1.5 rounded-sm bg-bg-quinary"
        >
            <span className={twMerge(textStyle, "text-[#c0c0f0]")}>{item.name ?? item.type}</span>
            <span className={twMerge(textStyle, chars)}>(</span>
            {inputs}
            <span className={twMerge(textStyle, chars)}>)</span>
            {outputs.length > 0 && (
                <>
                    <span className={twMerge(textStyle, chars)}> → (</span>
                    {outputs.map((o, i) => (
                        <span key={i}>
                            {i > 0 && <span className={twMerge(textStyle, "text-[#48487d]")}>, </span>}
                            <span className={twMerge(textStyle, functionVariableTypeColor)}>{o.type}</span>
                            {o.name && <span className={twMerge(textStyle, functionVariableNameColor)}> {o.name}</span>}
                        </span>
                    ))}
                    <span className={twMerge(textStyle, chars)}>)</span>
                </>
            )}
        </div>
    );
}
