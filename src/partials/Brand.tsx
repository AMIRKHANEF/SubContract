import { EXTENSION_NAME } from "../utils/constants";

export default function Brand() {
    return (
        <div className="brand">
            <div className="brand-icon">SC</div>

            <div className="leading-normal">
                <div className="brand-title">
                    {EXTENSION_NAME}
                </div>
                <div className="brand-subtitle">
                    Smart Contract Workspace
                </div>
            </div>
        </div>
    );
}
