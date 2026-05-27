import { features } from "../../content";
import Collapse from "./ui/Collapse";
import SectionTitle from "./ui/SectionTitle";
import UtilityItem from "./UtilityItem";

export default function Utilities() {
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
                {features.map(({ description, icon, onClick, title }, index) => (
                    <UtilityItem
                        key={index}
                        description={description}
                        icon={icon}
                        onClick={onClick}
                        title={title}
                    />
                ))}

            </div>
        </Collapse>
    );
}
