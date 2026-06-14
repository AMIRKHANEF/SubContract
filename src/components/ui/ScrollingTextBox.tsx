// Copyright 2019-2026 @polkadot/extension-polkagate authors & contributors
// SPDX-License-Identifier: Apache-2.0

import useIsHovered from "@/hooks/useIsHovered";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

interface ScrollingTextBoxProps {
    text: string;
    width: number;
    className?: string;
    textClassName?: string;
    scrollOnHover?: boolean;
    preserveWidth?: boolean;
}

function ScrollingTextBox({ scrollOnHover = false, className, text, textClassName, width, preserveWidth = false }: ScrollingTextBoxProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);
    const hovered = useIsHovered(containerRef);

    const [{ shouldScroll, textWidth }, setScrollState] = useState({
        shouldScroll: false,
        textWidth: 0,
    });

    useEffect(() => {
        const el = textRef.current;
        if (!el) return;

        const active = !(scrollOnHover && !hovered);
        const isOverflowing = active && el.scrollWidth > el.clientWidth;

        setScrollState({
            shouldScroll: isOverflowing,
            textWidth: isOverflowing ? el.scrollWidth : 0,
        });
    }, [hovered, scrollOnHover, text]);

    const animationDuration = useMemo(() => Math.min(50, textWidth / 50), [textWidth]);

    const isAnimating = shouldScroll && (!scrollOnHover || hovered);
    const isPaused = shouldScroll && (scrollOnHover ? !hovered : hovered);

    return (
        <div
            ref={containerRef}
            className={twMerge("relative overflow-hidden rounded-lg w-fit", className)}
            style={{ maxWidth: `${width}px`, ...(preserveWidth ? { width } : {}) }}
        >
            {/* Left fade */}
            {shouldScroll && (
                <div className="absolute left-0 top-0 h-full w-3 z-10 pointer-events-none"
                    style={{ background: "linear-gradient(90deg, #20123E 0%, transparent 100%)", opacity: 0.3 }}
                />
            )}

            <span
                ref={textRef}
                className={twMerge("whitespace-nowrap block", textClassName)}
                style={{
                    "--scroll-offset": `${width - textWidth}px`,
                    animation: isAnimating
                        ? `scrollText ${animationDuration}s linear infinite`
                        : "none",
                    animationPlayState: isPaused ? "paused" : "running",
                } as React.CSSProperties}
            >
                {text}
            </span>

            {/* Right fade */}
            {shouldScroll && (
                <div className="absolute right-0 top-0 h-full w-3 z-10 pointer-events-none"
                    style={{ background: "linear-gradient(90deg, transparent 0%, #591467 100%)", opacity: 0.3 }}
                />
            )}
        </div>
    );
}

export default memo(ScrollingTextBox);