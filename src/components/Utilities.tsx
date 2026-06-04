import type { PopUps } from "@/utils/constants";
import { features } from "../../content";
import Collapse from "./ui/Collapse";
import SectionTitle from "./ui/SectionTitle";
import UtilityItem from "./UtilityItem";

export default function Utilities({ setPopup }: { setPopup: (popup: PopUps) => void }) {
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
            </div>
        </Collapse>
    );
}
