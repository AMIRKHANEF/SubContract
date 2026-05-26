import type { Config } from "tailwindcss";
import tailwindAnimatePlugin from "tailwindcss-animate";

export default {
    darkMode: "class",

    content: [
        "./components/**/*.{ts,tsx}",
        "./src/**/*.{ts,tsx}"
    ],

    theme: {
        extend: {
            colors: {
                bg: {
                    primary: "var(--bg-primary)",
                    secondary: "var(--bg-secondary)",
                    tertiary: "var(--bg-tertiary)",
                    hover: "var(--bg-hover)"
                },

                border: {
                    primary: "var(--border-primary)",
                    secondary: "var(--border-secondary)"
                },

                text: {
                    primary: "var(--text-primary)",
                    secondary: "var(--text-secondary)",
                    muted: "var(--text-muted)"
                },

                accent: {
                    primary: "var(--accent-primary)",
                    hover: "var(--accent-primary-hover)"
                },

                success: "var(--success)",
                warning: "var(--warning)",
                error: "var(--error)",
                info: "var(--info)"
            },

            fontFamily: {
                sans: ["var(--font-family)"]
            },

            fontSize: {
                "3xs": "var(--text-3xs)",
                "2xs": "var(--text-2xs)",
                xs: "var(--text-xs)",
                xsm: "var(--text-xsm)",
                sm: "var(--text-sm)",
                lmd: "var(--text-lmd)",
                md: "var(--text-md)",
                lg: "var(--text-lg)",
                xl: "var(--text-xl)"
            },

            fontWeight: {
                regular: "var(--font-regular)",
                medium: "var(--font-medium)",
                semibold: "var(--font-semibold)",
                bold: "var(--font-bold)"
            },

            lineHeight: {
                tight: "var(--leading-tight)",
                normal: "var(--leading-normal)",
                relaxed: "var(--leading-relaxed)"
            },

            spacing: {
                1: "var(--space-1)",
                2: "var(--space-2)",
                3: "var(--space-3)",
                4: "var(--space-4)",
                5: "var(--space-5)",
                6: "var(--space-6)"
            },

            borderRadius: {
                sm: "var(--radius-sm)",
                md: "var(--radius-md)",
                lg: "var(--radius-lg)",
                xl: "var(--radius-xl)"
            },

            boxShadow: {
                sm: "var(--shadow-sm)",
                md: "var(--shadow-md)",
                lg: "var(--shadow-lg)"
            },

            transitionDuration: {
                fast: "120ms",
                normal: "180ms",
                slow: "250ms"
            },

            width: {
                popup: "var(--popup-width)"
            },

            minHeight: {
                popup: "var(--popup-min-height)"
            }
        }
    },

    plugins: [tailwindAnimatePlugin]
} satisfies Config;