import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useMemo, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface TabItemsProps {
    tabs: string[];
    className?: string;
    justify?: "justify-around" | "justify-between" | "justify-start" | "justify-end";
}

export function TabItems({ tabs, className, justify = "justify-around" }: TabItemsProps) {
    return (
        <TabList className={twMerge("flex flex-row items-center w-fit gap-1.5 overflow-hidden overflow-x-auto", justify)}>
            {tabs.map((tab) => {
                return (
                    <Tab
                        key={tab}
                        className={twMerge(`
                        rounded-full px-3 py-1 text-sm/6 font-semibold text-white
                        focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white
                        data-hover:bg-white/5 data-selected:bg-white/10 data-selected:data-hover:bg-white/10`,
                            className
                        )}
                    >
                        {tab}
                    </Tab>
                );
            })}
        </TabList>
    );
}

interface TabContentType {
    name: string;
    content: ReactNode;
}

interface Props {
    tabContent: TabContentType[];
}

export default function TabUI({ tabContent }: Props) {
    const tabs = useMemo(() => tabContent.map(({ name }) => name), [tabContent]);

    return (
        <TabGroup>
            <TabItems
                tabs={tabs}
            />
            <TabPanels className="mt-3">
                {tabContent.map(({ content, name }) => {
                    return (
                        <TabPanel key={name}>
                            {content}
                        </TabPanel>
                    );
                })}
            </TabPanels>
        </TabGroup>
    );
}
