import { EXTENSION_NAME } from "../utils/constants";
import logo from '@/assets/logo/logo-SubContract.png'

export default function Brand() {
    return (
        <div className="flex items-center gap-3">
            <img
                src={logo}
                className="w-9.5 h-9.5"
            />

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
