import Brand from "./Brand";

export default function Header() {
    return (
        <div className="topbar">
            <Brand />
            <div className="network-pill">
                PAH
            </div>
        </div>
    );
}
