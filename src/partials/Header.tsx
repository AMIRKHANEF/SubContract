import Brand from "./Brand";
import ChainSwitch from "../components/ChainSwitch";

export default function Header() {
    return (
        <div className="flex items-center justify-between p-4.5 border-b border-border-primary bg-bg-quaternary backdrop-blur-[10px] shadow-md">
            <Brand />
            <ChainSwitch />
        </div>
    );
}
