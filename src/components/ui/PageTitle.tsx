import PopupTitle from "./PopupTitle";
import Divider from "./Divider";
import { type LucideProps, ChevronLeft } from "lucide-react";

interface Props {
    text: string;
    Icon?: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
    onBackButton?: () => void;
}

export default function PageTitle({ text, onBackButton, Icon }: Props) {
    return (
        <div className="relative flex flex-col w-full h-fit gap-3.5">
            <PopupTitle
                title={text}
                Icon={Icon
                    ? <Icon size={28} className="text-accent-primary" />
                    : undefined}
            />
            <Divider />
            {onBackButton &&
                <ChevronLeft
                    size={34}
                    className="text-accent-primary absolute left-2 top-0.5 cursor-pointer rounded-full p-1 hover:bg-bg-hover fast-transition"
                    onClick={() => onBackButton()}
                />}
        </div>
    );
}
