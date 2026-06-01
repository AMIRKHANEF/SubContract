import { EXTENSION_NAME } from "../utils/constants";

export default function Brand() {
    return (
        <div className="flex items-center gap-3">
            <div className="w-9.5 h-9.5 flex items-center justify-center bg-accent-primary text-white font-bold rounded-lg text-smd brand-icon-bg">
                SC
            </div>

            <div className="leading-tight">
                <div className="text-lmd font-bold">
                    {EXTENSION_NAME}
                </div>
                <div className="text-xs font-normal text-text-muted mt-0.5">
                    Smart Contract Workspace
                </div>
            </div>
        </div>
    );
}
