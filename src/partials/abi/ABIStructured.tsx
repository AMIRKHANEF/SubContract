import { variants } from "@/styles/style";
import { ABITab, type ParsedABI } from "@/utils/ABI/ABIParser";
import { motion } from "framer-motion";
import TabItem from "./TabItem";
import TabContent from "./TabContent";
import { useState } from "react";

interface Props {
    tabContent: { name: ABITab; count: number; }[];
    parsedABI: ParsedABI | undefined;
}
    
export default function ABIStructured({ tabContent, parsedABI }: Props) {
    const [selectedTab, setSelectedTab] = useState<ABITab>(ABITab.Functions);
    
    return (
        <motion.div
            custom={1}
            variants={variants}
            initial="enter"
            animate="center"
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-col gap-2.5 pb-2.5"
        >
            <div className="flex flex-row gap-1.5 items-center">
                {tabContent.map(({ count, name }, index) => (
                    <TabItem
                        count={count}
                        name={name}
                        onClick={() => setSelectedTab(name)}
                        isSelected={selectedTab === name}
                        key={index}
                    />
                ))}
            </div>
            <TabContent
                tab={selectedTab}
                parsedABI={parsedABI}
            />
        </motion.div>
    );
}
