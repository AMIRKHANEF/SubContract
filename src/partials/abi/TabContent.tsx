import { variants } from "@/styles/style";
import type { ABITab, ParsedABI } from "@/utils/ABI/ABIParser";
import { motion } from "framer-motion";
import { useMemo } from "react";
import SignatureItem from "./SignatureItem";

interface Props {
    tab: ABITab;
    parsedABI: ParsedABI | undefined;
}

export default function TabContent({ tab, parsedABI }: Props) {
    const content = useMemo(() => {
        if (!parsedABI) return null;

        switch (tab) {
            case "Functions":
                return parsedABI.functions;

            case "Errors":
                return parsedABI.errors;

            case "Events":
                return parsedABI.events;

            case "Specials":
                return Object.values(parsedABI.special).filter((a) => !!a);

            default:
                return null;
        }
    }, [parsedABI, tab]);

    if (!content) return null;

    return (
        <motion.div
            key={tab}
            custom={1}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-col gap-2.5 pb-2.5"
        >
            {content.map((item, index) => {
                return (
                    <SignatureItem
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        item={item}
                        key={index}
                    />
                );
            })}
        </motion.div>
    );
}
