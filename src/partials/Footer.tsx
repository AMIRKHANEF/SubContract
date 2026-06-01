import { EXTENSION_NAME } from "../utils/constants";
import manifest from "../manifest.json";


export default function Footer() {
    const version = manifest.version;

    return (
        <div className="py-1.5 px-2.5 border-t border-border-primary bg-bg-quaternary backdrop-blur-[10px] shadow-md flex items-center justify-between">
            <p className="text-text-muted text-xs">
                {EXTENSION_NAME + " v" + version}
            </p>

            <div className="flex gap-3">
                <div className="text-text-muted cursor-pointer hover:text-text-primary fast-transition">Docs</div>
                <div className="text-text-muted cursor-pointer hover:text-text-primary fast-transition">GitHub</div>
            </div>
        </div>
    );
}
