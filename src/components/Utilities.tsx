import type { PopUps } from "@/utils/constants";
import { features, pages } from "../../content";
import Collapse from "./ui/Collapse";
import SectionTitle from "./ui/SectionTitle";
import UtilityItem from "./UtilityItem";
import { useNavigation } from "@/hooks/useStore";

export default function Utilities({ setPopup }: { setPopup: (popup: PopUps) => void }) {
    const { navigateTo } = useNavigation();

    return (
        <Collapse
            collapseChildren={
                <SectionTitle
                    text="Developer Utilities"
                />
            }
            withChevron
        >
            <div className="grid grid-cols-2 gap-3">
                {features.map(({ description, icon, title, popup }, index) => (
                    <UtilityItem
                        key={index}
                        description={description}
                        icon={icon}
                        onClick={() => setPopup(popup)}
                        title={title}
                    />
                ))}
                {pages.map(({ description, icon, title, path }, index) => (
                    <UtilityItem
                        key={index}
                        description={description}
                        icon={icon}
                        onClick={() => navigateTo(path)}
                        title={title}
                    />
                ))}
            </div>
        </Collapse>
    );
}
